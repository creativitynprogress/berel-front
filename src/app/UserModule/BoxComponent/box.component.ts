import { Component, OnInit, OnDestroy } from '@angular/core';
import {
   FormControl, FormGroup, Validators
} from "@angular/forms";
import { SubsidiaryService } from "../_services/subsidiary.service";
import { Subsidiary } from "../_models/subsidiary";
import { CurrencyPipe } from "@angular/common";
import { Ticket } from "../_models/ticket";
import { ActivatedRoute } from "@angular/router";
import { TicketService } from "../_services/ticket.service";
import { AuthenticationService } from '../../_services/authentication.service'
import { PaintShared } from "../_shared.ts/paint.shared";
import { ProductShared } from '../_shared.ts/product.shared';
import { ClientShared } from '../_shared.ts/client.shared';
import { TicketShared } from '../_shared.ts/ticket.shared';
import { SnotifyService } from 'ng-snotify';

declare const electron: any;

@Component({
  templateUrl: "./box.component.html",
  styleUrls: ["./box.component.css"]
})
export class BoxComponent implements OnInit, OnDestroy {

  /* protected paints: Paint[] = []; */
  public ticket: Ticket = {
    paints: [],
    products: [],
    bases: [],
    total: 0,
    date: 0,
    discount: {quantity: 0, percentage: 0},
    invoice: { state: 'no', reason: ''},
    seller: JSON.parse(localStorage.getItem('currentUser')),
    payed: false
  };

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
  public reason: string = 'Adquisición de mercancias';
  public subsidiaryId: string = "";
  public subsidiary: Subsidiary;

  /* protected products: Product[]; */

  public saving_ticket: boolean = false;
  public invoice: boolean = false;
  public discount: boolean = false;
  public add_discount: boolean = false;

  public cancelModal: boolean = false;
  public canceling: boolean = false;
  public authorizationForm: FormGroup;

  sub1: any;
  sub2: any;
  sub3: any;

  constructor(
    private route: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
    private ticketService: TicketService,
    private subsidiaryService: SubsidiaryService,
    private paintShared: PaintShared,
    private productShared: ProductShared,
    private clientShared: ClientShared,
    private ticketShared: TicketShared,
    private snotifyService: SnotifyService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.ticket.seller = JSON.parse(localStorage.getItem('currentUser'))

    this.route.parent.params.subscribe(params => {
      this.subsidiaryId = params["id"];
    });

    this.subsidiaryService
      .subsidiary_details(this.subsidiaryId)
      .subscribe(subsidiary => (this.subsidiary = subsidiary));

    this.sub1 = this.paintShared.get_paints().subscribe(paint => {
      if (!this.ticket._id) {
        this.ticket.paints.push(paint);
        this.ticket.total += paint.price;
        this.discount = this.add_discount = false;
        this.ticket.discount.quantity = this.ticket.discount.percentage = 0;
      } else {
        this.snotifyService.warning('Selecciona nuevo ticket para agregar elementos.', {showProgressBar: false});
      }
    });

    this.sub2 = this.paintShared.get_bases().subscribe(base => {
      if (!this.ticket._id) {
        this.ticket.bases.push(base);
        this.ticket.total += base.price;
        this.discount = this.add_discount = false;
        this.ticket.discount.quantity = this.ticket.discount.percentage = 0;
      } else {
        this.snotifyService.warning('Selecciona nuevo ticket para agregar elementos.', { showProgressBar: false})
      }
    })

    this.sub3 = this.productShared.get_products().subscribe(product => {
      if (!this.ticket._id) {
        this.ticket.products.push(product);
        this.ticket.total += product.price;
        this.discount = this.add_discount = false;
        this.ticket.discount.quantity = this.ticket.discount.percentage = 0;
      } else {
        this.snotifyService.warning('Selecciona nuevo ticket para agregar artículos.', {showProgressBar: false});
      }
    })

    this.clientShared.get_clients().subscribe(client => {
      if (!this.ticket._id) {
        this.ticket.client = client;
      }
    })

    this.ticketShared.get_tickets().subscribe(
      ticket => {
        if (this.ticket._id !== ticket._id) {
          this.ticketService.ticket_details(ticket._id).subscribe(
            ticket_details => {
              this.ticket = ticket_details;
            }
          )
        }
      }
    )

    this.ticketShared.listen_update().subscribe( ticket => {

        this.ticket = ticket;

    });

    this.authorizationForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    console.log(this.ticket)
  }

