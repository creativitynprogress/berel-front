import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Observable } from 'rxjs/Rx';
import {Wizard} from "@clr/angular";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './products.price.component.html'
})

export class ProductsPriceComponent implements OnInit {

  public productForm: FormGroup;
  public product_id: FormControl;
  public description: FormControl;
  public category: FormControl;
  public unit: FormControl;
  public salePrice: FormControl;
  public noiva: FormControl;
  public bar_code: FormControl;
  public brand: FormControl;
  public stock: FormControl;
  public price: FormControl;
  public min: FormControl;
  public max: FormControl;

  @ViewChild('wizard') wizard: Wizard;
  public open: boolean = false;
  public products: any[] = [];
  public categories = ['Base agua', 'Esmaltes', 'Impermeabilizantes', 'Barnices',
  'Construcción', 'Decorativos', 'Primarios', 'Industria', 'Varios', 'Fester', 'Panel Rey', 'Accesorios'];
  public units = ['SCO25', 'SCO5', 'BL2', 'BL5', 'SCO20', 'PZA', 'CB', 'GL', 'LT', 'QT', 'MD', 'RL'];

  public showForm: boolean = false;
  public subsidiaryId: string;
  public sub: any;

  public withoutiva: number;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.sub = this.route.parent.params.subscribe(
      params => this.subsidiaryId = params['id']
    )

    this.product_id = this.fb.control('', Validators.required);
    this.description = this.fb.control('', Validators.required);
    this.brand = this.fb.control('', Validators.required);
    this.category = this.fb.control('', Validators.required);
    this.salePrice = this.fb.control('', Validators.required);
    this.unit = this.fb.control('', Validators.required);
    this.bar_code = this.fb.control('', Validators.required);
    this.stock = this.fb.control('');
    this.noiva = this.fb.control('');
    this.price = this.fb.control('', Validators.required);
    this.min = this.fb.control(0);
    this.max = this.fb.control(100);

    this.productForm = this.fb.group({
      product_id: this.product_id,
      description: this.description,
      category: this.category,
      brand: this.brand,
      bar_code: this.bar_code,
      unit: this.unit,
      salePrice: this.salePrice,
      stock: this.stock,
      noiva: this.noiva,
      price: this.price,
      min: this.min,
      max: this.max,
      _id: 'no'
    });

    this.productService.products_list(this.subsidiaryId).subscribe(
      products => {
        this.products = products;
      }
    )
  }

  productCreate() {
    console.log(this.productForm.value)
    if (this.productForm.value._id) {
      this.productService.po_update(this.subsidiaryId, this.productForm.value).subscribe(
        product => {
          this.showForm = false;
          this.products = this.products.map(p => {
            if (p._id === product._id) {
              p = product;
            }
            return p;
          })
        }
      )
    } else {
      delete this.productForm.value._id;
      this.productService.po_create(this.subsidiaryId, this.productForm.value).subscribe(
        product => {
          this.products.push(product);
          this.productForm.reset();
          this.showForm = false;
        }
      )
    }
  }

  productDelete(product) {
    if (product.po) {
      this.productService.product_owner_delete(this.subsidiaryId, product.po).subscribe(
        product => {
          this.products = this.products.filter(p => p.po !== product.po)
        }
      )
    }
  }

  openForm(product?) {
    if (product) {
      product._id = product.po;
      product.noiva = product.salePrice * 0.16;

      //delete product.po;

      this.productForm.patchValue(product);
    } else {
      this.productForm.reset()
    }
    this.showForm = true;
  }

  public openWizzard(): void {
    this.open = true;
  }

  calculateWithOutIva() {
    this.salePrice.setValue((this.noiva.value * 100) / 84);
  }

  calculateWithIva() {
    const amount = this.salePrice.value * 0.16;
    this.noiva.setValue((this.salePrice.value - amount).toFixed(2));
  }
}
