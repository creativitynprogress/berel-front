import { Injectable } from "@angular/core";
import { AuthHttp } from "angular2-jwt";
import { Observable } from 'rxjs/Rx';
import { API_URL } from '../../_services/API_URL';

@Injectable()

export class SubsidiaryRangeService {
  constructor(
    private http: AuthHttp
  ) {}

  line_list(): Observable<any[]> {
    return this.http.get(`${API_URL}/api/line`)
      .map(response => response.json())
  }

  sr_create(subsidiaryId: string, lineId: string, rangeId: string, rs: any): Observable<any> {
    return this.http.post(`${API_URL}/api/subsidiary/${subsidiaryId}/line/${lineId}/range/${rangeId}/sr`, JSON.stringify(rs))
      .map(response => response.json())
  }

  sr_list(subsidiaryId: string, lineId: string): Observable<any[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/line/${lineId}/sr`)
      .map(response => response.json())
  }

  sr_update(subsidiaryId: string, lineId: string, rangeId: string, sr: any): Observable<any> {
    return this.http.put(
      `${API_URL}/api/subsidiary/${subsidiaryId}/line/${lineId}/range/${rangeId}/sr/${sr._id}`,
      JSON.stringify(sr))
      .map(response => response.json())
  }
}
