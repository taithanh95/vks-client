import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzFormModule} from 'ng-zorro-antd/form';
import {ReactiveFormsModule} from '@angular/forms';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {NzInputModule} from 'ng-zorro-antd/input';
import {TranslateModule} from '@ngx-translate/core';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {CategoriesService} from '../../../service/categories.service';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {SharedModule} from '../../../shared/shared.module';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {ApParamService} from '../../../service/apparam.service';
import {NotificationService} from '../../../service/notification.service';
import {LoaderService} from '../../../service/loader.service';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {SothulyModule} from '../sothuly.module';
import {ReviewCaseSearchComponent} from './review-case-search/review-case-search.component';
import {ReviewCaseRouting} from './review-case.routing';
import {ReviewCaseService} from '../../../service/review-case.service';
import {ReviewCaseCreateComponent} from './review-case-create/review-case-create.component';
import {ReviewCaseAccusedListComponent} from './review-case-accused-list/review-case-accused-list.component';
import {ReviewCaseRequestListComponent} from './review-case-request-list/review-case-request-list.component';
import {ReviewCaseAccusedDetailComponent} from './review-case-accused-detail/review-case-accused-detail.component';
import {ReviewCaseRequestDetailComponent} from './review-case-request-detail/review-case-request-detail.component';
import {ReviewCaseUpdateComponent} from './review-case-update/review-case-update.component';
import {ReviewCaseListComponent} from './review-case-list/review-case-list.component';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {CookieService} from 'ngx-cookie-service';

@NgModule({
  declarations: [
    ReviewCaseSearchComponent,
    ReviewCaseCreateComponent,
    ReviewCaseAccusedListComponent,
    ReviewCaseRequestListComponent,
    ReviewCaseAccusedDetailComponent,
    ReviewCaseRequestDetailComponent,
    ReviewCaseUpdateComponent,
    ReviewCaseListComponent
  ],
    imports: [
        CommonModule,
        ReviewCaseRouting,
        NzModalModule,
        NzFormModule,
        ReactiveFormsModule,
        NzIconModule,
        NzSelectModule,
        NzDatePickerModule,
        NzAutocompleteModule,
        NzInputModule,
        TranslateModule,
        NzCheckboxModule,
        NzButtonModule,
        NzTableModule,
        NzLayoutModule,
        SharedModule,
        NzPopconfirmModule,
        NzSpinModule,
        NzSwitchModule,
        NzToolTipModule,
        SothulyModule,
        NzEmptyModule,
        NzPageHeaderModule
    ],
  providers: [
    DatePipe,
    CategoriesService,
    ApParamService,
    ReviewCaseService,
    NotificationService,
    LoaderService,
    CookieService
  ]
})
export class ReviewCaseModule {
}
