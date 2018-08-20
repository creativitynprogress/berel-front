import { Component, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { Card } from "../../_models/card";
import { UserService } from "../../_services/user.service";
import { TicketService } from "../../_services/ticket.service";
import { TicketShared } from '../../_shared.ts/ticket.shared';
@Component({
  selector: "pays-ticket",
  templateUrl: "./pays.component.html"
})
export class PaysComponent implements OnInit, OnChanges {
  @Input() ticket: any;
  @Input() subsidiaryId: string;
  public cards: Card[];

  public change: number;
  public cash_amount: number = 0;

  public card_amount: number = 0;
  public card_selected: any;

  public check_amount: number = 0;
  public check_number: string;

  public transfer_amount: number = 0;
  public transfer_reference: number = 0;
  public transfer_folio: number = 0;

  constructor(
    private userService: UserService,
    private ticketService: TicketService,
    private ticketShared: TicketShared
  ) {}

  ngOnInit() {
    this.userService.card_list().subscribe(cards => {
      this.cards = cards;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ticket.currentValue._id && changes.ticket.currentValue._id !== changes.ticket.previousValue._id) {
      this.ticketService
        .ticket_details(this.ticket._id)
        .subscribe(ticket => {
          this.ticket = ticket;
        });
    }
  }

  public add_cash(amount) {
    const payment = {
      display: amount,
      amount: amount - this.change,
      date: new Date().getTime()
    };

    this.ticketService
      .cash_payment_create(this.subsidiaryId, this.ticket._id, payment)
      .subscribe(response => {
        this.ticket.cash_pays.push(response.payment);
        this.ticket.payed = response.payed;
        if (this.ticket.payed) {
          this.ticketShared.update_ticket(this.ticket);
        }
        this.cash_amount = 0;
        this.change = 0;
      });
  }

  add_card(amount) {
    const payment = {
      amount: this.card_amount - this.change,
      card: this.card_selected,
      date: new Date().getTime()
    }

    this.ticketService.card_payment_create(this.subsidiaryId, this.ticket._id, payment)
    .subscribe(response => {
      this.ticket.card_pays.push(response.payment);
      this.ticket.payed = response.payed;
      if (this.ticket.payed) {
        this.ticketShared.update_ticket(this.ticket);
      }
      this.card_amount = 0;
      this.change = 0;
    })
  }

  calculateChange(amount?) {
    let totalPayed = 0;
    totalPayed += this.ticket.discount.quantity || 0;
    totalPayed += amount;
    this.ticket.cash_pays.map(p => (totalPayed += p.amount));
    this.ticket.card_pays.map(p => (totalPayed += p.amount));
    this.ticket.checks.map(p => (totalPayed += p.amount));
    this.ticket.transfers.map(p => (totalPayed += p.amount));

    if (totalPayed > this.ticket.total) {
      this.change = totalPayed - this.ticket.total;
    } else {
      this.change = 0;
    }
  }

  checkPayComplete(quantity) {
    let totalPayed = 0;
    totalPayed += this.ticket.discount.quantity || 0;
    totalPayed += quantity;
    this.ticket.cash_pays.map(p => (totalPayed += p.amount));
    this.ticket.card_pays.map(p => (totalPayed += p.amount));
    this.ticket.checks.map(p => (totalPayed += p.amount));
    this.ticket.transfers.map(p => (totalPayed += p.amount));

    if (totalPayed >= this.ticket.total) {
      return true;
    } else {
      return false;
    }
  }

  add_check() {
    const check = {
      amount: this.check_amount,
      check_number: this.check_number,
      date: (new Date()).getTime()
    }

    this.ticketService.check_create(this.subsidiaryId, this.ticket._id, check).subscribe(
      response => {
        this.ticket.checks.push(response.check)
        this.ticket.payed = response.payed;
        if (this.ticket.payed) {
          this.ticketShared.update_ticket(this.ticket);
        }

        this.check_amount = 0;
        this.check_number = '';
      }
    )
  }

  add_transfer() {
    const transfer = {
      amount: this.transfer_amount,
      reference: this.transfer_reference,
      folio: this.transfer_folio
    }

    this.ticketService.transfer_create(this.subsidiaryId, this.ticket._id, transfer).subscribe(
      response => {
        this.ticket.transfers.push(response.payment)
        this.ticket.payed = response.payed;

        if (this.ticket.payed) {
          this.ticketShared.update_ticket(this.ticket);
        }

        this.transfer_amount = 0;
        this.transfer_reference = 0;
        this.transfer_folio = 0;
      }
    )
  }
}
