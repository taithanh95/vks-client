import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../../service/auth.service';
import {ResponseBody} from "../../so-thu-ly/model/response-body";

@Injectable({
  providedIn: 'root'
})
export class ThiHanhAnService {
  SSO_URL = environment.GATEWAY_URI + '/api/sso/';
  CATEGORY_URL = environment.GATEWAY_URI + '/api/category/';
  MANAGE_URL = environment.GATEWAY_URI + '/api/manage/';
  SOTHULY_URL = environment.GATEWAY_URI + '/api/sothuly/';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  postRequest(url: string, body: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.getToken()
      })
    };
    return this.http.post<ResponseBody>(url, body, httpOptions);
  }
}
