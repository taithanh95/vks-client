import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../shared/guards/guards.class";
import {NgModule} from "@angular/core";
import {InspectorSearchComponent} from "./component/inspector-search/inspector-search.component";
import { AdmgroupsSearchComponent } from "./component/admgroups/admgroups-search/admgroups-search.component";
import { AdmGrantGroupComponent } from "./component/admgrant/adm-grant-group/adm-grant-group.component";
import {PartySearchComponent} from "./component/lst-party/party-search/party-search.component";
import {OfficeSearchComponent} from "./component/lst-office/office-search/office-search.component";
import { AdmdepartmentSearchComponent } from "./component/admdepartment/admdepartment-search/admdepartment-search.component";
import { StatisticaSearchComponent } from "./component/lst_statistica/statistica-search/statistica-search.component";
import { StatisticcSearchComponent } from "./component/lst_statisticc/statisticc-search/statisticc-search.component";
import { AgainsresualtSearchComponent } from "./component/lst-againstresult/againsresualt-search/againsresualt-search.component";
import { AgainstSearchComponent } from "./component/lst-against/against-search/against-search.component";
import { AppealSearchComponent } from "./component/lst-appeal/appeal-search/appeal-search.component";
import { ConclusionSearchComponent } from "./component/lst-conclusion/conclusion-search/conclusion-search.component";
import {CustomsSearchComponent} from "./component/lst-customs/customs-search/customs-search.component";
import { ResolveSearchComponent } from "./component/lst-resolve/resolve-search/resolve-search.component";
import {CodeSearchComponent} from "./component/lst-code/code-search/code-search.component";
import { RuleSearchComponent } from "./component/lst-rule/rule-search/rule-search.component";
import { BorderguardsSearchComponent } from './component/lst-borderguards/borderguards-search/borderguards-search.component';
import { TransferSearchComponent } from "./component/lst-transfer/transfer-search/transfer-search.component";
import {LawGroupSearchComponent} from "./component/lst-law-group/law-group-search/law-group-search.component";
import { KnowledgeSearchComponent } from "./component/lst-knowladge/knowledge-search/knowledge-search.component";
import {SpcSearchComponent} from "./component/lst-spc/spc-search/spc-search.component";
import { OccupationSearchComponent } from "./component/lst-occupation/occupation-search/occupation-search.component";
import { ReligionSearchComponent } from "./component/lst-religion/religion-search/religion-search.component";
import {LocationSearchComponent} from './component/lst-location/location-search/location-search.component';
import { NationSearchComponent } from "./component/lst-nation/nation-search/nation-search.component";
import { CountrySearchComponent } from "./component/lst-country/country-search/country-search.component";
import {SppSearchComponent} from "./component/lst_spp/spp-search/spp-search.component";
import {ArmySearchComponent} from './component/lst-army/army-search/army-search.component';
import {RangerSearchComponent} from './component/lst-ranger/ranger-search/ranger-search.component';
import { ReasonSearchComponent } from "./component/lst-reason/reason-search/reason-search.component";
import {PoliceSearchComponent} from './component/lst-police/police-search/police-search.component';
import { DecitypeSearchComponent } from "./component/lst-decitype/decitype-search/decitype-search.component";
import {LawSearchComponent} from "./component/lst-law/law-search/law-search.component";
import {PolSearchComponent} from './component/lst-pol/pol-search/pol-search.component';
import {PenaltyComponent} from "../thi-hanh-an/components/update/penalty/penalty.component";
import {PenaltySearchComponent} from "./component/lst-penalty/penalty-search/penalty-search.component";
import { DecisionSearchComponent } from "./component/lst-decision/decision-search/decision-search.component";
import {LawPenaltySearchComponent} from "./component/lst-law-penalty/law-penalty-search/law-penalty-search.component";
import {PrisonSearchComponent} from './component/lst-prison/prison-search/prison-search.component';
import { LawgroupchapSearchComponent } from "./component/lst-lawgroupchap/lawgroupchap-search/lawgroupchap-search.component";

