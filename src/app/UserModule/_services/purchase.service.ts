import { Injectable } from "@angular/core";
import { AuthHttp } from "angular2-jwt";
import { Observable } from 'rxjs/Rx';
import { API_URL } from '../../_services/API_URL';

@Injectable()

export class PurchaseService {
  constructor(
    private http: AuthHttp
  ) {}

  create_purchase(subsidiaryId: string, purchase: any): Observable<any> {
    return this.http.post(`${API_URL}/api/subsidiary/${subsidiaryId}/purchase`, purchase)
      .map(r => r.json());
  }

  purchase_list(subsidiaryId: string, params?): Observable<any[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/purchase`, { params: params})
      .map(r => r.json());
  }

  delete_purchase(subsidiaryId: string, pb_id: string): Observable<any> {
    return this.http.delete(`${API_URL}/api/subsidiary/${subsidiaryId}/purchase/${pb_id}`)
      .map(r => r.json());
  }

  purchase_list_analysis(subsidiaryId: string): Observable<any[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/purchase/analysis`)
      .map(r => r.json());
  }
}
