import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaintPriceService } from '../_services/paint.price.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './base.subsidiary.component.html',
  styleUrls: ['./base.subsidiary.component.css']
})

export class BaseSubsidiaryComponent implements OnInit {

  public subsidiaryId: string;
  public sub: any;
  public bases: any[] = []
  public bs_selected: any;

  public user: any;

  modal:boolean = false;
  modal2: boolean = false;

  constructor(
    private paintPriceService: PaintPriceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));

    this.sub = this.route.parent.params.subscribe(
      params => this.subsidiaryId = params['id']
    );

    this.paintPriceService.base_subsidiary_list(this.subsidiaryId).subscribe(
      bases => {
        this.bases = bases.sort(this.sortBases);
      }
    )
  }

  sortBases(a, b) {
    if ((a.stock <= a.min) || (a.stock === a.min)) {
      return -1;
    } else { return 1; }
  }

  minmax(bs) {
    this.modal = true;
    this.bs_selected = bs;
  }

  sale_price(bs) {
    this.modal2 = true;
    this.bs_selected = bs;
  }

  update_bs() {
    this.paintPriceService.base_update(this.subsidiaryId, this.bs_selected).subscribe(
      bs => {
        this.bases = this.bases.map(b => {
          if (b._id === bs._id) {
            b = bs;
          }

          return b;
        })

        this.bases = this.bases.sort(this.sortBases);
        this.modal = false;
        this.modal2 = false;
      }
    )
  }
}
