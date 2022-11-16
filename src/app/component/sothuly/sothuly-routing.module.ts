import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'quanLyTinBao',
    loadChildren: () => import('../sothuly/denouncement-management/denouncement-management.module')
      .then(m => m.DenouncementManagementModule),
    data: {
      pagename: 'Quản lý tin báo',
      breadcrumb: 'Quản lý tin báo'
    }
  },
  {
    path: 'quanLyBatTamGiamTamGiu',
    loadChildren: () => import('../sothuly/arrest-detention-management/arrest-detention-management.module')
      .then(m => m.ArrestDetentionManagementModule),
    data: {
      pagename: 'Quản lý bắt tạm giam, tạm giữ',
      breadcrumb: 'Quản lý bắt tạm giam, tạm giữ'
    }
  },
  {
    path: 'xemXetLai',
    loadChildren: () => import('../sothuly/review-case/review-case.module').then(m => m.ReviewCaseModule),
    data: {
      pagename: 'Xem xét lại quyết định của HDTP và TANDTC',
      breadcrumb: 'Xem xét lại quyết định của HDTP và TANDTC'
    }
  },
  {
    path: 'quanLyViPham',
    loadChildren: () => import('../sothuly/violation-management/violation-management.module').then(m => m.ViolationManagementModule),
    data: {
      pagename: 'Quản lý thông tin vi phạm pháp luật trong HĐTP',
      breadcrumb: 'Quản lý thông tin vi phạm pháp luật trong HĐTP'
    }
  },
  {
    path: 'compensations',
    loadChildren: () => import('./compensations-management/compensations-management.module').then(m => m.CompensationsManagementModule),
    data: {
      pagename: 'Quản lý yêu cầu bồi thường',
      breadcrumb: 'Quản lý yêu cầu bồi thường'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SothulyRoutingModule {
}
