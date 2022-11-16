import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../shared/guards/guards.class';

import {NgModule} from '@angular/core';
import {ReviewCaseSearchComponent} from './review-case-search/review-case-search.component';

const routes: Routes = [
  {
    path: '', component: ReviewCaseSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Xem xét lại quyết định của HDTP và TANDTC',
      breadcrumb: 'Xem xét lại quyết định của HDTP và TANDTC'
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewCaseRouting {
}
