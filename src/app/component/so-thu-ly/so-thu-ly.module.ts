import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SoThuLyRoutingModule} from './so-thu-ly-routing.module';
import {RegisterDecisionAccuComponent} from './component/register-decision-accu/register-decision-accu.component';
import {CaseDetailsComponent} from './component/case-details/case-details.component';

import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {TranslateModule} from '@ngx-translate/core';
import {RoundPipe} from './pipe/round.pipe';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {RegisterDecisionAccuCreateComponent} from './component/register-decision-accu/register-decision-accu-create/register-decision-accu-create.component';
import {AccusedDetailsComponent} from './component/accused-details/accused-details.component';
import {SexPipe} from './pipe/sex.pipe';
import {UserForPipe} from './pipe/user-for.pipe';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {MomentModule, ParsePipe} from 'ngx-moment';
import {RegisterDecisionAccuDetailsComponent} from './component/register-decision-accu/register-decision-accu-details/register-decision-accu-details.component';
import {RegisterDecisionAccuListsComponent} from './component/register-decision-accu/register-decision-accu-lists/register-decision-accu-lists.component';
import {RegisterDecisionCaseComponent} from './component/register-decision-case/register-decision-case.component';
import {RegisterDecisionCaseCreateComponent} from './component/register-decision-case/register-decision-case-create/register-decision-case-create.component';
import {RegisterDecisionCaseDetailsComponent} from './component/register-decision-case/register-decision-case-details/register-decision-case-details.component';
import {RegisterDecisionCaseListsComponent} from './component/register-decision-case/register-decision-case-lists/register-decision-case-lists.component';
import {NzPipesModule} from 'ng-zorro-antd/pipes';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {RegisterDecisionDenouncementComponent} from './component/register-decision-denouncement/register-decision-denouncement.component';
import {RegisterDecisionDenouncementCreateComponent} from './component/register-decision-denouncement/register-decision-denouncement-create/register-decision-denouncement-create.component';
import {DenouncementDetailsComponent} from './component/denouncement-details/denouncement-details.component';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {RegisterDecisionDenouncementDetailsComponent} from './component/register-decision-denouncement/register-decision-denouncement-details/register-decision-denouncement-details.component';
import {RegisterDecisionDenouncementListsComponent} from './component/register-decision-denouncement/register-decision-denouncement-lists/register-decision-denouncement-lists.component';
import {CrimeReportSourcePipe} from './pipe/crime-report-source.pipe';
import {DatePipe} from '@angular/common';
import {CookieService} from 'ngx-cookie-service';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";

@NgModule({
  declarations: [
    RegisterDecisionAccuComponent,
    RegisterDecisionAccuCreateComponent,
    CaseDetailsComponent,
    AccusedDetailsComponent,
    RoundPipe,
    SexPipe,
    UserForPipe,
    RegisterDecisionAccuDetailsComponent,
    RegisterDecisionAccuListsComponent,
    RegisterDecisionCaseComponent,
    RegisterDecisionCaseCreateComponent,
    RegisterDecisionCaseDetailsComponent,
    RegisterDecisionCaseListsComponent,
    RegisterDecisionDenouncementComponent,
    RegisterDecisionDenouncementCreateComponent,
    DenouncementDetailsComponent,
    RegisterDecisionDenouncementDetailsComponent,
    RegisterDecisionDenouncementListsComponent,
    CrimeReportSourcePipe
  ],
    imports: [
        CommonModule,
        SoThuLyRoutingModule,
        NzCollapseModule,
        NzFormModule,
        NzInputModule,
        ReactiveFormsModule,
        NzPageHeaderModule,
        NzButtonModule,
        NzTableModule,
        NzPaginationModule,
        NzModalModule,
        NzSelectModule,
        NzDatePickerModule,
        TranslateModule,
        FormsModule,
        NzIconModule,
        NzInputNumberModule,
        NzEmptyModule,
        NzPopconfirmModule,
        NzDividerModule,
        MomentModule,
        NzPipesModule,
        NzToolTipModule,
        NzGridModule,
        NzCheckboxModule,
        NzAutocompleteModule
    ], providers: [
    ParsePipe,
    DatePipe,
    CookieService
  ]
})
export class SoThuLyModule {
}
