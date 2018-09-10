import { Component, OnInit, OnDestroy } from "@angular/core";
import { timepickerOptions } from "../../_shared.ts/timepicker.options";
import { Ticket } from "../../_models/ticket";
import { TicketService } from "../../_services/ticket.service";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../../_services/user.service";
import { Card } from "../../_models/card";
import { LineService } from "../../../_services/line.service";
import { Line } from "../../../_models/line";

@Component({
  templateUrl: "./ticket.sales.component.html"
})
export class TicketSalesComponent implements OnInit, OnDestroy {
  public options = timepickerOptions;
  public model_dates: any;

  public sales = [];
  public sales_filter = [];

  subsidiaryId: string;
  private sub: any;

  public cards: Card[] = [];
  public lines: Line[] = [];

  public pay_type: string = "select";
  public sales_type: string = "all";
  public product_id: string = "";
  public line: string = "select";
  public card: string = "select";
  public employee_name: string= '';
  public client_name: string = '';

  private initial_date: number = 0;
  private final_date: number = 0;

  public invoice_type: string = '';
  public reasons = [
    'Adquisición de mercancias',
    'Devoluciones, descuentos o bonificaciones',
    'Gastos en general',
    'Construcciones',
    'Mobiliario y equipo de oficina por inversores',
    'Equipo de transporte',
    'Equipo de computo y accesorios',
    'Dados, troqueles, moldes, matrices y herramental',
    'Comunicaciones telefónicas',
    'Comunicaciones satelitales',
    'Otra maquinaria y equipo',
    'Gastos funerales',
    'Donativos',
    'Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)',
    'Aportaciones voluntarias al SAR',
    'Por definir'
  ];

  public cancel_type: string = '';

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private userService: UserService,
    private lineService: LineService
  ) {}

  ngOnInit() {
    this.sub = this.route.parent.parent.params.subscribe(
      params => (this.subsidiaryId = params["id"])
    );

    this.ticketService.tickets_sales(this.subsidiaryId).subscribe(tickets => {
      this.sales = tickets;
      this.sales_filter = tickets;
    });

    this.userService.card_list().subscribe(cards => (this.cards = cards));

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

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  selectDates(dates) {
    this.initial_date = Number(dates.beginEpoc.toString() + "000");
    this.final_date = Number(dates.endEpoc.toString() + "000");

    console.log(dates);
    if (dates.beginEpoc !== 0 && dates.endEpoc !== 0) {
      this.sales_filter = this.sales.filter(s => {
        const date = Number(s.date.toString().substring(0, 10));
        if (date >= dates.beginEpoc && date <= dates.endEpoc) {
          console.log("entro");
          return s;
        }
      });
    } else {
      this.sales_filter = this.sales;
    }
  }

  filterTickets() {
    if (this.initial_date !== 0 && this.final_date !== 0) {
      this.sales_filter = this.sales.filter(s => {
        if (s.date >= this.initial_date && s.date <= this.final_date) {
          return s;
        }
      });
    } else {
      this.sales_filter = this.sales;
    }

    if (this.invoice_type !== '' && this.invoice_type !== null) {
      if (this.invoice_type === 'any_invoice') {
        this.sales_filter = this.sales_filter.filter(p => p.invoice !== '');
      } else if (this.invoice_type === 'no_invoice') {
        this.sales_filter = this.sales_filter.filter(p => p.invoice === '');
      } else {
        this.sales_filter = this.sales_filter.filter(p => p.invoice === this.invoice_type);
      }
    }

    if (this.cancel_type !== '' && this.cancel_type !== null) {
      if (this.cancel_type === 'canceled') {
        this.sales_filter = this.sales_filter.filter(p => p.canceled === true);
      } else {
        this.sales_filter = this.sales_filter.filter(p => p.canceled === false);
      }
    }

    if (this.employee_name !== '' && this.employee_name !== null) {
      this.sales_filter = this.sales_filter.filter(p => p.seller.toLowerCase().includes(this.employee_name.toLowerCase()));
    }

    if (this.client_name !== '' && this.client_name !== null) {
      this.sales_filter = this.sales_filter.filter(p => p.client.toLowerCase().includes(this.client_name.toLowerCase()));
    }

    if (this.pay_type !== "select") {
      this.sales_filter = this.sales_filter.filter(s => {
        const exist = s.pay_type.find(pt => pt === this.pay_type);
        if (exist) {
          return s;
        }
      });
    }

    if (this.sales_type !== "all") {
      if (this.sales_type === "paints_bases") {
        this.sales_filter = this.sales_filter.filter(s => {
          if (s.line) {
            return s;
          }
        });

        if (this.line !== "select") {
          this.sales_filter = this.sales_filter.filter(
            s => s.line === this.line
          );
        }
      } else {
        this.sales_filter = this.sales_filter.filter(s => {
          if (!s.line) {
            return s;
          }
        });
      }

      if (this.product_id !== '' && this.product_id !== null) {
        this.sales_filter = this.sales_filter.filter(s => {
          if (s.product_id.includes(this.product_id)) {
            return s;
          }

          if (s.description && s.description.toLowerCase().includes(this.product_id.toLowerCase())) {
            return s;
          }
        });
      }
    }
  }
}
