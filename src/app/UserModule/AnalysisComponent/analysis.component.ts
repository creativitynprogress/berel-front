import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { timepickerOptions } from "../_shared.ts/timepicker.options";
import { DatePipe } from "@angular/common";
import { AnalysisService } from "./analysis.service";
import { BaseChartDirective } from "ng2-charts";
@Component({
  templateUrl: "./analysis.component.html"
})
export class AnalysisComponent implements OnInit {
  @ViewChild(BaseChartDirective) public chart: BaseChartDirective;

  public options = timepickerOptions;
  public model_dates: any;

  private incomes: any[] = [];
  private expenses: any[] = [];
  public lineChartData: Array<any> = [
    { data: this.incomes, label: "Ingresos" },
    { data: [], label: "Egresos" }
  ];
  public lineChartLabels: Array<any> = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];
  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            // Include a dollar sign in the ticks
            callback: function(value, index, values) {
              return (
                "$" + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
              );
            }
          }
        }
      ]
    },
    tooltips: {
      callbacks: {
          label: function(tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                  label += ': $';
              }
              label += Math.round(tooltipItem.yLabel * 100) / 100;
              return label;
          }
      }
  }
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(197, 225, 165, 0.2)",
      borderColor: "#8BC34A",
      pointBackgroundColor: "rgba(104, 159, 56,1)",
      pointBorderColor: "rgba(51, 105, 30,1)",
      //pointHoverBackgroundColor: "rgba(51, 105, 30,1)",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    },
    {
      // dark grey
      backgroundColor: "rgba(255, 235, 238,0.2)",
      borderColor: "rgba(213, 0, 0, 1)",
      pointBackgroundColor: "rgba(255, 235, 238,0.2)",
      pointBorderColor: "rgba(213, 0, 0, 1)",
      pointHoverBackgroundColor: "rgba(213, 0, 0, 1)",
      pointHoverBorderColor: "rgba(213, 0, 0, 1)"
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = "line";

  private sub: any;
  private subsidiaryId: string;

  constructor(
    private route: ActivatedRoute,
    private analysisService: AnalysisService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.sub = this.route.parent.parent.params.subscribe(
      params => (this.subsidiaryId = params["id"])
    );

    const date = new Date();
    this.model_dates = {
      beginDate: { year: 2018, month: 1, day: 1 },
      endDate: {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate()
      }
    };

    this.analysisService.get_results(this.subsidiaryId).subscribe(response => {
      console.log(response);

      this.incomes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.expenses = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      response.incomes.forEach(t => {
        const date = new Date(t.date).getMonth();
        this.incomes[date] += t.total;
      });

      response.purchases.map(p => {
        const date = new Date(p.date).getMonth();
        this.expenses[date] += this.calculate_total(p.bases);
        this.expenses[date] += this.calculate_total(p.inks);
        this.expenses[date] += this.calculate_total(p.products_owner);
      });

      this.lineChartData = [
        { data: this.incomes, label: "Ingresos" },
        { data: this.expenses, label: "Egresos" }
      ];
    });
  }

  filterBydate(dates) {
    console.log(dates);
    const initial_date = dates.beginJsDate;
    const end_date = dates.endJsDate;

    const total_days = (end_date - initial_date) / (1000 * 60 * 60 * 24);

    if (total_days <= 30 && total_days > 0) {
      this.lineChartLabels.length = 0;

      for (let i = 0; i <= total_days; i++) {
        const date = new Date(
          initial_date.getFullYear(),
          initial_date.getMonth(),
          initial_date.getDate() + i
        );
        this.lineChartLabels.push(this.datePipe.transform(date, "dd/MM"));
      }

      this.analysisService
        .get_results(this.subsidiaryId, {
          initial: initial_date.getTime(),
          end: end_date.getTime()
        })
        .subscribe(response => {
          console.log(response);

          this.incomes = [];
          this.expenses = [];
          const oneDay = 24 * 60 * 60 * 1000;

          for (let i = 0; i <= total_days; i++) {
            this.incomes.push(0);
            this.expenses.push(0);
          }

          response.incomes.forEach(t => {
            const diffDays = Math.round(Math.abs((new Date(t.date).getTime() - initial_date.getTime()) / (oneDay)));
            this.incomes[diffDays] += t.total;
          });

          response.purchases.map(p => {
            const diffDays = Math.round(Math.abs((new Date(p.date).getTime() - initial_date.getTime()) / (oneDay)));
            this.expenses[diffDays] += this.calculate_total(p.bases);
            this.expenses[diffDays] += this.calculate_total(p.inks);
            this.expenses[diffDays] += this.calculate_total(p.products_owner);
          });

          this.lineChartData = [
            { data: this.incomes, label: "Ingresos" },
            { data: this.expenses, label: "Egresos" }
          ];

          console.log(this.incomes);

          this.chart.chart.update();
        });

      console.log(total_days);
    } else {
      // Gráfica para meses
      this.lineChartLabels.length = 0;
      console.log(initial_date.getMonth(), end_date.getMonth());

      const month_initial = initial_date.getMonth();
      const month_end = end_date.getMonth();

      const month_lenth = month_end - month_initial;

      for (let i = 0; i <= month_lenth; i++) {
        const date = new Date(
          initial_date.getFullYear(),
          initial_date.getMonth() + i
        );
        this.lineChartLabels.push(this.datePipe.transform(date, "MMMM"));
      }

      this.analysisService
        .get_results(this.subsidiaryId, {
          initial: initial_date.getTime(),
          end: end_date.getTime()
        })
        .subscribe(response => {
          console.log(response);

          this.incomes = [];
          this.expenses = [];

          for (let i = 0; i <= month_lenth; i ++) {
            this.incomes.push(0);
            this.expenses.push(0);
          }

          response.incomes.forEach(t => {
            const date = new Date(t.date).getMonth() - initial_date.getMonth();
            this.incomes[date] += t.total;
          });

          response.purchases.map(p => {
            const date = new Date(p.date).getMonth() - initial_date.getMonth();
            this.expenses[date] += this.calculate_total(p.bases);
            this.expenses[date] += this.calculate_total(p.inks);
            this.expenses[date] += this.calculate_total(p.products_owner);
          });

          this.lineChartData = [
            { data: this.incomes, label: "Ingresos" },
            { data: this.expenses, label: "Egresos" }
          ];

          this.chart.chart.update();
        });
    }
  }

  public calculate_total(purchases) {
    let total = 0;
    purchases.map(p => (total += p.total));
    return total;
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
