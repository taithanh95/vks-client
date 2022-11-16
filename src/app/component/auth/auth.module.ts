import { NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import { AuthorizedComponent } from './authorized/authorized.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import {AuthService} from '../../service/auth.service';
import {StoreModule} from '@ngrx/store';
import {authReducer} from '../auth/redux/auth.reducer';
import {EffectsModule} from '@ngrx/effects';
import {AuthEffects} from './redux/auth.effects';
import {clearState} from '../admin-layout/admin-layout.component';
import {GeneralService} from '../../service/general-service';
import {CookieService} from 'ngx-cookie-service';
@NgModule({
  declarations: [
    LoginComponent,
    AuthorizedComponent,
    PageNotFoundComponent,
    ServerErrorComponent
    ,
  ],
  imports: [
    AuthRoutingModule,
    SharedModule,
    StoreModule.forFeature(
      'auth', authReducer,{ metaReducers: [clearState] }
    ), EffectsModule.forFeature([AuthEffects]),

],
  providers: [AuthService, GeneralService, CookieService]

})
export class AuthModule {

}
