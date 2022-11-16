import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../shared/guards/guards.class';
import {SearchViewComponent} from './search-view/search-view.component';
import {SppDetailComponent} from './spp-detail/spp-detail.component';

const routes: Routes = [
  { path: 'search/truy-to/:type', component: SearchViewComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Kiểm sát Điều tra - truy tố',
      breadcrumb: 'Kiểm sát Điều tra - truy tố'
    }
  },
  { path: 'search/so-tham/:type', component: SearchViewComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Kiểm tra xét xử sơ thẩm',
      breadcrumb: 'Kiểm tra xét xử sơ thẩm'
    }
  },
  { path: 'search/phuc-tham/:type', component: SearchViewComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Kiểm tra xét xử phúc thẩm',
      breadcrumb: 'Kiểm tra xét xử phúc thẩm'
    }
  },
  { path: 'search/giam-doc-tham/:type', component: SearchViewComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Kiểm tra xét xử GĐT/TT',
      breadcrumb: 'Kiểm tra xét xử GĐT/TT'
    }
  },
  { path: 'cap-nhat-thong-tin/:type', component: SppDetailComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Thông tin vụ án',
      breadcrumb: 'Thông tin vụ án'
    }
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuanlyanRoutingModule {}