const routes: Routes = [
  {
    path: 'ksv-dtv', component: InspectorSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Ng?????i x??? l??',
      breadcrumb: 'Ng?????i x??? l??'
    }
  },
  { path: 'adm-group', component: AdmgroupsSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Nh??m ng?????i s??? d???ng',
      breadcrumb: 'Nh??m ng?????i s??? d???ng'
    }
  },
  { path: 'adm-grant-group', component: AdmGrantGroupComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Ph??n quy???n cho nh??m NSD',
      breadcrumb: 'Ph??n quy???n cho nh??m NSD',
    }
  },
  {
    path: 'party', component: PartySearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Ch???c v??? ?????ng',
      breadcrumb: 'Ch???c v??? ?????ng'
    }
  },
  {
    path: 'office', component: OfficeSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Ch???c v??? ch??nh quy???n',
      breadcrumb: 'Ch???c v??? ch??nh quy???n'
    }
  },
  { path: 'adm-department', component: AdmdepartmentSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Ph??ng ban',
      breadcrumb: 'Ph??ng ban',
    }
  },
  { path: 'statistica', component: StatisticaSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Ch??? ti??u th???ng k?? b??? ??n',
      breadcrumb: 'Ch??? ti??u th???ng k?? b??? ??n',
    }
  },
  { path: 'statisticc', component: StatisticcSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Ch??? ti??u th???ng k?? V??? ??n',
      breadcrumb: 'Ch??? ti??u th???ng k?? V??? ??n',
    }
  },
  { path: 'againstresult', component: AgainsresualtSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'K???t qu??? kh??ng ngh???',
      breadcrumb: 'K???t qu??? kh??ng ngh???',
    }
  },
  { path: 'against', component: AgainstSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Lo???i kh??ng ngh???',
      breadcrumb: 'Lo???i kh??ng ngh???',
    }
  },
  { path: 'appeal', component: AppealSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Lo???i kh??ng c??o',
      breadcrumb: 'Lo???i kh??ng c??o',
    }
  },
  { path: 'conclusion', component: ConclusionSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'K???t lu???n b???n ??n',
      breadcrumb: 'K???t lu???n b???n ??n',
    }
  },
  { path: 'customs', component: CustomsSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'H???i quan',
      breadcrumb: 'H???i quan',
    }
  },
  { path: 'resolve', component: ResolveSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Tr?????ng h???p gi???i quy???t',
      breadcrumb: 'Tr?????ng h???p gi???i quy???t',
    }
  },
  { path: 'code', component: CodeSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'B??? lu???t',
      breadcrumb: 'B??? lu???t',
    }
  },
  { path: 'rule', component: RuleSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Th???i h???n th??? l??',
      breadcrumb: 'Th???i h???n th??? l??',
    }
  },
  {
    path: 'borderguards', component: BorderguardsSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Bi??n ph??ng',
      breadcrumb: 'Bi??n ph??ng'
    }
  },
  { path: 'transfer', component: TransferSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'L?? do b??n giao',
      breadcrumb: 'L?? do b??n giao',
    }
  },
  { path: 'law-group', component: LawGroupSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Ch????ng lu???t',
      breadcrumb: 'Ch????ng lu???t',
    }
  },
  { path: 'knowledge', component: KnowledgeSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Tr??nh ????? h???c v???n',
      breadcrumb: 'Tr??nh ????? h???c v???n',
    }
  },
  { path: 'spc', component: SpcSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'T??a ??n',
      breadcrumb: 'T??a ??n',
    }
  },
  { path: 'occupation', component: OccupationSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Ngh??? nghi???p',
      breadcrumb: 'Ngh??? nghi???p',
    }
  },
  { path: 'religion', component: ReligionSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'T??n gi??o',
      breadcrumb: 'T??n gi??o',
    }
  },
  { path: 'location', component: LocationSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: '?????a ch??nh',
      breadcrumb: '?????a ch??nh',
    }
  },
  { path: 'nation', component: NationSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'D??n t???c',
      breadcrumb: 'D??n t???c',
    }
  },
  { path: 'country', component: CountrySearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Qu???c gia',
      breadcrumb: 'Qu???c gia',
    }
  },
  {
    path: 'spp', component: SppSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Vi???n ki???m s??t',
      breadcrumb: 'Vi???n ki???m s??t',
    }
  },
  { path: 'army', component: ArmySearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: '????n v??? qu??n ?????i',
      breadcrumb: '????n v??? qu??n ?????i',
    }
  },
  { path: 'ranger', component: RangerSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: '????n v??? ki???m l??m',
      breadcrumb: '????n v??? ki???m l??m',
    }
  },
  { path: 'reason', component: ReasonSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'L?? do quy???t ?????nh',
      breadcrumb: 'L?? do quy???t ?????nh',
    }
  },
  { path: 'police', component: PoliceSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'C?? quan c??ng an',
      breadcrumb: 'C?? quan c??ng an',
    }
  },
  { path: 'decitype', component: DecitypeSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Lo???i quy???t ?????nh',
      breadcrumb: 'Lo???i quy???t ?????nh',
    }
  },
  { path: 'law', component: LawSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: '??i???u lu???t',
      breadcrumb: '??i???u lu???t',
    }
  },
  { path: 'pol', component: PolSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'C?? quan ??i???u tra',
      breadcrumb: 'C?? quan ??i???u tra',
    }
  },
  { path: 'penalty', component: PenaltySearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'H??nh ph???t',
      breadcrumb: 'H??nh ph???t',
    }
  },
  { path: 'decision', component: DecisionSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Quy???t ?????nh',
      breadcrumb: 'Quy???t ?????nh',
    }
  },
  {
    path: 'law-penalty', component: LawPenaltySearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Khung h??nh ph???t',
      breadcrumb: 'Khung h??nh ph???t',
    }
  },
  { path: 'prison', component: PrisonSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Tr???i giam',
      breadcrumb: 'Tr???i giam',
    }
  },
  { path: 'law-groupchap', component: LawgroupchapSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Nh??m t???i theo ch????ng lu???t',
      breadcrumb: 'Nh??m t???i theo ch????ng lu???t',
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhMucRoutingModule {
}
