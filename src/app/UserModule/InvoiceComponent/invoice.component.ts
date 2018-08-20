import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../_services/ticket.service';
import { Ticket } from '../_models/ticket';
@Component({
  templateUrl: './invoice.component.html'
})

export class InvoiceComponent implements OnInit {

  subsidiaryId: string;
  sub: any;
  tickets: Ticket[] = []

  constructor(
    private route: ActivatedRoute,
    private ticketsService: TicketService
  ) {}

  ngOnInit() {
    this.sub = this.route.parent.params.subscribe(
      params => this.subsidiaryId = params['id']
    )

    this.ticketsService.tickets_invoice(this.subsidiaryId, 'pending').subscribe(
      tickets => {
        this.tickets = tickets;
      }
    )
  }

  get_tickets_invoced() {
    this.ticketsService.tickets_invoice(this.subsidiaryId, 'invoiced').subscribe(
      tickets => {
        this.tickets = tickets;
      }
    )
  }

  get_tickets_pending() {
    this.ticketsService.tickets_invoice(this.subsidiaryId, 'pending').subscribe(
      tickets => {
        this.tickets = tickets;
      }
    )
  }

  invoice_ticket(ticket_id) {
    this.ticketsService.ticket_set_invoiced(ticket_id).subscribe(
      ticket => {
        this.tickets = this.tickets.filter( t => t._id !== ticket._id)
      }
    )
  }
}
