import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class ClientShared {
  private subject = new Subject<any>();

  add_client(client: any) {
    this.subject.next(client)
  }

  clear_client() {
    this.subject.next();
  }

  get_clients(): Observable<any> {
    return this.subject.asObservable();
  }
}
