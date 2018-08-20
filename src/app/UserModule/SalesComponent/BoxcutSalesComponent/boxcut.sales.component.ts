import { Component, OnInit, OnDestroy } from "@angular/core";
import { TicketService } from "../../_services/ticket.service";
import { ActivatedRoute } from "@angular/router";
import { BoxCut } from "../../_models/boxcut";
import { timepickerOptions } from "../../_shared.ts/timepicker.options";

@Component({
  templateUrl: './boxcut.sales.component.html'
})

export class BoxcutSalesComponent implements OnInit {
  public boxcuts: BoxCut[] = [];
  public boxcuts_filter: BoxCut[] = [];
  public subsidiaryId: string;
  public sub: any;

  public options = timepickerOptions;
  public model_dates: any;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.sub = this.route.parent.params.subscribe(
      params => this.subsidiaryId = params['id']
    )

    this.ticketService.boxcut_list(this.subsidiaryId).subscribe(
      boxcuts => {
        this.boxcuts = boxcuts;
        this.boxcuts_filter = boxcuts;
      }
    )

    const date = new Date();
    this.model_dates = {
      beginDate: {year: 2018, month: 1, day: 1},
      endDate: {year: date.getFullYear(), month: date.getMonth(), day: date.getDate()}
    };
  }

  filterBydate(dates) {
    if (dates.beginEpoc !== 0 && dates.endEpoc !== 0) {
      this.boxcuts_filter = this.boxcuts.filter(b => {
        const date = Number(b.date.toString().substring(0, 10));
        if (date >= dates.beginEpoc && date <= dates.endEpoc) {
          return b;
        }
      });
    } else {
      this.boxcuts_filter = this.boxcuts;
    }
  }
}
