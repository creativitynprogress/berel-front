import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { API_URL } from './API_URL';
import { Line } from '../_models/line';
import { Range } from '../_models/range';

@Injectable()

export class LineService {
  constructor(
    private http: AuthHttp
  ) {}

  line_list(): Observable<Line[]> {
    return this.http.get(`${API_URL}/api/line`)
      .map(response => response.json())
  }

  line_create(line: Line): Observable<Line> {
    return this.http.post(`${API_URL}/api/line`, JSON.stringify(line))
      .map(response => response.json())
  }

  range_list(lineId: string): Observable<Range[]> {
    return this.http.get(`${API_URL}/api/line/${lineId}/range`)
      .map(response => response.json())
  }

  range_create(lineId: string, range: Range): Observable<Range> {
    return this.http.post(`${API_URL}/api/line/${lineId}/range`, JSON.stringify(range))
      .map(response => response.json())
  }

  range_update(lineId: string, range: Range): Observable<Range> {
    return this.http.put(`${API_URL}/api/line/${lineId}/range/${range._id}`, JSON.stringify(range))
      .map(response => response.json());
  }

  range_delete(lineId: string, rangeId: string): Observable<Range> {
    return this.http.delete(`${API_URL}/api/line/${lineId}/range/${rangeId}`)
      .map(response => response.json());
  }


}
