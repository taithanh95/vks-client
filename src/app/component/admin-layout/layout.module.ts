
import { NgModule} from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {AdminLayoutComponent} from './admin-layout.component';
import {SharedModule} from '../../shared/shared.module';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);
import {RouterModule} from '@angular/router';
import {AdminLayoutRoutingModule} from './admin-layout-routing.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import {vi_VN, NZ_I18N} from 'ng-zorro-antd/i18n';
import vi from '@angular/common/locales/vi';
import {NZ_ICONS} from 'ng-zorro-antd/icon';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {CookieService} from 'ngx-cookie-service';
import { HomeComponent } from './home/home.component';
import {NzSpinModule} from 'ng-zorro-antd/spin';

registerLocaleData(vi);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);
@NgModule({
  declarations: [
    AdminLayoutComponent,
    HomeComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([]),
    AdminLayoutRoutingModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzToolTipModule,
    NzLayoutModule,
    NzSpinModule
  ],
  providers: [{ provide: NZ_I18N, useValue: vi_VN }, { provide: NZ_ICONS, useValue: icons }, CookieService]
})
export class LayoutModule {

}
