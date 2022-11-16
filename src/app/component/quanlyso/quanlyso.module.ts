import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {QuanlysoRoutingModule} from './quanlyso-routing.module';
import {SearchViewComponent} from './search-view/search-view.component';
import {UpdateViewComponent} from './update-view/update-view.component';
import {SharedModule} from '../../shared/shared.module';
import {ReportComponent} from "./category/report/report.component";
import {CreateReportComponent} from './category/report/create-report/create-report.component';
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {ThiHanhAnModule} from "../thi-hanh-an/thi-hanh-an.module";
import {GeneralService} from '../../service/general-service';
import {CategoriesService} from '../../service/categories.service';
import {DateChangeService} from '../../service/date-change.service';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';


@NgModule({
  declarations: [
    SearchViewComponent,
    UpdateViewComponent,
    ReportComponent,
    CreateReportComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    QuanlysoRoutingModule,
    NzPageHeaderModule,
    NzPipesModule,
    NzToolTipModule,
    NzEmptyModule,
    NzAutocompleteModule, 
    ThiHanhAnModule
  ],
  providers: [GeneralService, CategoriesService, DatePipe, DateChangeService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuanlysoModule {
}
