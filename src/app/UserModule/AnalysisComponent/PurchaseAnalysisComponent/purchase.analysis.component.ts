import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PurchaseService } from "../../_services/purchase.service";
import { timepickerOptions } from "../../_shared.ts/timepicker.options";
import { LineService } from "../../../_services/line.service";

@Component({
  templateUrl: "./purchase.analysis.component.html"
})
export class PurchaseAnalysisComponent implements OnInit {
  sub: any;
  subsidiaryId: string;
  purchases: any[] = [];
  purchases_filter: any[] = [];
  lines: any[] = []

  purchase_type: string = 'all';
  line: string = 'select';
  product_id: string = '';

  public options = timepickerOptions;
  public model_dates: any;

  private initial_date: number = 0;
  private final_date: number = 0;

  constructor(
    private route: ActivatedRoute,
    private purchasesService: PurchaseService,
    private lineService: LineService
  ) {}

  ngOnInit() {
    this.sub = this.route.parent.parent.params.subscribe(params => {
      this.subsidiaryId = params["id"];
    });

    this.purchasesService
      .purchase_list_analysis(this.subsidiaryId)
      .subscribe(purchases => {
        this.purchases = purchases;
        this.purchases_filter = purchases;
      });

      this.lineService.line_list().subscribe(lines => (this.lines = lines));

      const date = new Date();
      this.model_dates = {
        beginDate: { year: 2018, month: 1, day: 1 },
        endDate: {
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate()
        }
      };
  }

  selectDates(dates) {
    this.initial_date = Number(dates.beginEpoc.toString() + "000");
    this.final_date = Number(dates.endEpoc.toString() + "000");

    if (dates.beginEpoc !== 0 && dates.endEpoc !== 0) {
      this.purchases_filter = this.purchases.filter(s => {
        const date = Number(s.date.toString().substring(0, 10));
        if (date >= dates.beginEpoc && date <= dates.endEpoc) {
          return s;
        }
      });
    } else {
      this.purchases_filter = this.purchases;
    }
  }

  filter() {
    if (this.initial_date !== 0 && this.final_date !== 0) {
      this.purchases_filter = this.purchases.filter(s => {
        if (s.date >= this.initial_date && s.date <= this.final_date) {
          return s;
        }
      });
    } else {
      this.purchases_filter = this.purchases;
    }

    if (this.purchase_type !== "all") {
      if (this.purchase_type === "paints_bases") {
        this.purchases_filter = this.purchases_filter.filter(s => s.line);
        if (this.line !== "select") {
          this.purchases_filter = this.purchases_filter.filter(
            s => s.line === this.line
          );
        }
      } else {
        this.purchases_filter = this.purchases_filter.filter(s => {
          if (!s.line) {
            return s;
          }
        });
      }

      if (this.product_id !== '' && this.product_id !== null) {
        this.purchases_filter = this.purchases_filter.filter(s => s.product_id === this.product_id);
      }
    }
  }

}
