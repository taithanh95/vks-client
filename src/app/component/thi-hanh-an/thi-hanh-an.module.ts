import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';

import {ThiHanhAnRoutingModule} from './thi-hanh-an-routing.module';
import {DetailsComponent} from './components/details/details.component';
import {SearchComponent} from './components/search/search.component';
import {UpdateComponent} from './components/update/update.component';
import {RegisterComponent} from './components/update/register/register.component';
import {ReginsComponent} from './components/update/regins/regins.component';
import {PenaltyComponent} from './components/update/penalty/penalty.component';
import {DecisionComponent} from './components/update/decision/decision.component';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {FormsModule} from '@angular/forms';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {TranslateModule} from '@ngx-translate/core';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {PenaltyCreateComponent} from './components/update/penalty/penalty-create/penalty-create.component';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {SharedModule} from '../../shared/shared.module';
import {GeneralService} from '../../service/general-service';
import {SppService} from '../../service/spp-service';
import {CategoriesService} from '../../service/categories.service';
import {ApParamService} from '../../service/apparam.service';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from '../../service/date-change.service';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {DecisionCreateComponent} from './components/update/decision/decision-create/decision-create.component';
import {RegisterCreateComponent} from './components/update/register/register-create/register-create.component';
import {ReginsCreateComponent} from './components/update/regins/regins-create/regins-create.component';
import {CaseComponent} from './components/update/case/case.component';
import {HanhViViPhamComponent} from './components/update/penalty/penalty-create/hanh-vi-vi-pham/hanh-vi-vi-pham.component';
import {DecisionJudicialComponent} from './components/update/decision-judicial/decision-judicial.component';
import {DecisionJudicialCreateComponent} from './components/update/decision-judicial/decision-judicial-create/decision-judicial-create.component';


@NgModule({
    entryComponents: [
        PenaltyCreateComponent,
    ],
    declarations: [
        DetailsComponent,
        SearchComponent,
        UpdateComponent,
        RegisterComponent,
        ReginsComponent,
        PenaltyComponent,
        DecisionComponent,
        PenaltyCreateComponent,
        RegisterCreateComponent,
        DecisionCreateComponent,
        ReginsCreateComponent,
        CaseComponent,
        HanhViViPhamComponent,
        DecisionJudicialComponent,
        DecisionJudicialCreateComponent
    ],
    imports: [
        CommonModule,
        ThiHanhAnRoutingModule,
        NzIconModule,
        NzGridModule,
        FormsModule,
        NzSelectModule,
        NzDatePickerModule,
        NzAutocompleteModule,
        NzPageHeaderModule,
        NzButtonModule,
        NzTableModule,
        NzPaginationModule,
        TranslateModule,
        NzEmptyModule,
        NzModalModule,
        NzSpinModule,
        SharedModule,
        NzToolTipModule
    ],
    providers: [
        GeneralService,
        SppService,
        CategoriesService,
        TitleCasePipe,
        ApParamService,
        CookieService,
        DateChangeService,
        DatePipe,
        CurrencyPipe
    ],
    exports: [
        DetailsComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThiHanhAnModule {
}
