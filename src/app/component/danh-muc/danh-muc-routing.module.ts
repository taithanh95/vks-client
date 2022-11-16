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
      pagename: 'Người xử lý',
      breadcrumb: 'Người xử lý'
    }
  },
  { path: 'adm-group', component: AdmgroupsSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Nhóm người sử dụng',
      breadcrumb: 'Nhóm người sử dụng'
    }
  },
  { path: 'adm-grant-group', component: AdmGrantGroupComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Phân quyền cho nhóm NSD',
      breadcrumb: 'Phân quyền cho nhóm NSD',
    }
  },
  {
    path: 'party', component: PartySearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Chức vụ Đảng',
      breadcrumb: 'Chức vụ Đảng'
    }
  },
  {
    path: 'office', component: OfficeSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Chức vụ chính quyền',
      breadcrumb: 'Chức vụ chính quyền'
    }
  },
  { path: 'adm-department', component: AdmdepartmentSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Phòng ban',
      breadcrumb: 'Phòng ban',
    }
  },
  { path: 'statistica', component: StatisticaSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Chỉ tiêu thống kê bị án',
      breadcrumb: 'Chỉ tiêu thống kê bị án',
    }
  },
  { path: 'statisticc', component: StatisticcSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Chỉ tiêu thống kê Vụ án',
      breadcrumb: 'Chỉ tiêu thống kê Vụ án',
    }
  },
  { path: 'againstresult', component: AgainsresualtSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Kết quả kháng nghị',
      breadcrumb: 'Kết quả kháng nghị',
    }
  },
  { path: 'against', component: AgainstSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Loại kháng nghị',
      breadcrumb: 'Loại kháng nghị',
    }
  },
  { path: 'appeal', component: AppealSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Loại kháng cáo',
      breadcrumb: 'Loại kháng cáo',
    }
  },
  { path: 'conclusion', component: ConclusionSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Kết luận bản án',
      breadcrumb: 'Kết luận bản án',
    }
  },
  { path: 'customs', component: CustomsSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Hải quan',
      breadcrumb: 'Hải quan',
    }
  },
  { path: 'resolve', component: ResolveSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Trường hợp giải quyết',
      breadcrumb: 'Trường hợp giải quyết',
    }
  },
  { path: 'code', component: CodeSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Bộ luật',
      breadcrumb: 'Bộ luật',
    }
  },
  { path: 'rule', component: RuleSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Thời hạn thụ lý',
      breadcrumb: 'Thời hạn thụ lý',
    }
  },
  {
    path: 'borderguards', component: BorderguardsSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Biên phòng',
      breadcrumb: 'Biên phòng'
    }
  },
  { path: 'transfer', component: TransferSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Lý do bàn giao',
      breadcrumb: 'Lý do bàn giao',
    }
  },
  { path: 'law-group', component: LawGroupSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Chương luật',
      breadcrumb: 'Chương luật',
    }
  },
  { path: 'knowledge', component: KnowledgeSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Trình độ học vấn',
      breadcrumb: 'Trình độ học vấn',
    }
  },
  { path: 'spc', component: SpcSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Tòa án',
      breadcrumb: 'Tòa án',
    }
  },
  { path: 'occupation', component: OccupationSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Nghề nghiệp',
      breadcrumb: 'Nghề nghiệp',
    }
  },
  { path: 'religion', component: ReligionSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Tôn giáo',
      breadcrumb: 'Tôn giáo',
    }
  },
  { path: 'location', component: LocationSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Địa chính',
      breadcrumb: 'Địa chính',
    }
  },
  { path: 'nation', component: NationSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Dân tộc',
      breadcrumb: 'Dân tộc',
    }
  },
  { path: 'country', component: CountrySearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Quốc gia',
      breadcrumb: 'Quốc gia',
    }
  },
  {
    path: 'spp', component: SppSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Viện kiểm sát',
      breadcrumb: 'Viện kiểm sát',
    }
  },
  { path: 'army', component: ArmySearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Đơn vị quân đội',
      breadcrumb: 'Đơn vị quân đội',
    }
  },
  { path: 'ranger', component: RangerSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Đơn vị kiểm lâm',
      breadcrumb: 'Đơn vị kiểm lâm',
    }
  },
  { path: 'reason', component: ReasonSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Lý do quyết định',
      breadcrumb: 'Lý do quyết định',
    }
  },
  { path: 'police', component: PoliceSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Cơ quan công an',
      breadcrumb: 'Cơ quan công an',
    }
  },
  { path: 'decitype', component: DecitypeSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Loại quyết định',
      breadcrumb: 'Loại quyết định',
    }
  },
  { path: 'law', component: LawSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Điều luật',
      breadcrumb: 'Điều luật',
    }
  },
  { path: 'pol', component: PolSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Cơ quan điều tra',
      breadcrumb: 'Cơ quan điều tra',
    }
  },
  { path: 'penalty', component: PenaltySearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Hình phạt',
      breadcrumb: 'Hình phạt',
    }
  },
  { path: 'decision', component: DecisionSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Quyết định',
      breadcrumb: 'Quyết định',
    }
  },
  {
    path: 'law-penalty', component: LawPenaltySearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Khung hình phạt',
      breadcrumb: 'Khung hình phạt',
    }
  },
  { path: 'prison', component: PrisonSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Trại giam',
      breadcrumb: 'Trại giam',
    }
  },
  { path: 'law-groupchap', component: LawgroupchapSearchComponent, canActivate: [AuthGuard],
    data: {
      pagename: 'Nhóm tội theo chương luật',
      breadcrumb: 'Nhóm tội theo chương luật',
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhMucRoutingModule {
}
