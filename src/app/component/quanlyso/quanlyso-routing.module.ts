import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchViewComponent} from './search-view/search-view.component';
import {UpdateViewComponent} from './update-view/update-view.component';
import {ReportComponent} from "./category/report/report.component";

const routes: Routes = [
  { path: 'danh-sach-so-thu-ly',
  component: SearchViewComponent,
  data: {
    pagename: 'Quản lý danh sách thông tin sổ thụ lý',
    breadcrumb: 'Quản lý danh sách thông tin sổ thụ lý'
  }},
  { path: 'cap-nhat-thong-tin-so',
  component: UpdateViewComponent,
  data: {
    pagename: 'Cập nhật thông tin sổ',
    breadcrumb: 'Cập nhật thông tin sổ'
  }},
  { path: 'danh-muc-bao-cao',
  component: ReportComponent,
  data: {
    pagename: 'Danh mục báo cáo',
    breadcrumb: 'Danh mục báo cáo'
  }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuanlysoRoutingModule { }
