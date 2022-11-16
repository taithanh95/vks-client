import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {InspectorSearchComponent} from "./component/inspector-search/inspector-search.component";
import {DanhMucRoutingModule} from "./danh-muc-routing.module";
import {NzGridModule} from "ng-zorro-antd/grid";
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {TranslateModule} from "@ngx-translate/core";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {SharedModule} from "../../shared/shared.module";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {InspectorDetailComponent} from './component/inspector-detail/inspector-detail.component';
import {InspectorEditComponent} from './component/inspector-edit/inspector-edit.component';
import {InspectorCreateComponent} from './component/inspector-create/inspector-create.component';
import {InspectorChangeComponent} from './component/inspector-change/inspector-change.component';
import {AdmgroupsSearchComponent} from './component/admgroups/admgroups-search/admgroups-search.component';
import {AdmgroupsCreateComponent} from './component/admgroups/admgroups-create/admgroups-create.component';
import {AdmgroupsDetailComponent} from './component/admgroups/admgroups-detail/admgroups-detail.component';
import {AdmGrantGroupComponent} from './component/admgrant/adm-grant-group/adm-grant-group.component';
import {PartySearchComponent} from './component/lst-party/party-search/party-search.component';
import {PartyDetailComponent} from './component/lst-party/party-detail/party-detail.component';
import {PartyCreateComponent} from './component/lst-party/party-create/party-create.component';
import {PartyEditComponent} from './component/lst-party/party-edit/party-edit.component';
import {OfficeSearchComponent} from './component/lst-office/office-search/office-search.component';
import {OfficeCreateComponent} from './component/lst-office/office-create/office-create.component';
import {OfficeDetailComponent} from './component/lst-office/office-detail/office-detail.component';
import {OfficeEditComponent} from './component/lst-office/office-edit/office-edit.component';
import {AdmdepartmentSearchComponent} from './component/admdepartment/admdepartment-search/admdepartment-search.component';
import {AdmdepartmentDetailComponent} from './component/admdepartment/admdepartment-detail/admdepartment-detail.component';
import {AdmdepartmentCreateComponent} from './component/admdepartment/admdepartment-create/admdepartment-create.component';
import { StatisticaCreateComponent } from './component/lst_statistica/statistica-create/statistica-create.component';
import { StatisticaSearchComponent } from './component/lst_statistica/statistica-search/statistica-search.component';
import { StatisticaDetailComponent } from './component/lst_statistica/statistica-detail/statistica-detail.component';
import { StatisticcSearchComponent } from './component/lst_statisticc/statisticc-search/statisticc-search.component';
import { StatisticcDetailComponent } from './component/lst_statisticc/statisticc-detail/statisticc-detail.component';
import { StatisticcCreateComponent } from './component/lst_statisticc/statisticc-create/statisticc-create.component';
import { AgainsresualtCreateComponent } from './component/lst-againstresult/againsresualt-create/againsresualt-create.component';
import { AgainsresualtDetailComponent } from './component/lst-againstresult/againsresualt-detail/againsresualt-detail.component';
import { AgainsresualtSearchComponent } from './component/lst-againstresult/againsresualt-search/againsresualt-search.component';
import { AgainstSearchComponent } from './component/lst-against/against-search/against-search.component';
import { AgainstDetailComponent } from './component/lst-against/against-detail/against-detail.component';
import { AgainstCreateComponent } from './component/lst-against/against-create/against-create.component';
import { AppealSearchComponent } from './component/lst-appeal/appeal-search/appeal-search.component';
import { AppealCreateComponent } from './component/lst-appeal/appeal-create/appeal-create.component';
import { AppealDetailComponent } from './component/lst-appeal/appeal-detail/appeal-detail.component';
import { ConclusionSearchComponent } from './component/lst-conclusion/conclusion-search/conclusion-search.component';
import { ConclusionDetailComponent } from './component/lst-conclusion/conclusion-detail/conclusion-detail.component';
import { ConclusionCreateComponent } from './component/lst-conclusion/conclusion-create/conclusion-create.component';
import { CustomsSearchComponent } from './component/lst-customs/customs-search/customs-search.component';
import { CustomsDetailComponent } from './component/lst-customs/customs-detail/customs-detail.component';
import { CustomsCreateComponent } from './component/lst-customs/customs-create/customs-create.component';
import { CustomsEditComponent } from './component/lst-customs/customs-edit/customs-edit.component';
import { ResolveSearchComponent } from './component/lst-resolve/resolve-search/resolve-search.component';
import { ResolveDetailComponent } from './component/lst-resolve/resolve-detail/resolve-detail.component';
import { ResolveCreateComponent } from './component/lst-resolve/resolve-create/resolve-create.component';
import { CodeSearchComponent } from './component/lst-code/code-search/code-search.component';
import { CodeDetailComponent } from './component/lst-code/code-detail/code-detail.component';
import { CodeCreateComponent } from './component/lst-code/code-create/code-create.component';
import { CodeEditComponent } from './component/lst-code/code-edit/code-edit.component';
import { RuleSearchComponent } from './component/lst-rule/rule-search/rule-search.component';
import { RuleDetailComponent } from './component/lst-rule/rule-detail/rule-detail.component';
import { RuleCreateComponent } from './component/lst-rule/rule-create/rule-create.component';
import { BorderguardsSearchComponent } from './component/lst-borderguards/borderguards-search/borderguards-search.component';
import { BorderguardsDetailComponent } from './component/lst-borderguards/borderguards-detail/borderguards-detail.component';
import { BorderguardsCreateComponent } from './component/lst-borderguards/borderguards-create/borderguards-create.component';
import { BorderguardsEditComponent } from './component/lst-borderguards/borderguards-edit/borderguards-edit.component';
import { TransferCreateComponent } from './component/lst-transfer/transfer-create/transfer-create.component';
import { TransferDetailComponent } from './component/lst-transfer/transfer-detail/transfer-detail.component';
import { TransferSearchComponent } from './component/lst-transfer/transfer-search/transfer-search.component';
import { LawGroupDetailComponent } from './component/lst-law-group/law-group-detail/law-group-detail.component';
import { LawGroupCreateComponent } from './component/lst-law-group/law-group-create/law-group-create.component';
import { LawGroupEditComponent } from './component/lst-law-group/law-group-edit/law-group-edit.component';
import {LawGroupSearchComponent} from "./component/lst-law-group/law-group-search/law-group-search.component";
import { KnowledgeCreateComponent } from './component/lst-knowladge/knowledge-create/knowledge-create.component';
import { KnowledgeDetailComponent } from './component/lst-knowladge/knowledge-detail/knowledge-detail.component';
import { KnowledgeSearchComponent } from './component/lst-knowladge/knowledge-search/knowledge-search.component';
import {SpcEditComponent} from "./component/lst-spc/spc-edit/spc-edit.component";
import {SpcCreateComponent} from "./component/lst-spc/spc-create/spc-create.component";
import {SpcDetailComponent} from "./component/lst-spc/spc-detail/spc-detail.component";
import {SpcSearchComponent} from "./component/lst-spc/spc-search/spc-search.component";
import { OccupationSearchComponent } from './component/lst-occupation/occupation-search/occupation-search.component';
import { OccupationDetailComponent } from './component/lst-occupation/occupation-detail/occupation-detail.component';
import { OccupationCreateComponent } from './component/lst-occupation/occupation-create/occupation-create.component';
import { ReligionSearchComponent } from './component/lst-religion/religion-search/religion-search.component';
import { ReligionDetailComponent } from './component/lst-religion/religion-detail/religion-detail.component';
import { ReligionCreateComponent } from './component/lst-religion/religion-create/religion-create.component';
import {LocationEditComponent} from './component/lst-location/location-edit/location-edit.component';
import {LocationSearchComponent} from './component/lst-location/location-search/location-search.component';
import {LocationCreateComponent} from './component/lst-location/location-create/location-create.component';
import {LocationDetailComponent} from './component/lst-location/location-detail/location-detail.component';
import { NationSearchComponent } from './component/lst-nation/nation-search/nation-search.component';
import { NationDetailComponent } from './component/lst-nation/nation-detail/nation-detail.component';
import { NationCreateComponent } from './component/lst-nation/nation-create/nation-create.component';
import { CountrySearchComponent } from './component/lst-country/country-search/country-search.component';
import { CountryDetailComponent } from './component/lst-country/country-detail/country-detail.component';
import { CountryCreateComponent } from './component/lst-country/country-create/country-create.component';
import { SppSearchComponent } from './component/lst_spp/spp-search/spp-search.component';
import { SppDetailComponent } from './component/lst_spp/spp-detail/spp-detail.component';
import { SppCreateComponent } from './component/lst_spp/spp-create/spp-create.component';
import { SppEditComponent } from './component/lst_spp/spp-edit/spp-edit.component';
import {ArmySearchComponent} from './component/lst-army/army-search/army-search.component';
import {ArmyEditComponent} from './component/lst-army/army-edit/army-edit.component';
import {ArmyCreateComponent} from './component/lst-army/army-create/army-create.component';
import {ArmyDetailComponent} from './component/lst-army/army-detail/army-detail.component';
import { RangerSearchComponent } from './component/lst-ranger/ranger-search/ranger-search.component';
import { RangerCreateComponent } from './component/lst-ranger/ranger-create/ranger-create.component';
import { RangerDetailComponent } from './component/lst-ranger/ranger-detail/ranger-detail.component';
import { RangerEditComponent } from './component/lst-ranger/ranger-edit/ranger-edit.component';
import { ReasonCreateComponent } from './component/lst-reason/reason-create/reason-create.component';
import { ReasonDetailComponent } from './component/lst-reason/reason-detail/reason-detail.component';
import { ReasonSearchComponent } from './component/lst-reason/reason-search/reason-search.component';
import {PoliceSearchComponent} from './component/lst-police/police-search/police-search.component';
import {PoliceDetailComponent} from './component/lst-police/police-detail/police-detail.component';
import {PoliceEditComponent} from './component/lst-police/police-edit/police-edit.component';
import {PoliceCreateComponent} from './component/lst-police/police-create/police-create.component';
import { DecitypeSearchComponent } from './component/lst-decitype/decitype-search/decitype-search.component';
import { DecitypeDetailComponent } from './component/lst-decitype/decitype-detail/decitype-detail.component';
import { DecitypeCreateComponent } from './component/lst-decitype/decitype-create/decitype-create.component';
import { LawSearchComponent } from './component/lst-law/law-search/law-search.component';
import { LawDetailComponent } from './component/lst-law/law-detail/law-detail.component';
import { LawCreateComponent } from './component/lst-law/law-create/law-create.component';
import {DateChangeService} from "../../service/date-change.service";
import {DatePipe} from "@angular/common";
import { LawEditComponent } from './component/lst-law/law-edit/law-edit.component';
import {PolCreateComponent} from './component/lst-pol/pol-create/pol-create.component';
import {PolEditComponent} from './component/lst-pol/pol-edit/pol-edit.component';
import {PolDetailComponent} from './component/lst-pol/pol-detail/pol-detail.component';
import {PolSearchComponent} from './component/lst-pol/pol-search/pol-search.component';
import { PenaltySearchComponent } from './component/lst-penalty/penalty-search/penalty-search.component';
import { PenaltyDetailComponent } from './component/lst-penalty/penalty-detail/penalty-detail.component';
import { PenaltyCreateComponent } from './component/lst-penalty/penalty-create/penalty-create.component';
import { PenaltyEditComponent } from './component/lst-penalty/penalty-edit/penalty-edit.component';
import { DecisionSearchComponent } from './component/lst-decision/decision-search/decision-search.component';
import { DecisionDetailComponent } from './component/lst-decision/decision-detail/decision-detail.component';
import { DecisionCreateComponent } from './component/lst-decision/decision-create/decision-create.component';
import { LawPenaltySearchComponent } from './component/lst-law-penalty/law-penalty-search/law-penalty-search.component';
import { LawPenaltyDetailComponent } from './component/lst-law-penalty/law-penalty-detail/law-penalty-detail.component';
import { LawPenaltyUpdateComponent } from './component/lst-law-penalty/law-penalty-update/law-penalty-update.component';
import {PrisonSearchComponent} from './component/lst-prison/prison-search/prison-search.component';
import {PrisonEditComponent} from './component/lst-prison/prison-edit/prison-edit.component';
import {PrisonCreateComponent} from './component/lst-prison/prison-create/prison-create.component';
import {PrisonDetailComponent} from './component/lst-prison/prison-detail/prison-detail.component';
import { LawgroupchapCreateComponent } from './component/lst-lawgroupchap/lawgroupchap-create/lawgroupchap-create.component';
import { LawgroupchapDetailComponent } from './component/lst-lawgroupchap/lawgroupchap-detail/lawgroupchap-detail.component';
import { LawgroupchapSearchComponent } from './component/lst-lawgroupchap/lawgroupchap-search/lawgroupchap-search.component';
import {StringService} from '../../common/util/string.service';

