import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchViewComponent} from './component/chuyen-an/search-view/search-view.component';
import {UpdateComponent} from './component/chuyen-an/update/update.component';
import {AuthGuard} from '../../shared/guards/guards.class';
import {SearchViewReveiceComponent} from './component/nhan-an/search-view-reveice/search-view-reveice.component';
import {UpdateReveiceComponent} from './component/nhan-an/update-reveice/update-reveice.component';
import {SearchViewSplitComponent} from './component/tach-vu-an/search-view-split/search-view-split.component';
import {EditViewSplitComponent} from './component/tach-vu-an/edit-view-split/edit-view-split.component';
import {SearchTransferCaseComponent} from "./component/chuyen-an-theo-yeu-cau/search-transfer-case/search-transfer-case.component";
import { SearchViewJoinComponent } from './component/nhap-vu-an/search-view-join/search-view-join.component';
import { EditViewJoinComponent } from './component/nhap-vu-an/edit-view-join/edit-view-join.component';

const routes: Routes = [
  {
    path: 'search/chuyen-an', component: SearchViewComponent, canActivate:[AuthGuard],
    data:{
      pagename: 'Chuyển án',
      breadcrumb: 'Chuyến án'
    }
  },
  {
    path: 'search/chuyen-an/update', component: UpdateComponent, canActivate:[AuthGuard],
    data:{
      pagename: 'Cập nhật Chuyển án',
      breadcrumb: 'Cập nhật Chuyến án'
    }
  },
  {
    path: 'search/nhan-an', component: SearchViewReveiceComponent, canActivate:[AuthGuard],
    data:{
      pagename: 'Nhận án',
      breadcrumb: 'Nhận án'
    }
  },
  {
    path: 'search/nhan-an/update', component: UpdateReveiceComponent, canActivate:[AuthGuard],
    data:{
      pagename: 'Cập nhật Nhận án',
      breadcrumb: 'Cập nhật Nhận án'
    }
  },
  {
    path: 'search/tach-vu-an', component: SearchViewSplitComponent, canActivate:[AuthGuard],
    data:{
      pagename: 'Tách vụ án',
      breadcrumb: 'Tách vụ án'
    }
  },
  {
    path: 'search/tach-vu-an/update', component: EditViewSplitComponent, canActivate:[AuthGuard],
    data:{
      pagename: 'Cập nhật Tách vụ án',
      breadcrumb: 'Cập nhật Tách vụ án'
    }
  },
  {
    path: 'search/chuyen-an-theo-yeu-cau', component: SearchTransferCaseComponent, canActivate:[AuthGuard],
    data:{
      pagename: 'Chuyển án theo yêu cầu',
      breadcrumb: 'Chuyển án theo yêu cầu'
    }
  },
  {
    path: 'search/nhap-vu-an',component: SearchViewJoinComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Nhập vụ án',
      breadcrumb: 'Nhập vụ án'
    }
  },
  {
    path: 'search/nhap-vu-an/update', component: EditViewJoinComponent, canActivate: [AuthGuard],
    data:{
      pagename:'Cập nhật Nhập vụ án',
      breadcrumb: 'Cập nhật Nhập vụ án'
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VuAnRoutingModule { }
