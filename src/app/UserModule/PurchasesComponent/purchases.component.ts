import { Component, OnInit } from '@angular/core';
import { Base } from '../../AdminModule/_models/base';
import { CompleterData, CompleterService } from 'ng2-completer';
import { ActivatedRoute } from '@angular/router';
import { PaintPriceService } from '../_services/paint.price.service';
import { PaintService } from '../../_services/paint.service';
import { PurchaseService } from '../_services/purchase.service';
import { UserService } from '../_services/user.service';
import { Provider } from '../_models/providers';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../_services/product.service';

@Component({
  templateUrl: './purchases.component.html'
})

export class PurchasesComponent implements OnInit {

  public open: boolean = false;
  public delete_modal: boolean = false;

  public providers: Provider[] = [];
  public provider_selected: string = '';
  public purchases: any[] = [];
  public purchases_list: any[] = [];
  public pays: any[] = [];

  public dataService: CompleterData;
  public searchStr: string;

  public base_selected: any;

  private sub: any;
  public subsidiaryId: string;
  private objects: any[] = [];

  public selected_base_purchase: any;

  public payForm: FormGroup;
  public amount: FormControl;
  public type: FormControl;

  public loading_purchase: boolean = false;

  constructor(
    private paintsService: PaintPriceService,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private paintService: PaintService,
    private completerService: CompleterService,
    private router: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {

    this.sub = this.router.parent.params.subscribe(params => {
      this.subsidiaryId = params['id']
    });

    this.paintsService.base_list().subscribe(
      bases => {
        bases.map(b => {
          const obj = {
            type: 'base',
            _id: b._id,
            product_id: b.product_id,
            bar_code: b.bar_code,
            presentation: b.presentation,
            quantity: 1,
            price: b.price,
            description: b.description ? b.description : 'Base'
          };

          this.objects.push(obj);
        });
      }
    );

    this.paintService.ink_list().subscribe(
      inks => {
        inks.map(i => {
          const obj = {
            type: 'ink',
            _id: i._id,
            product_id: i.product_id,
            bar_code: i.bar_code,
            presentation: '1L',
            quantity: 1,
            price: i.price,
            description: i.description
          };

          this.objects.push(obj);
        })
      }
    )

    this.productService.products_list(this.subsidiaryId).subscribe(
      products => {
        products.map(p => {
          const obj = {
            type: 'product',
            _id: p.po,
            product_id: p.product_id,
            bar_code: p.bar_code,
            quantity: 1,
            price: p.price,
            description: p.description,
            presentation: p.unit
          };

          this.objects.push(obj);
        });
      }
    )

    this.dataService = this.completerService.local(this.objects, 'product_id,bar_code,description', 'product_id,bar_code,description');

    this.purchaseService.purchase_list(this.subsidiaryId).subscribe(
      purchases => this.purchases = purchases
    )

    this.userService.provider_list().subscribe(
      providers => this.providers = providers
    )

    this.amount = this.fb.control('', Validators.required);
    this.type = this.fb.control('cash', Validators.required);

    this.payForm = this.fb.group({
      amount: this.amount,
      type: this.type
    })
  }

  createPurchase() {
    this.loading_purchase = true;
    let purchase = {
      bases: [],
      inks: [],
      products_owner: [],
      provider: this.provider_selected,
      pays: this.pays,
      date: (new Date).getTime()
    }

    this.purchases_list.map(p => {
      if (p.type === 'ink') {
        const ink = {
          ink: p._id,
          quantity: p.quantity,
          total: p.quantity * p.price
        };
        purchase.inks.push(ink);
      } else if (p.type === 'base') {
        const base = {
          base: p._id,
          quantity: p.quantity,
          total: p.quantity * p.price
        };
        purchase.bases.push(base);
      } else {
        const product = {
          product: p._id,
          quantity: p.quantity,
          total: p.quantity * p.price
        };
        purchase.products_owner.push(product);
      }
    });

    if (purchase.provider === '') {
      delete purchase.provider;
    }

    this.purchaseService.create_purchase(this.subsidiaryId, purchase).subscribe(
      p => {
        this.purchases.push(p);
        this.pays = [];
        this.purchases_list = [];
        this.open = false;
        this.loading_purchase = false;
      }
    )
  }

  getTotal(purchases) {
    let total = 0;
    purchases.map(p => total += (p.price * p.quantity));
    return total;
  }

  getTotalPays(pays) {
    let total = 0;
    pays.map(p => total += p.amount);
    return total;
  }

  getTotalPurchase(purchase) {
    let total = 0;
    purchase.inks.map(i => total += i.total);
    purchase.bases.map(b => total += b.total);
    purchase.products_owner.map(p => total += p.total);

    return total;
  }

  selectObject(obj) {
    console.log(obj)
    /* this.bases_selected.push(base.originalObject);
    console.log(this.bases_selected); */
    this.purchases_list.push(obj.originalObject)
  }

  addPay() {
    const difference = this.getTotal(this.purchases_list) - this.getTotalPays(this.pays);
    if (difference) {
      if (difference < this.payForm.value.amount) {
        this.amount.setValue(difference);
        this.pays.push(this.payForm.value);
        this.payForm.reset();
      } else {
        this.pays.push(this.payForm.value);
        this.payForm.reset();
      }
    }
  }

  removePurchase(purchase) {
    this.purchases_list = this.purchases_list.filter(p => p._id !== purchase._id)
  }

  removePay(pay) {
    this.pays = this.pays.filter(p => p !== pay);
  }

  open_modal() {
    this.open = true;
  }

  open_delete_modal(purchase) {
    this.selected_base_purchase = purchase;
    this.delete_modal = true;
    console.log(this.selected_base_purchase);
  }


  confirm_delete() {
    this.purchaseService.delete_purchase(this.subsidiaryId, this.selected_base_purchase._id).subscribe(
      pb => {
        this.purchases = this.purchases.filter(p => p._id !== pb._id);
        this.delete_modal = false;
      }
    )
  }
}
