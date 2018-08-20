import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../../_models/ticket';
import { TicketService } from '../../_services/ticket.service';
@Component({
  templateUrl: './history.client.component.html'
})

export class HistoryClientComponent implements OnInit, OnDestroy {

  private clientId: string;
  private sub: any;
  public client: any;
  public tickets: Ticket[] = [];
  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.clientId = params['clientId']
      console.log(this.clientId)
    })

    this.ticketService.tickets_by_client(this.clientId).subscribe(response => {
      this.client = response.client;
      this.tickets = response.tickets;
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
