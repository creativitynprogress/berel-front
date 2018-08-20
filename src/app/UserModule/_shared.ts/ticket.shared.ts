import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
@Injectable()

export class TicketShared {
  private subject = new Subject<any>();
  private update = new Subject<any>();

  add_ticket(ticket: any) {
    this.subject.next(ticket);
  }

  get_tickets(): Observable<any> {
    return this.subject.asObservable();
  }

  update_ticket(ticket: any) {
    this.update.next(ticket)
  }

  listen_update(): Observable<any> {
    return this.update.asObservable();
  }
}
