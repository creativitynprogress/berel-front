import { Injectable } from "@angular/core";
import { AuthHttp } from "angular2-jwt";
import { Observable } from 'rxjs/Rx';
import { API_URL } from '../../_services/API_URL';
import { Product } from '../_models/product';

@Injectable()

export class ProductService {
  constructor(
    private http: AuthHttp
  ) {}

  product_create(product: Product): Observable<Product> {
    return this.http.post(`${API_URL}/api/product`, JSON.stringify(product))
      .map(response => response.json());
  }

  product_list(): Observable<Product[]> {
    return this.http.get(`${API_URL}/api/product`)
      .map(response => response.json());
  }

  product_update(product: Product): Observable<Product> {
    return this.http.put(`${API_URL}/api/product/${product._id}`, JSON.stringify(product))
      .map(response => response.json());
  }

  product_delete(productId: string): Observable<Product> {
    return this.http.delete(`${API_URL}/api/product/${productId}`)
      .map(response => response.json());
  }
}