@NgModule({
  declarations: [
    InspectorSearchComponent,
    InspectorDetailComponent,
    InspectorEditComponent,
    InspectorCreateComponent,
    InspectorChangeComponent,
    AdmgroupsSearchComponent,
    AdmgroupsCreateComponent,
    AdmgroupsDetailComponent,
    AdmGrantGroupComponent,
    PartySearchComponent,
    PartyDetailComponent,
    PartyCreateComponent,
    PartyEditComponent,
    OfficeSearchComponent,
    OfficeCreateComponent,
    OfficeDetailComponent,
    OfficeEditComponent,
    AdmGrantGroupComponent,
    AdmdepartmentSearchComponent,
    AdmdepartmentDetailComponent,
    AdmdepartmentCreateComponent,
    StatisticaCreateComponent,
    StatisticaSearchComponent,
    StatisticaDetailComponent,
    StatisticcSearchComponent,
    StatisticcDetailComponent,
    StatisticcCreateComponent,
    AgainsresualtCreateComponent,
    AgainsresualtDetailComponent,
    AgainsresualtSearchComponent,
    AgainstCreateComponent,
    AgainstDetailComponent,
    AgainstSearchComponent,
    AppealSearchComponent,
    AppealCreateComponent,
    AppealDetailComponent,
    ConclusionSearchComponent,
    ConclusionDetailComponent,
    ConclusionCreateComponent,
    CustomsSearchComponent,
    CustomsDetailComponent,
    CustomsCreateComponent,
    CustomsEditComponent,
    ResolveSearchComponent,
    ResolveDetailComponent,
    ResolveCreateComponent,
    CodeSearchComponent,
    CodeDetailComponent,
    CodeCreateComponent,
    CodeEditComponent,
    RuleSearchComponent,
    RuleDetailComponent,
    RuleCreateComponent,
    BorderguardsSearchComponent,
    BorderguardsCreateComponent,
    BorderguardsDetailComponent,
    BorderguardsEditComponent,
    TransferSearchComponent,
    TransferDetailComponent,
    TransferCreateComponent,
    LawGroupSearchComponent,
    LawGroupDetailComponent,
    LawGroupCreateComponent,
    LawGroupEditComponent,
    KnowledgeSearchComponent,
    KnowledgeDetailComponent,
    KnowledgeCreateComponent,
    SpcSearchComponent,
    SpcDetailComponent,
    SpcCreateComponent,
    SpcEditComponent,
    OccupationSearchComponent,
    OccupationDetailComponent,
    OccupationCreateComponent,
    ReligionSearchComponent,
    ReligionDetailComponent,
    ReligionCreateComponent,
    LocationSearchComponent,
    LocationCreateComponent,
    LocationEditComponent,
    LocationDetailComponent,
    NationSearchComponent,
    NationDetailComponent,
    NationCreateComponent,
    CountrySearchComponent,
    CountryDetailComponent,
    CountryCreateComponent,
    SppSearchComponent,
    SppDetailComponent,
    SppCreateComponent,
    SppEditComponent,
    ArmySearchComponent,
    ArmyCreateComponent,
    ArmyEditComponent,
    ArmyDetailComponent,
    RangerSearchComponent,
    RangerCreateComponent,
    RangerDetailComponent,
    RangerEditComponent,
    ReasonSearchComponent,
    ReasonDetailComponent,
    ReasonCreateComponent,
    PoliceSearchComponent,
    PoliceCreateComponent,
    PoliceEditComponent,
    PoliceDetailComponent,
    DecitypeSearchComponent,
    DecitypeDetailComponent,
    DecitypeCreateComponent,
    LawSearchComponent,
    LawDetailComponent,
    LawCreateComponent,
    LawEditComponent,
    PolSearchComponent,
    PolCreateComponent,
    PolEditComponent,
    PolDetailComponent,
    PenaltySearchComponent,
    PenaltyDetailComponent,
    PenaltyCreateComponent,
    PenaltyEditComponent,
    DecisionSearchComponent,
    DecisionDetailComponent,
    DecisionCreateComponent,
    LawPenaltySearchComponent,
    LawPenaltyDetailComponent,
    LawPenaltyUpdateComponent,
    PrisonSearchComponent,
    PrisonCreateComponent,
    PrisonEditComponent,
    PrisonDetailComponent,
    LawgroupchapSearchComponent,
    LawgroupchapDetailComponent,
    LawgroupchapCreateComponent
  ],
  imports: [
    DanhMucRoutingModule,
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
    NzInputNumberModule
  ],
  providers: [DateChangeService, DatePipe, StringService]
  ,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DanhMucModule {
}
