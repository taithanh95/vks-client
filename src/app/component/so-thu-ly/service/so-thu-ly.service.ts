import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResponseBody} from '../model/response-body';
import {AuthService} from '../../../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SoThuLyService {
  SSO_URL = environment.GATEWAY_URI + '/api/sso/';
  CATEGORY_URL = environment.GATEWAY_URI + '/api/category/';
  MANAGE_URL = environment.GATEWAY_URI + '/api/manage/';
  SOTHULY_URL = environment.GATEWAY_URI + '/api/sothuly/';
  QLAHS_URL = environment.GATEWAY_URI + '/api/qlahs/';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  postRequest(url: string, body: any): Observable<ResponseBody> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.getToken()
      })
    };
    return this.http.post<ResponseBody>(url, body, httpOptions);
  }
}
