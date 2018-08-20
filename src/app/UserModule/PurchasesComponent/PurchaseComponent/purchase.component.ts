import { Component, OnInit } from '@angular/core';
import { Base } from '../../../AdminModule/_models/base';
import { CompleterData, CompleterService } from 'ng2-completer';
import { ActivatedRoute } from '@angular/router';
import { PaintPriceService } from '../../_services/paint.price.service';
import { PaintService } from '../../../_services/paint.service';
import { PurchaseService } from '../../_services/purchase.service';

@Component({
  templateUrl: './purchase.component.html'
})

export class PurchaseComponent implements OnInit {

  public purchases: any[] = [];

  public dataService: CompleterData;
  public searchStr: string;

  private sub: any;
  public subsidiaryId: string;

  private objects: any[] = []

  constructor(
    private paintsService: PaintPriceService,
    private purchaseService: PurchaseService,
    private paintService: PaintService,
    private completerService: CompleterService,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paintsService.base_list().subscribe(
      bases => {
        bases.map(b => {
          let obj = {
            type: 'base',
            _id: b._id,
            product_id: b.product_id,
            bar_code: b.bar_code,
            presentation: b.presentation,
            quantity: 1,
            price: b.price
          };

          this.objects.push(obj);
        });
      }
    );

    this.paintService.ink_list().subscribe(
      inks => {
        inks.map(i => {
          let obj = {
            type: 'ink',
            _id: i._id,
            product_id: i.product_id,
            bar_code: i.bar_code,
            presentation: '1L',
            quantity: 1,
            price: i.price
          };

          this.objects.push(obj);
        })
      }
    )

    this.dataService = this.completerService.local(this.objects, 'product_id,bar_code', 'product_id,bar_code');
  }


  selectObject(obj) {
    console.log(obj)
    /* this.bases_selected.push(base.originalObject);
    console.log(this.bases_selected); */
    this.purchases.push(obj.originalObject)
  }

  createPurchaseBase() {

  }

  getTotal(purchases) {
    let total = 0;
    purchases.map(p => total += (p.price * p.quantity));
    return total;
  }

}
