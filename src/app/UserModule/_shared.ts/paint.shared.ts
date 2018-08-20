import { Injectable } from '@angular/core';
import { Paint } from '../../_models/paint';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class PaintShared {
  private subject = new Subject<any>();
  private subject_base = new Subject<any>();

  add_paint(paint: any) {
    this.subject.next(paint)
  }

  clear_paint() {
    this.subject.next();
  }

  add_base(base) {
    this.subject_base.next(base);
  }

  clear_base() {
    this.subject_base.next()
  }

  get_paints(): Observable<any> {
    return this.subject.asObservable();
  }

  get_bases(): Observable<any> {
    return this.subject_base.asObservable();
  }
}
