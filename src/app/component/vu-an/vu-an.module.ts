import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { VuAnRoutingModule } from './vu-an-routing.module';
import { DateChangeService } from '../../service/date-change.service';
import { CookieService } from 'ngx-cookie-service';
import { CategoriesService } from '../../service/categories.service';
import { GeneralService } from '../../service/general-service';
import { SppService } from '../../service/spp-service';
import { ApParamService } from '../../service/apparam.service';
import { SearchViewComponent } from './component/chuyen-an/search-view/search-view.component';
import { DetailComponent } from './component/chuyen-an/detail/detail.component';
import { UpdateComponent } from './component/chuyen-an/update/update.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { SearchViewReveiceComponent } from './component/nhan-an/search-view-reveice/search-view-reveice.component';
import { DetailReveiceComponent } from './component/nhan-an/detail-reveice/detail-reveice.component';
import { UpdateReveiceComponent } from './component/nhan-an/update-reveice/update-reveice.component';
import { DetailViewSplitComponent } from './component/tach-vu-an/detail-view-split/detail-view-split.component';
import { EditViewSplitComponent } from './component/tach-vu-an/edit-view-split/edit-view-split.component';
import { SearchViewSplitComponent } from './component/tach-vu-an/search-view-split/search-view-split.component';
import { SearchDialogsComponent } from './component/tach-vu-an/search-dialogs/search-dialogs.component';
import {SearchTransferCaseComponent} from "./component/chuyen-an-theo-yeu-cau/search-transfer-case/search-transfer-case.component";
import { DetailTransferCaseComponent } from './component/chuyen-an-theo-yeu-cau/detail-transfer-case/detail-transfer-case.component';
import { SearchViewJoinComponent } from './component/nhap-vu-an/search-view-join/search-view-join.component';
import { EditViewJoinComponent } from './component/nhap-vu-an/edit-view-join/edit-view-join.component';
import { DetailViewJoinComponent } from './component/nhap-vu-an/detail-view-join/detail-view-join.component';
import { SearchCaseViewJoinComponent } from './component/nhap-vu-an/search-case-view-join/search-case-view-join.component';
import {StringService} from "../../common/util/string.service";

@NgModule({
  declarations: [
    SearchViewComponent,
    DetailComponent,
    UpdateComponent,
    SearchViewReveiceComponent,
    DetailReveiceComponent,
    UpdateReveiceComponent,
    DetailViewSplitComponent,
    EditViewSplitComponent,
    SearchViewSplitComponent,
    SearchDialogsComponent,
    SearchTransferCaseComponent,
    DetailTransferCaseComponent,
    SearchViewJoinComponent,
    EditViewJoinComponent,
    DetailViewJoinComponent,
    SearchCaseViewJoinComponent
  ],
  imports: [
    CommonModule,
    VuAnRoutingModule,
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
  providers: [
    GeneralService,
    SppService,
    CategoriesService,
    TitleCasePipe,
    ApParamService,
    CookieService,
    DateChangeService,
    DatePipe,
    CurrencyPipe,
    StringService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VuAnModule { }
