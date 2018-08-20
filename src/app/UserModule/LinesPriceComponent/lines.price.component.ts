import { Component, OnInit } from '@angular/core';
import { SubsidiaryRangeService } from '../_services/subsidiary.range.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  templateUrl: './lines.price.component.html'
})

export class LinesPriceComponent implements OnInit {
  public line_selected: any = { _id: null };
  public lines: any[] = [];
  public subsidiary_ranges: any[] = []
  public subsidiaryId: string;

  public sr_form: boolean = false;
  public item_selected: any;

  constructor(
    private srService: SubsidiaryRangeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.srService.line_list().subscribe(
      lines => {
        this.lines = lines;
      }
    )

    this.route.parent.params.subscribe(
      params => this.subsidiaryId = params['id']
    )
  }

  selectLine(line) {
    this.line_selected = line;
    this.srService.sr_list(this.subsidiaryId, this.line_selected._id).subscribe(
      subsidiary_ranges => {
        this.subsidiary_ranges = subsidiary_ranges;
      }
    )
  }

  srShowModal(item) {
    if (!item.sr ) {
      item.sr = {
        liter: null,
        gallon: null,
        bucket: null
      }
    }
    this.item_selected = item;
    this.sr_form = true;
  }

  srSave() {
    if (this.item_selected.sr && this.item_selected.sr._id) {
      this.srService.sr_update(this.subsidiaryId, this.line_selected._id, this.item_selected.range._id, this.item_selected.sr).subscribe(
        sr => {
          this.subsidiary_ranges = this.subsidiary_ranges.map(r => {
            if (r.range._id === sr.range) {
              r.sr = sr;
            }
            return r;
          })
          this.sr_form = false;
        }
      )
    } else {
      this.srService.sr_create(this.subsidiaryId, this.line_selected._id, this.item_selected.range._id, this.item_selected.sr).subscribe(
        sr => {
          this.subsidiary_ranges = this.subsidiary_ranges.map(r => {
            if (r.range._id === sr.range) {
              r.sr = sr;
            }
            return r;
          })
          this.sr_form = false;
        }
      )
    }
  }


}
