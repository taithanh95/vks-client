import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportCaseinfoComponent } from './report-caseinfo/report-caseinfo.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/login',
    pathMatch: 'full',
  },
  { path: 'caseinfo/:casecode', component: ReportCaseinfoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
