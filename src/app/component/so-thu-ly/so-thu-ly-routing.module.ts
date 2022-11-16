import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterDecisionAccuComponent} from './component/register-decision-accu/register-decision-accu.component';
import {RegisterDecisionAccuCreateComponent} from './component/register-decision-accu/register-decision-accu-create/register-decision-accu-create.component';
import {RegisterDecisionAccuDetailsComponent} from './component/register-decision-accu/register-decision-accu-details/register-decision-accu-details.component';
import {RegisterDecisionAccuListsComponent} from './component/register-decision-accu/register-decision-accu-lists/register-decision-accu-lists.component';
import {RegisterDecisionCaseComponent} from './component/register-decision-case/register-decision-case.component';
import {RegisterDecisionCaseCreateComponent} from './component/register-decision-case/register-decision-case-create/register-decision-case-create.component';
import {RegisterDecisionCaseDetailsComponent} from './component/register-decision-case/register-decision-case-details/register-decision-case-details.component';
import {RegisterDecisionCaseListsComponent} from './component/register-decision-case/register-decision-case-lists/register-decision-case-lists.component';
import {RegisterDecisionDenouncementComponent} from './component/register-decision-denouncement/register-decision-denouncement.component';
import {RegisterDecisionDenouncementCreateComponent} from './component/register-decision-denouncement/register-decision-denouncement-create/register-decision-denouncement-create.component';
import {RegisterDecisionDenouncementDetailsComponent} from "./component/register-decision-denouncement/register-decision-denouncement-details/register-decision-denouncement-details.component";
import {RegisterDecisionDenouncementListsComponent} from "./component/register-decision-denouncement/register-decision-denouncement-lists/register-decision-denouncement-lists.component";

const routes: Routes = [
  {
    path: 'dang-ky-lenh-tin-bao',
    component: RegisterDecisionDenouncementComponent,
    data: {
      pagename: 'Cấp số lệnh, quyết định tin báo',
      breadcrumb: 'Cấp số lệnh, quyết định tin báo'
    }
  },
  {
    path: 'dang-ky-lenh-tin-bao/them-moi/:id',
    component: RegisterDecisionDenouncementCreateComponent,
    data: {
      pagename: 'Cấp số lệnh, quyết định tin báo',
      breadcrumb: 'Cấp số lệnh, quyết định tin báo'
    }
  },
  {
    path: 'dang-ky-lenh-tin-bao/xem/:id',
    component: RegisterDecisionDenouncementDetailsComponent,
    data: {
      pagename: 'Xem thông tin cấp lệnh, quyết định tin báo',
      breadcrumb: 'Xem thông tin cấp lệnh, quyết định tin báo'
    }
  },
  {
    path: 'dang-ky-lenh-tin-bao/danh-sach',
    component: RegisterDecisionDenouncementListsComponent,
    data: {
      pagename: 'Danh sách cấp số lệnh/QĐ tin báo',
      breadcrumb: 'Danh sách cấp số lệnh/QĐ tin báo'
    }
  },
  {
    path: 'dang-ky-lenh-vu-an',
    component: RegisterDecisionCaseComponent,
    data: {
      pagename: 'Cấp số lệnh, quyết định vụ án',
      breadcrumb: 'Cấp số lệnh, quyết định vụ án'
    }
  },
  {
    path: 'dang-ky-lenh-vu-an/xem/:id',
    component: RegisterDecisionCaseDetailsComponent,
    data: {
      pagename: 'Xem thông tin cấp lệnh, quyết định vụ án',
      breadcrumb: 'Xem thông tin cấp lệnh, quyết định vụ án'
    }
  },
  {
    path: 'dang-ky-lenh-vu-an/danh-sach',
    component: RegisterDecisionCaseListsComponent,
    data: {
      pagename: 'Danh sách cấp số lệnh/QĐ vụ án',
      breadcrumb: 'Danh sách cấp số lệnh/QĐ vụ án'
    }
  },
  {
    path: 'dang-ky-lenh-vu-an/them-moi/:id',
    component: RegisterDecisionCaseCreateComponent,
    data: {
      pagename: 'Cấp số lệnh, quyết định vụ án',
      breadcrumb: 'Cấp số lệnh, quyết định vụ án'
    }
  },
  {
    path: 'dang-ky-lenh-bi-can',
    component: RegisterDecisionAccuComponent,
    data: {
      pagename: 'Cấp số lệnh, quyết định bị can',
      breadcrumb: 'Cấp số lệnh, quyết định bị can'
    }
  },
  {
    path: 'dang-ky-lenh-bi-can/xem/:id',
    component: RegisterDecisionAccuDetailsComponent,
    data: {
      pagename: 'Xem thông tin cấp lệnh, quyết định bị can',
      breadcrumb: 'Xem thông tin cấp lệnh, quyết định bị can'
    }
  },
  {
    path: 'dang-ky-lenh-bi-can/danh-sach',
    component: RegisterDecisionAccuListsComponent,
    data: {
      pagename: 'Danh sách cấp số lệnh/QĐ bị can',
      breadcrumb: 'Danh sách cấp số lệnh/QĐ bị can'
    }
  },
  {
    path: 'dang-ky-lenh-bi-can/them-moi/:id',
    component: RegisterDecisionAccuCreateComponent,
    data: {
      pagename: 'Cấp số lệnh, quyết định bị can',
      breadcrumb: 'Cấp số lệnh, quyết định bị can'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoThuLyRoutingModule {
}
