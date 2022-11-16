import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DenouncementCreateComponent} from './denouncement-create/denouncement-create.component';
import {DenouncementSearchComponent} from './denouncement-search/denouncement-search.component';
import {DenouncementManagementRouting} from './denouncement-management.routing';
import {DenouncementUpdateComponent} from './denouncement-update/denouncement-update.component';
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
import { DenouncedPersonListComponent } from './denounced-person/denounced-person-list/denounced-person-list.component';
import { InvestigationActivityListComponent } from './investigation-activity/investigation-activity-list/investigation-activity-list.component';
import { SettlementDecisionListComponent } from './settlement-decision/settlement-decision-list/settlement-decision-list.component';
import { VerificationInvestigationListComponent } from './verification-investigation/verification-investigation-list/verification-investigation-list.component';
import {DenouncedPersonDetailComponent} from './denounced-person/denounced-person-detail/denounced-person-detail.component';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {SharedModule} from '../../../shared/shared.module';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {VerificationInvestigationDetailComponent} from './verification-investigation/verification-investigation-detail/verification-investigation-detail.component';
import {InvestigationActivityDetailComponent} from './investigation-activity/investigation-activity-detail/investigation-activity-detail.component';
import {SettlementDecisionDetailComponent} from './settlement-decision/settlement-decision-detail/settlement-decision-detail.component';
import {ApParamService} from '../../../service/apparam.service';
import {DenouncementService} from '../../../service/denouncement.service';
import {NotificationService} from '../../../service/notification.service';
import {LoaderService} from '../../../service/loader.service';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {DenouncementStatusColorPipe} from './denouncement-status.pipe';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {SothulyModule} from '../sothuly.module';
import {ParsePipe} from 'ngx-moment';
import {NzPipesModule} from 'ng-zorro-antd/pipes';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import { TypeOfVerificationPipe } from './verification-investigation/type-of-verification.pipe';
import {CookieService} from 'ngx-cookie-service';

@NgModule({
  declarations: [
    DenouncementCreateComponent,
    DenouncementUpdateComponent,
    DenouncementSearchComponent,
    DenouncedPersonDetailComponent,
    DenouncedPersonListComponent,
    InvestigationActivityListComponent,
    SettlementDecisionListComponent,
    VerificationInvestigationListComponent,
    DenouncedPersonDetailComponent,
    VerificationInvestigationDetailComponent,
    InvestigationActivityDetailComponent,
    SettlementDecisionDetailComponent,
    DenouncementStatusColorPipe,
    TypeOfVerificationPipe
  ],
    imports: [
        CommonModule,
        DenouncementManagementRouting,
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
        NzPipesModule,
        NzPageHeaderModule
    ],
  providers: [
    ParsePipe,
    DatePipe,
    CategoriesService,
    ApParamService,
    DenouncementService,
    NotificationService,
    LoaderService,
    CookieService
  ]
})
export class DenouncementManagementModule {
}
