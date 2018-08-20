import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { API_URL } from '../../_services/API_URL';
import { ToolsService } from './tools.service';
import { PaintPrice } from '../_models/paint.price';
@Injectable()

export class PaintPriceService {
  constructor(
    private http: AuthHttp,
    private toolsService: ToolsService
  ) {}

  paint_list(lineId: string = ''): Observable<PaintPrice[]> {
    return this.http.get(`${API_URL}/api/paint?lineId=${lineId}`)
      .map(this.toolsService.extractData);
  }

  paint_list_search(params: any): Observable<PaintPrice[]> {
    return this.http.get(`${API_URL}/api/paint/search`, { params })
      .map(r => r.json());
  }

  paint_details(paintId: string): Observable<PaintPrice> {
    return this.http.get(`${API_URL}/api/paint/user/${paintId}`)
      .map(this.toolsService.extractData);
  }

  paint_add_presentation(paintId:string, presentation: any): Observable<any> {
    return this.http.post(`${API_URL}/api/paint/${paintId}/presentation`, JSON.stringify(presentation))
      .map(response => response.json());
  }

  paint_update_presentation(paintId: string, presentation: any): Observable<any> {
    return this.http.put(`${API_URL}/api/paint/${paintId}/presentation/${presentation._id}`, JSON.stringify(presentation))
      .map(response => response.json());
  }

  base_list(): Observable<any[]> {
    return this.http.get(`${API_URL}/api/base`)
      .map(r => r.json());
  }

  base_list_for_sale(subsidiaryId: string): Observable<any[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/basesubsidiary/for_Sale`)
      .map(r => r.json());
  }

  base_subsidiary_list(subsidiaryId: string): Observable<any[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/basesubsidiary`)
      .map(r => r.json());
  }

  base_create(subsidiaryId: string, base: any): Observable<any> {
    return this.http.post(`${API_URL}/api/subsidiary/${subsidiaryId}/basesubsidiary`, JSON.stringify(base))
      .map(r => r.json());
  }

  base_update(subsidiaryId: string, base: any): Observable<any> {
    return this.http.put(`${API_URL}/api/subsidiary/${subsidiaryId}/basesubsidiary/${base._id}`, JSON.stringify(base))
      .map(r => r.json())
  }

  ink_subsidiary_list(subsidiaryId: string): Observable<any[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/inksubsidiary`)
      .map(r => r.json())
  }

  ink_subsidiary_update(subsidiaryId: string, is: any): Observable<any> {
    return this.http.put(`${API_URL}/api/subsidiary/${subsidiaryId}/inksubsidiary/${is._id}`, is)
      .map(r => r.json())
  }

}
