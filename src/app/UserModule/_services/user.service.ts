import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { API_URL } from '../../_services/API_URL';
import { Card } from '../_models/card';
import { Provider } from '../_models/providers';

@Injectable()

export class UserService {
  constructor(
    private http: AuthHttp
  ) {}

  client_create(client: any): Observable<any> {
    return this.http.post(`${API_URL}/api/client`, JSON.stringify(client))
      .map(r => r.json())
  }

  client_list(): Observable<any> {
    return this.http.get(`${API_URL}/api/client`)
      .map(r => r.json())
  }

  client_update(client: any): Observable<any> {
    return this.http.put(`${API_URL}/api/client/${client._id}`, JSON.stringify(client))
      .map(r => r.json())
  }

  client_delete(clientId: string): Observable<any> {
    return this.http.delete(`${API_URL}/api/client/${clientId}`)
      .map(r => r.json())
  }

  card_create(card: Card): Observable<Card> {
    return this.http.post(`${API_URL}/api/card`, JSON.stringify(card))
      .map(r => r.json())
  }

  card_list(): Observable<Card[]> {
    return this.http.get(`${API_URL}/api/card`)
      .map(r => r.json())
  }

  card_delete(cardId: string): Observable<Card> {
    return this.http.delete(`${API_URL}/api/card/${cardId}`)
      .map(r => r.json())
  }

  provider_create(provider: any): Observable<Provider> {
    return this.http.post(`${API_URL}/api/provider`, provider)
      .map(r => r.json());
  }

  provider_list(): Observable<Provider[]> {
    return this.http.get(`${API_URL}/api/provider`)
      .map(r => r.json());
  }

  employee_create(subsidiaryId: string, employee: any): Observable<any> {
    return this.http.post(`${API_URL}/api/subsidiary/${subsidiaryId}/employee`, employee)
      .map(r => r.json());
  }

  employee_list(subsidiaryId: string): Observable<any[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/employee`)
      .map(r => r.json())
  }

  employee_update(subsidiaryId: string, employee: any): Observable<any> {
    return this.http.put(`${API_URL}/api/subsidiary/${subsidiaryId}/employee/${employee._id}`, employee)
      .map(r => r.json());
  }

  employee_state(subsidiaryId: string, employeeId: string,  state): Observable<any> {
    return this.http.patch(`${API_URL}/api/subsidiary/${subsidiaryId}/employee/${employeeId}/state`, state)
      .map(r => r.json())
  }

}
