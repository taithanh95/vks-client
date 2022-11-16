import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../shared/guards/guards.class';
import {ViolationSearchComponent} from './violation-search/violation-search.component';

const routes: Routes = [
  {
    path: 'search',
    component: ViolationSearchComponent,
    canActivate: [AuthGuard],
    data: {
      pagename: 'Quản lý thông tin vi phạm pháp luật trong HĐTP',
      breadcrumb: ''
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViolationManagementRoutingModule {
}
