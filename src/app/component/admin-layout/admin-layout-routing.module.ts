import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminLayoutComponent} from './admin-layout.component';
import {CauhinhComponent} from '../cauhinh/cauhinh.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from '../../shared/guards/guards.class';
// import {GuardActiveStlGuard} from '../../shared/guards/guard-active-stl.guard';

const routes: Routes = [
  {
    path: 'admin',
    redirectTo: '/admin/welcome',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'welcome',
        component: HomeComponent,
        data: {
          pagename: 'welcome',
          breadcrumb: 'Welcome'
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'cauhinh',
        component: CauhinhComponent,
        data: {
          pagename: 'Cấu hình hệ thống',
          breadcrumb: 'Cấu hình hệ thống'
        }
      },
      {
        path: 'quanlyan',
        loadChildren: () => import('../quanlyan/quanlyan.module').then(m => m.QuanlyanModule),
        data: {
          pagename: 'Quản lý án hình sự',
          breadcrumb: 'Quản lý án'
        }
      },
      {
        path: 'sothuly',
        loadChildren: () => import('../sothuly/sothuly.module').then(m => m.SothulyModule),
        // canActivate: [GuardActiveStlGuard],
        data: {
          pagename: 'Sổ thụ lý',
          breadcrumb: 'Sổ thụ lý'
        }
      },
      {
        path: 'so-thu-ly',
        loadChildren: () => import('../so-thu-ly/so-thu-ly.module').then(m => m.SoThuLyModule),
        // canActivate: [GuardActiveStlGuard],
        data: {
          pagename: 'Sổ thụ lý',
          breadcrumb: 'Sổ thụ lý'
        }
      },
      {
        path: 'thi-hanh-an',
        loadChildren: () => import('../thi-hanh-an/thi-hanh-an.module').then(m => m.ThiHanhAnModule),
        data: {
          pagename: 'Kiểm sát thi hành án',
          breadcrumb: 'Kiểm sát thi hành án'
        }
      },
      {
        path: 'vu-an',
        loadChildren: () => import('../vu-an/vu-an.module').then(m => m.VuAnModule),
        data: {
          pagename: 'Vụ án',
          breadcrumb: 'Vụ án'
        }
      },
      {
        path: 'quanlyso',
        loadChildren: () => import('../quanlyso/quanlyso.module').then(m => m.QuanlysoModule),
        // canActivate: [GuardActiveStlGuard],
        data: {
          pagename: 'Quản lý sổ',
          breadcrumb: 'Quản lý sổ'
        }
      },
      {
        path: 'danh-muc',
        loadChildren: () => import('../danh-muc/danh-muc.module').then(m => m.DanhMucModule),
        data: {
          pagename: 'Danh mục',
          breadcrumb: 'Danh mục'
        }
      },
      {
        path: 'tracuu-giamsat',
        loadChildren: () => import('../tracuu-giamsat/tracuu-giamsat.module').then(m => m.TracuuGiamsatModule),
        data: {
          pagename: 'Tra cứu - Giám sát',
          breadcrumb: 'Tra cứu - Giám sát'
        }
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule {
}
