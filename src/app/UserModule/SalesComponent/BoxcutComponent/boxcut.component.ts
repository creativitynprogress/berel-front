import { Component, Input, OnInit } from '@angular/core';
import { BoxCut } from '../../_models/boxcut';
import { TicketService } from '../../_services/ticket.service';
import { Ticket } from '../../_models/ticket';
@Component({
  templateUrl: './boxcut.component.html',
  selector: 'boxcut-details'
})

export class BoxcutComponent implements OnInit {
  @Input() boxcut: any;
  @Input() subsidiaryId: string;
  boxcut_details: BoxCut;
  public loading: boolean;

  public ticket_selected: Ticket;
  constructor(
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.ticketService.boxcut_details(this.subsidiaryId, this.boxcut._id).subscribe(
      boxcut => {
        this.boxcut_details = boxcut;
        this.loading = false;
      }
    )
  }

  selectTicket(ticket) {
    this.ticketService.ticket_details(ticket._id).subscribe(
      ticket_response => this.ticket_selected = ticket_response
    )
  }
}
