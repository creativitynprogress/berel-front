import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
@Injectable()

export class ProductShared {
  private subject = new Subject<any>();

  add_product(product: any) {
    this.subject.next(product);
  }

  get_products(): Observable<any> {
    return this.subject.asObservable();
  }
}
