import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TicketService } from '../../_services/ticket.service';
import { Ticket } from '../../_models/ticket';
@Component({
  templateUrl: './ticket.details.component.html',
  selector: 'ticket-details'
})

export class TicketDetailsComponent implements OnInit {

  @Input() ticket: Ticket;
  @Input() client: any;
  public loading: boolean;

  @Output() invoiced: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.ticketService.ticket_details(this.ticket._id).subscribe(
      ticket => {
        this.ticket = ticket;
        this.loading = false;
      }
    )
  }

  invoice(ticket) {
    this.invoiced.emit(ticket._id)
  }
}

