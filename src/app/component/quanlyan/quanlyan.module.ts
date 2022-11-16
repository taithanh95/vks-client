import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, DatePipe, TitleCasePipe} from '@angular/common';
import {SearchViewComponent} from './search-view/search-view.component';
import {GeneralService} from '../../service/general-service';
import {SharedModule} from '../../shared/shared.module';
import {QuanlyanRoutingModule} from './quanlyan-routing.module';
import {SppUpdateComponent} from './spp-update/spp-update.component';
import {SppDetailComponent} from './spp-detail/spp-detail.component';
import {SppService} from '../../service/spp-service';
import {FCaseComponent} from './spp-detail/f-case/f-case.component';
import {FCaselawComponent} from './spp-detail/f-caselaw/f-caselaw.component';
import {FRegisterComponent} from './spp-detail/f-register/f-register.component';
import {FReginsComponent} from './spp-detail/f-regins/f-regins.component';
import {FAccuComponent} from './spp-detail/f-accu/f-accu.component';
import {FDecisionCaseComponent} from './spp-detail/f-decision-case/f-decision-case.component';
import {FCentenceG1Component} from './spp-detail/f-centence-g1/f-centence-g1.component';
import {FSppspcpolComponent} from './spp-detail/f-sppspcpol/f-sppspcpol.component';
import {FCentenceG2Component} from './spp-detail/f-centence-g2/f-centence-g2.component';
import {FSppspcpolG2Component} from './spp-detail/f-sppspcpol-g2/f-sppspcpol-g2.component';
import {FCentenceComponent} from './spp-detail/f-centence/f-centence.component';
import {FAppealComponent} from './spp-detail/f-appeal/f-appeal.component';
import {FAgainstComponent} from './spp-detail/f-against/f-against.component';
import {DialogsModule} from './spp-detail/dialogs/dialogs.module';
import {CategoriesService} from '../../service/categories.service';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {MatInputModule} from '@angular/material/input';
import { StaticDialogComponent } from './spp-detail/sppcase/static-dialog/static-dialog.component';
import { ExhibitDialogComponent } from './spp-detail/sppcase/exhibit-dialog/exhibit-dialog.component';
import { HeroinDialogComponent } from './spp-detail/sppcase/heroin-dialog/heroin-dialog.component';
import { FVictimComponent } from './spp-detail/f-victim/f-victim.component';
import {ApParamService} from '../../service/apparam.service';
import { FSppDamagedComponent } from './spp-detail/f-spp-damaged/f-spp-damaged.component';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from 'src/app/service/date-change.service';
import { FReportComponent } from './spp-detail/f-report/f-report.component';
import {StringService} from '../../common/util/string.service';

@NgModule({
  declarations: [
    SearchViewComponent,
    SppUpdateComponent,
    SppDetailComponent,
    FCaseComponent,
    FCaselawComponent,
    FRegisterComponent,
    FReginsComponent,
    FAccuComponent,
    FDecisionCaseComponent,
    FCentenceG1Component,
    FSppspcpolComponent,
    FCentenceG2Component,
    FSppspcpolG2Component,
    FCentenceComponent,
    FAppealComponent,
    FAgainstComponent,
    StaticDialogComponent,
    ExhibitDialogComponent,
    HeroinDialogComponent,
    FVictimComponent,
    FSppDamagedComponent,
    FReportComponent
  ],
  imports: [
    DialogsModule,
    CommonModule,
    SharedModule,
    QuanlyanRoutingModule,
    NzTableModule,
    NzGridModule,
    NzDividerModule,
    NzAutocompleteModule,
    MatTooltipModule,
    NzToolTipModule,
    MatInputModule,
  ],
  providers: [GeneralService, SppService, CategoriesService, TitleCasePipe, ApParamService, CookieService, DatePipe, DateChangeService, StringService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuanlyanModule {
}
