import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppConfigService} from '../../../app-config.service';
import {environment} from '../../../environments/environment';
import {UrlConstant} from '../constants/url.class';
import {Constant} from '../constants/constant.class';
import {ConstantService} from '../../service/constant.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class BaseService {
  runSSO: boolean;

  constructor(
    public httpClient: HttpClient,
    protected configService: AppConfigService,
    protected constantService: ConstantService,
    private cookieService: CookieService
  ) {
    this.runSSO = environment.runSSO;
  }

  get(url: string, params?: {}, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.get(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_QUANLYAN : '') + url, {
          headers: this.createHeaders() || {},
          params,
          responseType: 'text',
        });
      case 'blob':
        return this.httpClient.get(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_QUANLYAN : '') + url, {
          headers: this.createHeaders() || {},
          params,
          responseType: 'blob',
        });
      default:
        return this.httpClient.get(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_QUANLYAN : '') + url, {
          headers: this.createHeaders() || {},
          params
        });
    }
  }

  getByUrl(rootURL: string, url: string, params?: {}, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.get(rootURL + url, {
          headers: this.createHeaders() || {},
          params,
          responseType: 'text',
        });
      case 'blob':
        return this.httpClient.get(rootURL + url, {
          headers: this.createHeaders() || {},
          params,
          responseType: 'blob',
        });
      default:
        return this.httpClient.get(rootURL + url, {
          headers: this.createHeaders() || {},
          params
        });
    }
  }

  /**
   * Create a new entity.
   * @param url the api url
   * @param data the entity to create
   */
  post(url: string, data: any, params?: {}, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.post(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_QUANLYAN : '') + url, data, {
          headers: this.createHeaders() || {},
          responseType: 'text',
          params
        });
      case 'manage':
        return this.httpClient.post(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_DANHMUC : '') + url, data, {
          headers: this.createHeadersManage() || {},
          params
        });
      case 'blob':
        return this.httpClient.post(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_QUANLYAN : '') + url, data, {
          headers: this.createHeaders() || {},
          responseType: 'blob',
          params
        });
      case 'arraybuffer':
        return this.httpClient.post(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_QUANLYAN : '') + url, data, {
          headers: this.createHeaders() || {},
          responseType: 'blob',
          params
        });
      case 'qlahs':
        return this.httpClient.post(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_QLAHS : '') + url, data, {
          headers: this.createHeaders() || {},
          params
        });
      case 'category':
        return this.httpClient.post(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_CATEGORY : '') + url, data, {
          headers: this.createHeaders() || {},
          params
        });
      default:
        return this.httpClient.post(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_QUANLYAN : '') + url, data, {
          headers: this.createHeaders() || {},
          params
        });
    }
  }

  postDM(url: string, data: any, params?: {}, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.post(this.constantService.MANAGE_URL + url, data, {
          headers: this.createHeaders() || {},
          responseType: 'text',
          params
        });
      case 'blob':
        return this.httpClient.post(this.constantService.MANAGE_URL + url, data, {
          headers: this.createHeaders() || {},
          responseType: 'blob',
          params
        });
      case 'arraybuffer':
        return this.httpClient.post(this.constantService.MANAGE_URL + url, data, {
          headers: this.createHeaders() || {},
          responseType: 'blob',
          params
        });
      default:
        return this.httpClient.post(this.constantService.MANAGE_URL + url, data, {
          headers: this.createHeaders() || {},
          params
        });
    }
  }

  /**
   * Update an entity.
   * @param url the api url
   * @param data the entity to be updated
   */
  put(url: string, data: any, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.put(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_QUANLYAN : '') + url, data, {
          headers: this.createHeaders() || {},
          responseType: 'json'
        });
      default:
        return this.httpClient.put(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_QUANLYAN : '') + url, data, {
          headers: this.createHeaders() || {},
        });
    }
  }

  /**
   * Delete an entity.
   * @param url the api url
   * @param id the entity id to be deleted
   */
  delete(url: string, params?: {}, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.delete(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_QUANLYAN : '') + url, {
          headers: this.createHeaders() || {},
          responseType: 'text',
          params
        });
      default:
        return this.httpClient.delete(environment.GATEWAY_URI + (this.runSSO ? UrlConstant.API_QUANLYAN : '') + url, {
          headers: this.createHeaders() || {},
          params
        });
    }
  }


  public createHeaders() {
    // Why "authorization": see CustomLogoutSuccessHandler on server
    return new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken());
  }
  public createHeadersManage() {
    // Why "authorization": see CustomLogoutSuccessHandler on server
    // const contentHeaders = new HttpHeaders();
    // contentHeaders.set('Authorization', 'Bearer ' + this.getToken());
    // contentHeaders.append('Accept', 'application/json');
    // contentHeaders.append('Content-Type', 'application/json');
    return  new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken())
      .append('Accept', 'application/json')
      .append('Content-Type', 'application/json');
  }


  private getToken() {
    return this.cookieService.get(Constant.ACCESS_TOKEN);
  }

  private getUserId() {
    return localStorage.getItem(Constant.USERID);
  }
}
