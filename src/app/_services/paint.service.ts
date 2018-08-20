import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { API_URL } from './API_URL';
import { Paint } from '../_models/paint';
import { Base } from '../AdminModule/_models/base';
import { RequestOptions, Headers, Http } from '@angular/http';
@Injectable()

export class PaintService {

  constructor(
    private http: AuthHttp,
    private http2: Http
  ) {
  }

  paint_create(paint: Paint): Observable<Paint> {
    return this.http.post(`${API_URL}/api/paint`, JSON.stringify(paint))
      .map(response => response.json());
  }

  paint_edit(paint: Paint): Observable<Paint> {
    return this.http.put(`${API_URL}/api/paint/${paint._id}`, JSON.stringify(paint))
      .map(response => response.json())
  }

  paint_list(): Observable<Paint[]> {
    return this.http.get(`${API_URL}/api/paint`)
      .map(response => response.json());
  }

  paint_owner_list(): Observable<Paint[]> {
    return this.http.get(`${API_URL}/api/paint/owner`)
      .map(response => response.json());
  }

  paint_delete(paintId: string): Observable<Paint> {
    return this.http.delete(`${API_URL}/api/paint/${paintId}`)
      .map(response => response.json());
  }

  paint_details(paintId: string): Observable<Paint> {
    return this.http.get(`${API_URL}/api/paint/${paintId}`)
      .map(response => response.json());
  }

  paint_add_presentation(paintId:string, presentation: any): Observable<any> {
    return this.http.post(`${API_URL}/api/paint/${paintId}/presentation`, JSON.stringify(presentation))
      .map(response => response.json());
  }

  paint_update_presentation(paintId: string, presentation: any): Observable<any> {
    return this.http.put(`${API_URL}/api/paint/${paintId}/presentation/${presentation._id}`, JSON.stringify(presentation))
      .map(response => response.json());
  }

  paint_delete_presentation(paintId: string, presentationId: string): Observable<any> {
      return this.http.delete(`${API_URL}/api/paint/${paintId}/presentation/${presentationId}`)
        .map(response => response.json());
  }

  base_create(base: Base): Observable<Base> {
    return this.http.post(`${API_URL}/api/base`, JSON.stringify(base))
      .map(r => r.json())
  }

  base_list(): Observable<Base[]> {
    return this.http.get(`${API_URL}/api/base`)
      .map(r => r.json())
  }

  base_update(base: Base): Observable<Base> {
    return this.http.put(`${API_URL}/api/base/${base._id}`, JSON.stringify(base))
      .map(r => r.json())
  }

  base_delete(baseId: string): Observable<Base> {
    return this.http.delete(`${API_URL}/api/base/${baseId}`)
      .map(r => r.json())
  }

  ink_create(ink: any): Observable<any> {
    return this.http.post(`${API_URL}/api/ink`, ink)
      .map(r => r.json())
  }

  ink_list(): Observable<any[]> {
    return this.http.get(`${API_URL}/api/ink`)
      .map(r => r.json())
  }

  upload_file(lineId: string, file: any): Observable<any> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http2.post(`${API_URL}/api/paint/excelupload/${lineId}`, file)
      .map(r => r.json());
  }


}
