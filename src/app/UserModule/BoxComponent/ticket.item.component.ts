import { Component, Input, Output, EventEmitter } from "@angular/core";
import { TicketItem } from '../_models/ticket.item'
@Component({
  selector: "ticket-item",
  template: `
  <div>
    <h4 style="display: inline-block;">{{item.name}}</h4>

    <div class="select" style="width: 15%; display: inline-block;" *ngIf="item.obj.presentations">
      <select [(ngModel)]="item.presentation" (ngModelChange)="calculatePrice()">
        <option *ngFor="let presentation of item.obj.presentations" [value]="presentation.name">{{presentation.name}}</option>
      </select>
    </div>

    <label style="margin-left: 1em;">Cantidad</label>
    <input style="width: 10%;" type="number" [(ngModel)]="item.quantity" (ngModelChange)="calculatePrice()">

    <button (click)="removeItem()" style="float:right; margin-top:1em;" type="button" class="btn btn-icon">
      <clr-icon shape="times"></clr-icon>
    </button>

    <h4 style="display: inline-block; float: right; margin-right: 0.5em;">{{item.price | currency:'MXN':true}}</h4>
  </div>
  `
})
export class TicketItemComponent {

  @Input() item: TicketItem;
  @Output() updateTotal = new EventEmitter<number>();
  @Output() remove = new EventEmitter<TicketItem>();

  constructor() {}

  calculatePrice() {
    if (this.item.obj.presentations) {
      if (this.item.presentation) {
        const presentation = this.item.obj.presentations.find(
          p => p.name === this.item.presentation
        );
        this.item.price = presentation.price * this.item.quantity;
        this.updateTotal.emit(this.item.price)
      }
    } else {
      this.item.price = this.item.obj.salePrice * this.item.quantity;
      this.updateTotal.emit(this.item.price);
    }
  }

  removeItem() {
    this.remove.emit(this.item);
  }
}
