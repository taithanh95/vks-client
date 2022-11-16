import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthModel} from '../model/auth.model';
import {HttpClient} from '@angular/common/http';
import {Constant} from '../shared/constants/constant.class';
import {UrlConstant} from '../shared/constants/url.class';
import {environment} from '../../environments/environment';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class AuthService {
  constructor(private httpClient: HttpClient,
              private cookieService: CookieService) {
  }

  loginWithSSO(payload): Observable<AuthModel> {
    const payloadNew = {username: payload.username, password: btoa(payload.password)};
    // @ts-ignore
    return this.httpClient.post(environment.GATEWAY_URI + UrlConstant.API_SSO, payloadNew);
  }

  loginDev(payload): Observable<AuthModel> {
    // @ts-ignore
    return this.httpClient.post(environment.GATEWAY_URI + '/authenticate', payload);
  }

  logout(token: any) {
    const headers = {
      Authorization: 'Bearer ' + this.getToken(),
    }
    return this.httpClient.post(environment.GATEWAY_URI + UrlConstant.LOGOUT, token, {headers});
  }

  checkToken(): any {
    const headers = {
      Authorization: 'Bearer ' + this.getToken(),
    }
    const token = 'Bearer ' + this.getToken();
    return this.httpClient.post(environment.GATEWAY_URI + UrlConstant.VALIDATE, token, {headers});
  }

  getToken(): string {
    return this.cookieService.get(Constant.ACCESS_TOKEN);
  }
}
