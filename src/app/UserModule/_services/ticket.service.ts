import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { API_URL } from '../../_services/API_URL';
import { Ticket } from '../_models/ticket';
import { BoxCut } from '../_models/boxcut';

@Injectable()

export class TicketService {
  constructor(
    private http: AuthHttp
  ) {}

  tickets_list(subsidiaryId: string, params?: any): Observable<Ticket[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/ticket`, {params: params})
      .map(response => response.json())
  }

  tickets_by_client(clientId: string): Observable<any> {
    return this.http.get(`${API_URL}/api/ticket/client/${clientId}`)
      .map(r => r.json());
  }

  ticket_details(ticketId: string): Observable<Ticket> {
    return this.http.get(`${API_URL}/api/ticket/${ticketId}`)
      .map(r => r.json());
  }

  ticket_cancel(subsidiaryId: string, ticketId: string): Observable<Ticket> {
    return this.http.put(`${API_URL}/api/subsidiary/${subsidiaryId}/ticket/${ticketId}/cancel`, {})
      .map(r => r.json());
  }

  tickets_sales(subsidiaryId: string, params?): Observable<any[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/sales`, { params: params})
      .map(r => r.json());
  }

  ticket_create(subsidiaryId: string, ticket: Ticket): Observable<Ticket> {
    return this.http.post(`${API_URL}/api/subsidiary/${subsidiaryId}/ticket`, JSON.stringify(ticket))
      .map(r => r.json())
  }

  tickets_noboxcut(subsidiaryId: string): Observable<Ticket[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/ticket/noboxcut`)
      .map(r => r.json())
  }

  tickets_invoice(subsidiaryId: string, state: string = 'pending'): Observable<Ticket[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/tickets_to_invoice`, {params: {state}})
      .map(r => r.json());
  }

  ticket_set_invoiced(ticketId: string): Observable<Ticket> {
    return this.http.put(`${API_URL}/api/ticket/${ticketId}/set_invoiced`, {})
      .map(r => r.json());
  }

  boxcut_list(subsidiaryId: string): Observable<BoxCut[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/boxcut`)
      .map(r => r.json())
  }

  boxcut_create(subsidiaryId: string, boxcut: any): Observable<any> {
    return this.http.post(`${API_URL}/api/subsidiary/${subsidiaryId}/boxcut`, JSON.stringify(boxcut))
      .map(r => r.json())
  }

  boxcut_details(subsidiaryId: string, boxcutId: string): Observable<BoxCut> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/boxcut/${boxcutId}`)
      .map(r => r.json())
  }

  boxcut_request(subsidiaryId: string, tickets: any): Observable<any> {
    return this.http.post(`${API_URL}/api/subsidiary/${subsidiaryId}/boxcut/request`, {tickets})
      .map(r => r.json())
  }

  cash_payment_create(subsidiaryId: string, ticketId: string, payment: any): Observable<any> {
    return this.http.post(`${API_URL}/api/subsidiary/${subsidiaryId}/ticket/${ticketId}/cash_payment`, JSON.stringify(payment))
      .map(r => r.json());
  }

  card_payment_create(subsidiaryId: string, ticketId: string, payment: any): Observable<any> {
    return this.http.post(`${API_URL}/api/subsidiary/${subsidiaryId}/ticket/${ticketId}/card_payment`, payment)
      .map(r => r.json());
  }

  check_create(subsidiaryId: string, ticketId: string, check: any): Observable<any> {
    return this.http.post(`${API_URL}/api/subsidiary/${subsidiaryId}/ticket/${ticketId}/check`, check)
      .map(r => r.json());
  }

  transfer_create(subsidiaryId: string, ticketId: string, transfer): Observable<any> {
    return this.http.post(`${API_URL}/api/subsidiary/${subsidiaryId}/ticket/${ticketId}/transfer`, transfer)
      .map(r => r.json())
  }

}
