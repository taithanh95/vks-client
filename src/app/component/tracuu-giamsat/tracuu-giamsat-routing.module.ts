import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../shared/guards/guards.class";
import {MonitorSearchComponent} from "./component/monitor-search/monitor-search.component";
import {LookupSearchComponent} from './component/lookup-search/lookup-search.component';

const routes: Routes = [
  {
    path: 'monitor/search', component: MonitorSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Giám sát thực hiện',
      breadcrumb: 'Giám sát thực hiện'
    }
  },
  {
    path: 'lookup/search', component: LookupSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Tra cứu thông tin',
      breadcrumb: 'Tra cứu thông tin'
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TracuuGiamsatRoutingModule {
}
