import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ViolationSearchComponent} from './violation-search/violation-search.component';
import {ViolationManagementRoutingModule} from './violation-management-routing.module';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {SothulyModule} from '../sothuly.module';
import {TranslateModule} from '@ngx-translate/core';
import {NzPipesModule} from 'ng-zorro-antd/pipes';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {ViolationCreateComponent} from './violation-create/violation-create.component';
import {ViolationUpdateComponent} from './violation-update/violation-update.component';
import {ViolationDetailsComponent} from './violation-details/violation-details.component';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {ParsePipe} from 'ngx-moment';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {SharedModule} from '../../../shared/shared.module';
import {DocumentCodePipe} from './pipe/document-code.pipe';
import {ViolationLegislationDocumentListComponent} from './violation-legislation-document/violation-legislation-document-list/violation-legislation-document-list.component';
import {ViolationLegislationDocumentDetailComponent} from './violation-legislation-document/violation-legislation-document-detail/violation-legislation-document-detail.component';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {CookieService} from 'ngx-cookie-service';
import { ViolationResultListComponent } from './components/violation-result/violation-result-list/violation-result-list.component';
import { ViolationResultDetailComponent } from './components/violation-result/violation-result-detail/violation-result-detail.component';
import { CreateResultComponent } from './components/violation-result/violation-result-detail/create-result/create-result.component';


@NgModule({
  declarations: [ViolationSearchComponent,
    ViolationCreateComponent,
    ViolationUpdateComponent,
    ViolationDetailsComponent,
    ViolationLegislationDocumentListComponent,
    ViolationLegislationDocumentDetailComponent,
    DocumentCodePipe,
    ViolationResultListComponent,
    ViolationResultDetailComponent,
    CreateResultComponent
  ],
    imports: [
        CommonModule,
        ViolationManagementRoutingModule,
        NzIconModule,
        FormsModule,
        NzDatePickerModule,
        NzGridModule,
        NzPageHeaderModule,
        NzButtonModule,
        NzTableModule,
        NzToolTipModule,
        NzEmptyModule,
        SothulyModule,
        TranslateModule,
        NzPipesModule,
        NzPaginationModule,
        ReactiveFormsModule,
        NzModalModule,
        NzSpinModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        NzPopconfirmModule,
        SharedModule,
        NzAutocompleteModule
    ], providers: [
    ParsePipe,
    DatePipe,
    CookieService
  ]
})
export class ViolationManagementModule {
}
