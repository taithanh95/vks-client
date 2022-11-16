import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from './component/admin-layout/layout.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from './shared/shared.module';
import {LoaderService} from './service/loader.service';
import {AppConfigService} from '../app-config.service';
import {AuthModule} from './component/auth/auth.module';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {ErrorInterceptor} from './shared/interceptor/error.interceptor';
import {AuthGuard} from './shared/guards/guards.class';
import {CauhinhComponent} from './component/cauhinh/cauhinh.component';
import {NZ_DATE_LOCALE, NZ_I18N, vi_VN} from 'ng-zorro-antd/i18n';
import {UserService} from './service/user-service';
import {ConstantService} from './service/constant.service';
import {HttpModule} from '@angular/http';
import {vi} from 'date-fns/locale';
import {CustomDateParserFormatter, DateService} from './common/util/date.service';
import {NumberService} from './common/util/number.service';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import {CookieService} from 'ngx-cookie-service';
import { GuardActiveStlGuard } from './shared/guards/guard-active-stl.guard';
import { GeneralService } from './service/general-service';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
export function configServiceFactory(config: AppConfigService,general: GeneralService) {
  return () => {
    config.load();
    general.loadErrorFile();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    CauhinhComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    AuthModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),
    HttpModule,
    NgxMaskModule.forRoot(options),
    StoreDevtoolsModule.instrument(),
  ],
  exports: [],
  providers: [LoaderService, AppConfigService, UserService, {
    provide: APP_INITIALIZER,
    useFactory: configServiceFactory,
    deps: [AppConfigService, GeneralService],
    multi: true
  },
    {provide: NZ_I18N, useValue: vi_VN},
    {provide: NZ_DATE_LOCALE, useValue: vi},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }, AuthGuard,
    GuardActiveStlGuard,
    ConstantService,
    DateService,
    CustomDateParserFormatter,
    NumberService,
    CookieService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
