import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';
import {DateChangeService} from '../../service/date-change.service';
import {CookieService} from 'ngx-cookie-service';
import {CategoriesService} from '../../service/categories.service';
import {GeneralService} from '../../service/general-service';
import {SppService} from '../../service/spp-service';
import {ApParamService} from '../../service/apparam.service';
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
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {SharedModule} from 'src/app/shared/shared.module';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {TracuuGiamsatRoutingModule} from "./tracuu-giamsat-routing.module";
import {MonitorSearchComponent} from './component/monitor-search/monitor-search.component';
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {ResultRegisterComponent} from './component/monitor-result/result-register/result-register.component';
import {LookupSearchComponent} from './component/lookup-search/lookup-search.component';
import {LookupDetailComponent} from './component/lookup-detail/lookup-detail.component';
import {NgxPrintModule} from 'ngx-print';
import {TabCaseComponent} from './component/monitor-search/monitor-search-tabs/tab-case/tab-case.component';
import {TabAccusedComponent} from './component/monitor-search/monitor-search-tabs/tab-accused/tab-accused.component';
import {TabRegisterComponent} from './component/monitor-search/monitor-search-tabs/tab-register/tab-register.component';
import {ResultCaseComponent} from './component/monitor-result/result-case/result-case.component';
import {ResultAccusedComponent} from './component/monitor-result/result-accused/result-accused.component';
import {TabLawComponent} from './component/monitor-search/monitor-search-tabs/tab-law/tab-law.component';
import {ResultLawComponent} from './component/monitor-result/result-law/result-law.component';
import {DetailRegisterComponent} from './component/lookup-detail/detail-tabs/detail-register/detail-register.component';
import {DetailDecisionComponent} from './component/lookup-detail/detail-tabs/detail-decision/detail-decision.component';
import {DetailDeciComponent} from './component/lookup-detail/detail-tabs/detail-decision/detail-deci/detail-deci.component';
import {RegisterComponent} from './component/lookup-search/search-tabs/register/register.component';
import {DecisionComponent} from './component/lookup-search/search-tabs/decision/decision.component';
import {AgainstComponent} from './component/lookup-search/search-tabs/against/against.component';
import {DetailAgainstComponent} from './component/lookup-detail/detail-tabs/detail-against/detail-against.component';
import {TabTransferComponent} from './component/monitor-search/monitor-search-tabs/tab-transfer/tab-transfer.component';
import {ResultTransferComponent} from './component/monitor-result/result-transfer/result-transfer.component';
import {TabVerifyComponent} from './component/monitor-search/monitor-search-tabs/tab-verify/tab-verify.component';
import {ResultVerifyComponent} from './component/monitor-result/result-verify/result-verify.component';
import {TabPenaltyComponent} from './component/monitor-search/monitor-search-tabs/tab-penalty/tab-penalty.component';
import {ResultPenaltyComponent} from './component/monitor-result/result-penalty/result-penalty.component';
import {TabDecisionComponent} from './component/monitor-search/monitor-search-tabs/tab-decision/tab-decision.component';
import {ResultDecisionComponent} from './component/monitor-result/result-decision/result-decision.component';
import {AppealComponent} from './component/lookup-search/search-tabs/appeal/appeal.component';
import {DetailAppealComponent} from './component/lookup-detail/detail-tabs/detail-appeal/detail-appeal.component';
import {TabAgainstComponent} from './component/monitor-search/monitor-search-tabs/tab-against/tab-against.component';
import {ResultAgainstComponent} from './component/monitor-result/result-against/result-against.component';
import {TabAppealComponent} from './component/monitor-search/monitor-search-tabs/tab-appeal/tab-appeal.component';
import {ResultAppealComponent} from './component/monitor-result/result-appeal/result-appeal.component';
import {DetailAccusedComponent} from "./component/lookup-detail/detail-tabs/detail-accused/detail-accused.component";
import {AccusedComponent} from "./component/lookup-search/search-tabs/accused/accused.component";
import {PenaltyComponent} from './component/lookup-search/search-tabs/penalty/penalty.component';
import {LawComponent} from './component/lookup-search/search-tabs/law/law.component';
import {GrouplawSearchComponent} from './component/lookup-search/search-tabs/law/grouplaw-search/grouplaw-search.component';
import {DetailInspectorComponent} from './component/lookup-detail/detail-tabs/detail-inspector/detail-inspector.component';
import {TransferComponent} from './component/lookup-search/search-tabs/transfer/transfer.component';
import {DetailTransferComponent} from './component/lookup-detail/detail-tabs/detail-transfer/detail-transfer.component';
import {DetailCentenceComponent} from './component/lookup-detail/detail-tabs/detail-centence/detail-centence.component';
import {CentDetailComponent} from './component/lookup-detail/detail-tabs/detail-centence/cent-detail/cent-detail.component';

@NgModule({
  declarations: [
    MonitorSearchComponent,
    ResultRegisterComponent,
    LookupSearchComponent,
    LookupDetailComponent,
    TabCaseComponent,
    TabAccusedComponent,
    TabRegisterComponent,
    ResultCaseComponent,
    ResultAccusedComponent,
    TabLawComponent,
    ResultLawComponent,
    DetailRegisterComponent,
    DetailDecisionComponent,
    RegisterComponent,
    DecisionComponent,
    DetailDeciComponent,
    AgainstComponent,
    DetailAgainstComponent,
    TabTransferComponent,
    ResultTransferComponent,
    TabVerifyComponent,
    ResultVerifyComponent,
    TabPenaltyComponent,
    ResultPenaltyComponent,
    TabDecisionComponent,
    ResultDecisionComponent,
    AppealComponent,
    DetailAppealComponent,
    TabAgainstComponent,
    ResultAgainstComponent,
    TabAppealComponent,
    ResultAppealComponent,
    AccusedComponent,
    DetailAccusedComponent,
    PenaltyComponent,
    LawComponent,
    GrouplawSearchComponent,
    DetailInspectorComponent,
    TransferComponent,
    DetailTransferComponent,
    DetailCentenceComponent,
    CentDetailComponent
  ],
  imports: [
    CommonModule,
    TracuuGiamsatRoutingModule,
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
    NzToolTipModule,
    NzInputNumberModule,
    NzTabsModule,
    NgxPrintModule
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TracuuGiamsatModule {
}
