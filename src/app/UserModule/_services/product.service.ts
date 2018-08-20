import { Injectable } from "@angular/core";
import { AuthHttp } from "angular2-jwt";
import { Observable } from 'rxjs/Rx';
import { API_URL } from '../../_services/API_URL';
import { ProductPrice } from '../_models/product.price';

@Injectable()

export class ProductService {
  constructor(
    private http: AuthHttp
  ) {}

  po_create(subsidiaryId: string, product): Observable<any> {
    return this.http.post(`${API_URL}/api/subsidiary/${subsidiaryId}/productowner`, JSON.stringify(product))
      .map(response => response.json())
  }

  po_update(subsidiaryId: string, product): Observable<any> {
    return this.http.put(`${API_URL}/api/subsidiary/${subsidiaryId}/productowner/${product._id}`, product)
      .map(r => r.json());
  }

  products_list(subsidiaryId: string): Observable<any[]> {
    return this.http.get(`${API_URL}/api/subsidiary/${subsidiaryId}/sp`)
      .map(response => response.json())
  }

  product_owner_delete(subsidiaryId: string, poId: string): Observable<any> {
    return this.http.delete(`${API_URL}/api/subsidiary/${subsidiaryId}/productowner/${poId}`)
      .map(response => response.json())
  }

}
