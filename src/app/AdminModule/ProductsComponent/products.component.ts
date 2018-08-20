import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Observable } from 'rxjs/Rx';
import {Wizard} from "@clr/angular";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {Product} from '../_models/product';
import { LineService } from '../../_services/line.service';
import { Line } from '../../_models/line';
@Component({
  templateUrl: './products.component.html'
})

export class ProductsComponent implements OnInit {

  public productForm: FormGroup;
  public product_id: FormControl;
  public bar_code: FormControl;
  public description: FormControl;
  public category: FormControl;
  public unit: FormControl;
  public suggestedPrice: FormControl;

  @ViewChild('wizard') wizard: Wizard;
  public open: boolean = false;
  public delete: boolean = false;
  public productId_selected: string;
  public products: Product[] = [];
  public categories = ['Impermeabilizantes', 'Barnices',
  'Construcción', 'Decorativos', 'Primarios', 'Industria', 'Varios'];
  public units = ['LT', 'CB', 'GL'];
  public lines: Line[] = [];

  constructor(
    private productService: ProductService,
    private lineService: LineService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.product_id = this.fb.control('', Validators.required);
    this.description = this.fb.control('', Validators.required);
    this.category = this.fb.control('', Validators.required);
    this.suggestedPrice = this.fb.control('', Validators.required);
    this.unit = this.fb.control('', Validators.required);
    this.bar_code = this.fb.control('');

    this.productForm = this.fb.group({
      _id: '',
      product_id: this.product_id,
      bar_code: this.bar_code,
      description: this.description,
      category: this.category,
      unit: this.unit,
      suggestedPrice: this.suggestedPrice
    });

    this.lineService.line_list().subscribe(
      lines => this.lines = lines
    )

    this.productService.product_list().subscribe(
      products => {
        this.products = products;
      }
    )
  }

  productUpdate() {
    if (!this.productForm.value._id) {
      delete this.productForm.value._id;
      this.productService.product_create(this.productForm.value).subscribe(
        product => {
          this.products.push(product);
          this.productForm.reset();
        }
      )
    } else {
      this.productService.product_update(this.productForm.value).subscribe(
        product => {
          this.products = this.products.map(p => {
            if (p._id === product._id) {
              p = product;
            }
            return p;
          });
          this.productForm.reset();
        }
      )
    }
  }

  public productDelete() {
    this.productService.product_delete(this.productId_selected).subscribe(
      product => {
        this.products = this.products.filter(p => p._id !== product._id)
        this.delete = false;
      }
    )
  }

  public openWizzard(product?): void {
    if (product) {
      delete product.createdAt;
      delete product.updatedAt;
      this.productForm.setValue(product);
    }
    this.open = true;
  }

  public confirmDelete(id) {
    this.productId_selected = id;
    this.delete = true;
  }
}
