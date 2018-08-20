import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { ToolsService } from './tools.service';
import { Subsidiary } from '../_models/subsidiary';
import { Observable } from 'rxjs/Rx';
import { API_URL } from '../../_services/API_URL';
import { Ticket } from '../_models/ticket';
@Injectable()

export class SubsidiaryService {
  constructor(
    private http: AuthHttp,
    private toolsService: ToolsService
  ) {}

  subsidiary_create(subsidiary: Subsidiary): Observable<Subsidiary> {
    return this.http.post(`${API_URL}/api/subsidiary`, JSON.stringify(subsidiary))
      .map(this.toolsService.extractData);
  }

  subsidiary_details(subsidiaryId: string): Observable<Subsidiary> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}`)
      .map(r => r.json())
  }

  subsidiaries_list(): Observable<Subsidiary[]> {
    return this.http.get(`${API_URL}/api/subsidiary`)
      .map(this.toolsService.extractData);
  }

  subsidiary_update(subsidiary: Subsidiary): Observable<Subsidiary> {
    return this.http.put(`${API_URL}/api/subsidiary/${subsidiary._id}`, JSON.stringify(subsidiary))
      .map(this.toolsService.extractData);
  }

  subsidiary_delete(subsidiaryId: string): Observable<Subsidiary> {
    return this.http.delete(`${API_URL}/api/subsidiary/${subsidiaryId}`)
      .map(this.toolsService.extractData);
  }

  incomes_by_date(subsidiaryId: string, params): Observable<any[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/incomes_by_date`, {params: params})
      .map(r => r.json())
  }

}
