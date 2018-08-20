import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaintPriceService } from '../_services/paint.price.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  templateUrl: './inksubsidiary.component.html'
})

export class InkSubsidiaryComponent implements OnInit {

  public user: any;
  public subsidiaryId: string;
  public sub: any;
  public inks: any[] = []
  public is_selected: any;
  modal:boolean = false;

  constructor(
    private paintPriceService: PaintPriceService,
    private route: ActivatedRoute
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.sub = this.route.parent.params.subscribe(
      params => this.subsidiaryId = params['id']
    )

    this.paintPriceService.ink_subsidiary_list(this.subsidiaryId).subscribe(
      inks => {
        this.inks = inks;
      }
    )
  }

  minmax(is) {
    this.modal = true;
    this.is_selected = is;
  }

  update_is() {
    this.paintPriceService.ink_subsidiary_update(this.subsidiaryId, this.is_selected).subscribe(
      is => {
        this.inks = this.inks.map(i => {
          if(i._id === is._id) {
            i = is;
          }

          return i;
        })

        this.modal = false;
      }
    )
  }
}
