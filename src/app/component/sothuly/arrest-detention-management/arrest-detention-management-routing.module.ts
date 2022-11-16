import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../../shared/guards/guards.class";
import {ArrestDetentionSearchComponent} from "./arrest-detention-search/arrest-detention-search.component";

const routes: Routes = [
  {
    path: 'search',
    component: ArrestDetentionSearchComponent,
    canActivate: [AuthGuard],
    data: {
      pagename: 'Quản lý bắt, tạm giam, tạm giữ',
      breadcrumb: 'Quản lý bắt, tạm giam, tạm giữ'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArrestDetentionManagementRoutingModule {
}