  ngOnDestroy () {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }

    if (this.sub2) {
      this.sub2.unsubscribe();
    }

    if (this.sub3) {
      this.sub3.unsubscribe();
    }
  }

  invoiceTicket(invoice) {
    if (this.invoice) {
      this.ticket.invoice.state = 'pending';
      this.ticket.invoice.reason = this.reason;
    } else {
      this.ticket.invoice.state = 'no';
      this.ticket.invoice.reason = '';
    }
  }

  removeClient() {
    this.ticket.client = "";
  }

  calculatePercentage(quantity) {
    this.ticket.discount.quantity = quantity;
    this.ticket.discount.percentage = ((quantity * 100) / this.ticket.total).toFixed(0);
  }

  calculateQuantity(percentage) {
    this.ticket.discount.quantity = ((percentage * this.ticket.total)/ 100).toFixed(0);
  }


  removePaint(paint) {
    this.ticket.paints = this.ticket.paints.filter(
      p => p.presentationId !== paint.presentationId
    );
    this.ticket.total -= paint.price;
  }

  removeBase(base) {
    this.ticket.bases = this.ticket.bases.filter( b => b.product_id !== base.product_id);

    this.ticket.total -= base.price;
  }

  removeProduct(product) {
    let removed = false;
    this.ticket.products = this.ticket.products.filter(p => {
      if (p.product_id === product.product_id && !removed) {
        removed = true;
        this.ticket.total -= product.price;
        return;
      } else {
        return product;
      }
    });
  }

  newTicket() {
    this.ticket = {
      paints: [],
      products: [],
      bases: [],
      total: 0,
      date: 0,
      discount: {quantity: 0, percentage: 0},
      invoice: { state: 'no', reason: ''},
      seller: JSON.parse(localStorage.getItem('currentUser')),
      payed: false
    };
    this.add_discount = false;
    this.discount = false;
  }

  saveTicket() {
    if (this.ticket._id) {
      this.printTicket();
    } else {
      this.saving_ticket = true;
      this.ticket.date = new Date().getTime();
      this.ticketService
        .ticket_create(this.subsidiaryId, this.ticket)
        .subscribe(ticket => {
          this.ticket = ticket;
          this.saving_ticket = false;
        });
    }
  }

  cancelTicket() {
    this.canceling = true;
    this.authenticationService.localLogin(this.authorizationForm.value).subscribe(
      response => {
        if (response.user.role === 'Manager' || response.user.role === 'User') {
          console.log('se puede cancelar ticket')
          this.ticketService.ticket_cancel(this.subsidiaryId, this.ticket._id).subscribe(
            ticket => {
              this.ticket.canceled = ticket.canceled;
              this.canceling = false;
              this.cancelModal = false;
              this.ticketShared.update_ticket(this.ticket);
            }
          )
        }
      },
      error => {
        this.cancelModal = false;
        this.canceling = false;
        this.snotifyService.error('Usuario no autorizado.');
      }
    )
  }

  printTicket() {
    console.log(this.ticket)
    const BrowserWindow = electron.remote.BrowserWindow;
    const win = new BrowserWindow({ width: 450, height: 600 });
    let paints = [];
    let products = [];
    let bases= [];
    let pays = [];
    let total = 0;

    if (this.ticket.paints.length > 0) {
      paints.push(`
          <h4>Pinturas<h4>
          <table class="table table-noborder">
            <tbody>
        `);
      this.ticket.paints.forEach(p => {
        paints.push(`
            <tr>
              <td>${p.line}</td>
              <td>${p.color}</td>
              <td>${p.presentation}</td>
              <td>${p.base}</td>
              <td>x${p.quantity}</td>
              <td>${this.currencyPipe.transform(
                p.price,
                "MXN",
                "symbol-narrow"
              )}</td>
            </tr>
          `);
      });

      paints.push(`
            </tbody>
          </table>
        `);
    }

    if (this.ticket.products.length > 0) {
      products.push(`
          <h4>Artículos<h4>
          <table class="table table-noborder">
            <tbody>
        `);
      this.ticket.products.forEach(p => {
        products.push(`
            <tr>
              <td>${p.description}</td>
              <td>${p.brand}</td>
              <td>x${p.quantity}</td>
              <td>${this.currencyPipe.transform(
                p.price,
                "MXN",
                "symbol-narrow"
              )}</td>
            </tr>
          `);
      });

      products.push(`
            </tbody>
          </table>
        `);
    }

    if (this.ticket.bases.length > 0) {
      bases.push(`
        <h4>Bases<h4>
            <table class="table table-noborder">
              <tbody>
      `)
      this.ticket.bases.forEach(b => {
        bases.push(`
        <tr>
              <td>${b.line}</td>
              <td>${b.presentation}</td>
              <td>x${b.quantity}</td>
              <td>${this.currencyPipe.transform(
                b.price,
                "MXN",
                "symbol-narrow"
              )}</td>
            </tr>
        `)
      })

      bases.push(`
            </tbody>
          </table>
        `);
    }

    pays.push(`
      <h4>Pagos</h4>
        <div>
    `)

    this.ticket.cash_pays.forEach(p => {
      pays.push(`
        Efectivo <span style="float: right;">${this.currencyPipe.transform(p.amount, "MXN", "symbol-narrow")}</span> <br>
      `)
    })

    this.ticket.card_pays.forEach(p => {
      pays.push(`
        ${p.card.terminal} <span style="float: right;">${this.currencyPipe.transform(p.amount, "MXN", "symbol-narrow")}</span> <br>
      `)
    })


    pays.push(`
        </div>
    `)

    const textTicket = `<p style="text-align:center">${
      this.subsidiary.text_ticket
    }</p>`;
    const nameSubsidiary = `<h3 style="margin-top:0">${this.subsidiary.name}</h3>`;
    const subsidiaryAddress = `<h3 style="margin-top:0">${this.subsidiary.address}</h3>`;
    const rfc = this.subsidiary.rfc ? `<h3 style="margin-top:0">RFC: ${this.subsidiary.rfc}</h3>` : '';

    const client = this.ticket.client ? `<p style="margin-top: 0px;">Cliente: ${this.ticket.client.name}</p>` : '';

    const invoice = this.ticket.invoice.state !== 'no' ?
    `<p style="margin-top: 0px;">Razón de factura: ${this.ticket.invoice.reason}</p>` : '';

    const html = [
      `<head>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/clarity-ui/0.10.23/clarity-ui.min.css">
        </head>`,
      '<body style="font-weight: bold;">',
      '<div style="padding: 1em; margin-bottom: 2em;">',
      nameSubsidiary,
      subsidiaryAddress,
      rfc,
      client,
      invoice,
      paints.join(""),
      products.join(""),
      bases.join(""),
      `<div>
              <h5>Subtotal
                <span style="float: right;">${this.currencyPipe.transform(
                  (this.ticket.total - this.ticket.discount.quantity) -
                  ((this.ticket.total - this.ticket.discount.quantity) * 0.16),
                  "MXN",
                  "symbol-narrow"
                )}</span>
              </h5>
              <h5 style="margin-top:0px;">IVA
                <span style="float: right;">${this.currencyPipe.transform(
                  (this.ticket.total - this.ticket.discount.quantity) * 0.16,
                  "MXN",
                  "symbol-narrow"
                )}</span>
              </h5>
              <h5 style="margin-top:0px;">Total
                <span style="float: right;">${this.currencyPipe.transform(
                  this.ticket.total - this.ticket.discount.quantity,
                  "MXN",
                  "symbol-narrow"
                )}</span>
              </h5>
      </div>`,
      pays.join(""),
      textTicket,
      "</div> <div style='height: 3em;'></div>",
      "</body>"
    ].join("");
    win.loadURL("data:text/html;charset=utf-8," + encodeURI(html));
    win.show({});
    win.setMenu(null);

    setTimeout(() => {
      win.webContents.print({ silent: true });
      setTimeout(() => win.close(), 1200);
    }, 2000);

  }
}
