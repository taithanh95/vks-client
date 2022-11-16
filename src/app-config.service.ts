import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { Injectable, Type, CompilerOptions, NgModuleRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import {AppConsts} from './app/shared/appConsts';

@Injectable()
export class AppConfigService {

  private config: typeof AppConsts;
  private env: Object;

  constructor(private http: HttpClient) {
  }

  static bootstrap<TM>(moduleType: Type<TM>, compilerOptions?: CompilerOptions | CompilerOptions[]): Promise<NgModuleRef<TM>> {
    return platformBrowserDynamic().bootstrapModule(moduleType, compilerOptions);
  }

  /*
  * Loads the environment config file first. Reads the environment variable from the file
  * and based on that loads the appropriate configuration file - development or production
  */
  load() {
    return new Promise((resolve, reject) => {
      const options = {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'DataType': 'application/json' }
      };
      this.http.get(`./assets/config/config.json`, options)
        .subscribe((data: any) => {
            this.setConfig(data);
            resolve(true);
        }, (err) => this.errorHandler(err));
    });
  }

  private setConfig = (data: any): void => {
    /*AppConsts.apisso = data.sso;
    AppConsts.api = data.api;
    /!*Truongnx added 14/04/2021*!/
    AppConsts.apiDev = data.apiDev;
    AppConsts.ssoDev = data.ssoDev;
    AppConsts.runSSO = data.runSSO;
    if (!AppConsts.runSSO)
    {
      AppConsts.api = AppConsts.apiDev;
    }*/
    /*End add*/

    AppConsts.pageSize = data.pageSize;
    AppConsts.page = data.page;
    AppConsts.defaultPage = data.defaultPage;
    AppConsts.hsProperties = data.hsProperties;
    this.config = AppConsts;
  }

  private errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server Error');
  }

  /**
   * Returns environment variable based on given key
   *
   * @param key
   */
  getEnv = (key: any) => {
    return this.env[key];
  }

  /**
   * Returns app configuration value
   *
   */
  public getConfig = () => {
    return this.config;
  }
}
