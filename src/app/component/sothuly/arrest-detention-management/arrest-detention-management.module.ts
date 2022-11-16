import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {ArrestDetentionManagementRoutingModule} from './arrest-detention-management-routing.module';
import {ArrestDetentionSearchComponent} from './arrest-detention-search/arrest-detention-search.component';
import {ArrestDetentionUpdateComponent} from './arrest-detention-update/arrest-detention-update.component';
import {ArrestDetentionCreateComponent} from './arrest-detention-create/arrest-detention-create.component';
import {DisciplineViolationComponent} from './discipline-violation/discipline-violation-detail/discipline-violation.component';
import {SettlementDecisionComponent} from './settlement-decision/settlement-decision-detail/settlement-decision.component';
import {LawOffenseComponent} from './law-offense/law-offence-detail/law-offense.component';
import {SharedModule} from '../../../shared/shared.module';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {SothulyModule} from '../sothuly.module';
import {ApParamService} from '../../../service/apparam.service';

import {CategoriesService} from '../../../service/categories.service';
import { ArresteeDetailComponent } from './arrestee/arrestee-detail/arrestee-detail.component';
import { ArresteeListComponent } from './arrestee/arrestee-list/arrestee-list.component';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import { SettlementDecisionListComponent } from './settlement-decision/settlement-decision-list/settlement-decision-list.component';
import { DisciplineViolationListComponent } from './discipline-violation/discipline-violation-list/discipline-violation-list.component';
import { LawOffenceListComponent } from './law-offense/law-offence-list/law-offence-list.component';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {CookieService} from 'ngx-cookie-service';

@NgModule({
  declarations: [ArrestDetentionSearchComponent,
    ArrestDetentionUpdateComponent,
    ArrestDetentionCreateComponent,
    DisciplineViolationComponent,
    SettlementDecisionComponent,

    LawOffenseComponent,
    ArresteeDetailComponent,
    ArresteeListComponent,
    SettlementDecisionListComponent,
    DisciplineViolationListComponent,
    LawOffenceListComponent
  ],

    imports: [
        CommonModule,
        ArrestDetentionManagementRoutingModule,
        SharedModule,
        NzToolTipModule,
        NzSpinModule,
        NzPopconfirmModule,
        NzSwitchModule,
        SothulyModule,
        NzAutocompleteModule,
        NzEmptyModule,
        NzPageHeaderModule
    ],
  providers: [
    DatePipe,
    ApParamService,
    CategoriesService,
    CookieService
  ]
})
export class ArrestDetentionManagementModule {
}
