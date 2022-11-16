import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../../shared/guards/guards.class';
import {DenouncementSearchComponent} from './denouncement-search/denouncement-search.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  { path: 'search/tin-moi', component: DenouncementSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Tiếp nhận và xử lý tin báo tố giác',
      breadcrumb: 'Tiếp nhận và xử lý tin báo tố giác'
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DenouncementManagementRouting {}
