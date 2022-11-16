import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import {SppService} from '../../../../service/spp-service';
import {GeneralService} from '../../../../service/general-service';
import {DRegisterComponent} from './d-register/d-register.component';
import {DReginsComponent} from './d-regins/d-regins.component';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {DAccuComponent} from './d-accu/d-accu.component';
import {DAccuLegalComponent} from './d-accu-legal/d-accu-legal.component';
import {DTempComponent} from './d-temp/d-temp.component';
import {DLawcodeComponent} from './d-lawcode/d-lawcode.component';
import {DDecisionCaseComponent} from './d-decision-case/d-decision-case.component';
import {DCentenceG1Component} from './d-centence-g1/d-centence-g1.component';
import {DSppspcpolComponent} from './d-sppspcpol/d-sppspcpol.component';
import {DDecisionAccComponent} from './d-decision-acc/d-decision-acc.component';
import {DVictimComponent} from './d-victim/d-victim.component';
import {DDenunciationListComponent} from './d-denunciation-list/d-denunciation-list.component';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {DSppviolantionComponent} from './d-sppviolantion/d-sppviolantion.component';
import {DArrestDetentionArresteeComponent} from './d-arrest-detention-arrestee/d-arrest-detention-arrestee.component';
import {DArresteeDetailComponent} from './d-arrestee-detail/d-arrestee-detail.component';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {DDisciplineViolationListComponent} from './d-discipline-violation-list/d-discipline-violation-list.component';
import {DLawOffenceListComponent} from './d-law-offence-list/d-law-offence-list.component';
import {DSppDamagedComponent} from './d-spp-damaged/d-spp-damaged.component';
import {DSppDamagedDisableComponent} from './d-spp-damaged-disable/d-spp-damaged-disable.component';
import {DInvestigativeActivitiesComponent} from './d-investigative-activities/d-investigative-activities.component';
import { DDenunciationDetailComponent } from './d-denunciation-detail/d-denunciation-detail.component';
import { FDenouncedPersonListComponent } from './d-denunciation-detail/f-denounced-person-list/f-denounced-person-list.component';
import { FVerificationInvestigationListComponent } from './d-denunciation-detail/f-verification-investigation-list/f-verification-investigation-list.component';
import { FInvestigationActivityListComponent } from './d-denunciation-detail/f-investigation-activity-list/f-investigation-activity-list.component';
import { FSettlementDecisionListComponent } from './d-denunciation-detail/f-settlement-decision-list/f-settlement-decision-list.component';
import { TypeOfVerificationPipe } from './d-denunciation-detail/type-of-verification.pipe';
import { ParsePipe } from 'ngx-moment';
import { DDenouncedPersonDetailComponent } from './d-denunciation-detail/d-denounced-person-detail/d-denounced-person-detail.component';
import { DInvestigationActivityDetailComponent } from './d-denunciation-detail/d-investigation-activity-detail/d-investigation-activity-detail.component';
import { DVerificationInvestigationDetailComponent } from './d-denunciation-detail/d-verification-investigation-detail/d-verification-investigation-detail.component';
import { DSettlementDecisionDetailComponent } from './d-denunciation-detail/d-settlement-decision-detail/d-settlement-decision-detail.component';
import { DRegisterDisableComponent } from './d-register-disable/d-register-disable.component';
import { DReginsDisableComponent } from './d-regins-disable/d-regins-disable.component';
import { DAccuDisableComponent } from './d-accu-disable/d-accu-disable.component';
import { DDecisionCaseDisableComponent } from './d-decision-case-disable/d-decision-case-disable.component';
import { DCentenceG1DisableComponent } from './d-centence-g1-disable/d-centence-g1-disable.component';
import { DSppspcpolDisableComponent } from './d-sppspcpol-disable/d-sppspcpol-disable.component';
import { DAccuLegalDisableComponent } from './d-accu-legal-disable/d-accu-legal-disable.component';
import { DRegisterDecisionComponent } from './d-register-decision/d-register-decision.component';
import { DCentenceComponent } from './d-centence/d-centence.component';
import { DCentCenlawG1Component } from './d-cent-cenlaw-g1/d-cent-cenlaw-g1.component';
import { DAppealComponent } from './d-appeal/d-appeal.component';
import { DAgainstComponent } from './d-against/d-against.component';
import { DCenlawcodeComponent } from './d-cenlawcode/d-cenlawcode.component';
import { DAppealDisableComponent } from './d-appeal-disable/d-appeal-disable.component';
import { DAgainstDisableComponent } from './d-against-disable/d-against-disable.component';
import { DReportComponent } from './d-report/d-report.component';
import { DCentappedComponent } from './d-centapped/d-centapped.component';
import { DAgainstResultComponent } from './d-against-result/d-against-result.component';
import { DCentConcluComponent } from './d-cent-conclu/d-cent-conclu.component';
import { DPreventMeasuresComponent } from './d-prevent-measures/d-prevent-measures.component';
import { DCenttenlawComponent } from './d-centtenlaw/d-centtenlaw.component';
import { DCenttenlawcodeComponent } from './d-centtenlawcode/d-centtenlawcode.component';
import { DCentStatisCaseComponent } from './d-cent-statis-case/d-cent-statis-case.component';
import { DCentStatisCaseDetailComponent } from './d-cent-statis-case-detail/d-cent-statis-case-detail.component';
import { DCaselawcodeComponent } from './d-caselawcode/d-caselawcode.component';
import { DReportCaseinfoComponent } from './d-report-caseinfo/d-report-caseinfo.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    DRegisterComponent,
    DReginsComponent,
    DAccuComponent,
    DAccuLegalComponent,
    DTempComponent,
    DLawcodeComponent,
    DDecisionCaseComponent,
    DCentenceG1Component,
    DSppspcpolComponent,
    DDecisionAccComponent,
    DVictimComponent,
    DDenunciationListComponent,
    DSppviolantionComponent,
    DArrestDetentionArresteeComponent,
    DArresteeDetailComponent,
    DDisciplineViolationListComponent,
    DLawOffenceListComponent,
    DSppDamagedComponent,
    DSppDamagedDisableComponent,
    DInvestigativeActivitiesComponent,
    DDenunciationDetailComponent,
    FDenouncedPersonListComponent,
    FVerificationInvestigationListComponent,
    FInvestigationActivityListComponent,
    FSettlementDecisionListComponent,
    TypeOfVerificationPipe,
    DDenouncedPersonDetailComponent,
    DInvestigationActivityDetailComponent,
    DVerificationInvestigationDetailComponent,
    DSettlementDecisionDetailComponent,
    DRegisterDisableComponent,
    DReginsDisableComponent,
    DAccuDisableComponent,
    DDecisionCaseDisableComponent,
    DCentenceG1DisableComponent,
    DSppspcpolDisableComponent,
    DAccuLegalDisableComponent,
    DRegisterDecisionComponent,
    DCentenceComponent,
    DCentCenlawG1Component,
    DAppealComponent,
    DAgainstComponent,
    DCenlawcodeComponent,
    DAppealDisableComponent,
    DAgainstDisableComponent,
    DReportComponent,
    DCentappedComponent,
    DAgainstResultComponent,
    DCentConcluComponent,
    DPreventMeasuresComponent,
    DCenttenlawComponent,
    DCenttenlawcodeComponent,
    DCentStatisCaseComponent,
    DCentStatisCaseDetailComponent,
    DCaselawcodeComponent,
    DReportCaseinfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NzAutocompleteModule,
    NzToolTipModule,
    NzEmptyModule,
    RouterModule
  ],
  providers: [GeneralService, SppService,ParsePipe],
  exports: [
    DRegisterComponent,
    DReginsComponent,
    DAccuComponent,
    DAccuLegalComponent,
    DTempComponent,
    DDecisionCaseComponent,
    DCentenceG1Component,
    DSppspcpolComponent,
    DDecisionAccComponent,
    DVictimComponent,
    DDenunciationListComponent,
    DSppDamagedComponent,
    DSppDamagedDisableComponent,
    DInvestigativeActivitiesComponent,
    DRegisterDisableComponent,
    DReginsDisableComponent,
    DAccuDisableComponent,
    DDecisionCaseDisableComponent,
    DCentenceG1DisableComponent,
    DSppspcpolDisableComponent,
    DAccuLegalDisableComponent,
    DCentenceComponent,
    DAppealComponent,
    DAgainstComponent,
    DAppealDisableComponent,
    DAgainstDisableComponent,
    DReportComponent,
    DCentappedComponent,
    DAgainstResultComponent,
    DPreventMeasuresComponent,
    DCaselawcodeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DialogsModule {
}
