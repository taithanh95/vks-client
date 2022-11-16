import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './component/auth/login/login.component';
import {GeneralService} from './service/general-service';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    children: [
      {
        path: 'layout',
        loadChildren: () => import('./component/admin-layout/layout.module').then(m => m.LayoutModule),
      },
      {
        path: 'login',
        loadChildren: () => import('./component/auth/auth.module').then(m => m.AuthModule)
      }
    ],
    data: {
      breadcrumb: 'Home',
    }
  },
  {
    path: 'report',
    loadChildren: () => import('./component/report/report.module').then(m => m.ReportModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule],
  providers: [GeneralService],
})
export class AppRoutingModule {
}
