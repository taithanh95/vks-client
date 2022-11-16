import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportCaseinfoComponent } from './report-caseinfo/report-caseinfo.component';
import { SharedModule } from '../../shared/shared.module';
import { GeneralService } from '../../service/general-service';


@NgModule({
  declarations: [ReportCaseinfoComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule
  ],
  providers: [
    GeneralService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportModule { }
