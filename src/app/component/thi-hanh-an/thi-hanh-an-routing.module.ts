import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../shared/guards/guards.class';
import {SearchComponent} from './components/search/search.component';
import {UpdateComponent} from './components/update/update.component';

const routes: Routes = [
  {
    path: '', component: SearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Kiểm sát thi hành án',
      breadcrumb: 'Kiểm sát thi hành án'
    }
  }, {
    path: 'update/:id', component: UpdateComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Cập nhật thông tin thi hành án',
      breadcrumb: 'Cập nhật thông tin thi hành án'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThiHanhAnRoutingModule {
}
