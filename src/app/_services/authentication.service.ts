import { Injectable } from '@angular/core'
import { Http, Headers, Response, RequestOptions } from '@angular/http'
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import { API_URL } from './API_URL'
@Injectable()

export class AuthenticationService {

  private headers = new Headers({ "Content-Type": "application/json" });
  private options = new RequestOptions({ headers: this.headers });

  constructor(
    private http: Http
  ) { }

  localLogin(credentials: any): Observable<any> {
    return this.http.post(`${API_URL}/api/auth/login`, JSON.stringify(credentials), this.options)
      .map(response => response.json());
  }

  logOut() {
    localStorage.clear()
  }
}
