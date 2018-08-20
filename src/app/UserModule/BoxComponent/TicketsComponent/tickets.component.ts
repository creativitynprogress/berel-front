import { Component, OnInit, OnDestroy } from '@angular/core';
import { TicketService } from '../../_services/ticket.service';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../../_models/ticket';
import { TicketShared } from '../../_shared.ts/ticket.shared';
import { BoxCut } from '../../_models/boxcut';
import { SnotifyService } from 'ng-snotify';
@Component({
  templateUrl: './tickets.component.html'
})

export class TicketsComponent implements OnInit, OnDestroy {

  public sub: any;
  public subsidiaryId: string;
  public tickets: Ticket[] = [];
  public ticket_selected: Ticket;
  public sub2: any;
  public pays: any;
  public date: any;
  public modal_boxcut: boolean = false;

  public boxcut: BoxCut = {
    tickets: [],
    total: 0,
    date: 0,
    card_pays: 0,
    cash_pays: 0,
    checks: 0,
    transfers: 0
  };

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private ticketShared: TicketShared,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit() {

    this.route.parent.parent.params.subscribe(
      params => this.subsidiaryId = params['id']
    );

    this.ticketService
      .tickets_noboxcut(this.subsidiaryId)
      .subscribe(tickets => {
        this.tickets = tickets;
      });

    this.sub2 = this.ticketShared.listen_update().subscribe(
      ticket => {
        this.tickets = this.tickets.map(t => {
          if (t._id === ticket._id) {
            t.payed = true;
            t.canceled = ticket.canceled;
          }
          return t;
        })
      }
    )
  }

  ngOnDestroy() {
    if (this.sub && this.sub2) {
      this.sub.unsubscribe();
      this.sub2.unsubscribe();
    }
  }

  selectTicket(ticket) {
    this.ticket_selected = ticket;
    this.ticketShared.add_ticket(ticket);
  }

  requestBoxcut() {
    const tickets = this.tickets.filter( t => (t.payed || t.canceled));
    this.boxcut.tickets = tickets.map(t => t._id);

    if (tickets.length > 0 ) {
      this.ticketService.boxcut_request(this.subsidiaryId, this.boxcut.tickets).subscribe(pays => {
        this.boxcut = Object.assign(this.boxcut, pays);
        this.boxcut.date = new Date().getTime();
        this.modal_boxcut = true;
      });
    } else {
      this.snotifyService.warning(('Es necesario que existan tickets pagados.'));
    }
  }

  countTicketsCanceled() {
    let total = 0;
    this.tickets.map(t => {
      if (t.canceled) {
        total += 1;
      }
    })

    return total;
  }

  boxcut_create() {
    this.ticketService.boxcut_create(this.subsidiaryId, this.boxcut).subscribe(boxcut => {
      this.modal_boxcut = false;
      this.tickets = this.tickets.filter((t) => {
        console.log(t)
        return boxcut.tickets.indexOf(t._id) < 0;
      })
      this.snotifyService.success('Corte de caja exitoso');
    })
  }

}
