import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe, DatePipe} from '@angular/common';

import {CompensationsManagementRoutingModule} from './compensations-management-routing.module';
import {CompensationsManagementComponent} from './compensations-management.component';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzPipesModule} from 'ng-zorro-antd/pipes';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {TranslateModule} from '@ngx-translate/core';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {CompensationModalComponent} from './compensation-modal/compensation-modal.component';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {ParsePipe} from 'ngx-moment';
import {CompensationDocumentComponent} from './compensation-document/compensation-document.component';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {SharedModule} from '../../../shared/shared.module';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {CompensationListComponent} from './compensation-info/compensation-list/compensation-list.component';
import {CompensationDetailComponent} from './compensation-info/compensation-detail/compensation-detail.component';
import {CookieService} from 'ngx-cookie-service';
import {CompensationDamagesListComponent} from './compensation-damage/compensation-damages-list/compensation-damages-list.component';
import {CompensationDamagesDetailComponent} from './compensation-damage/compensation-damages-detail/compensation-damages-detail.component';


@NgModule({
  declarations: [
    CompensationsManagementComponent,
    CompensationModalComponent,
    CompensationDocumentComponent,
    CompensationListComponent,
    CompensationDetailComponent,
    CompensationDamagesListComponent,
    CompensationDamagesDetailComponent],
  imports: [
    CommonModule,
    CompensationsManagementRoutingModule,
    NzFormModule,
    NzIconModule,
    ReactiveFormsModule,
    NzInputModule,
    NzDatePickerModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzToolTipModule,
    NzPipesModule,
    NzPaginationModule,
    NzEmptyModule,
    TranslateModule,
    NzSelectModule,
    NzModalModule,
    NzSpinModule,
    NzCheckboxModule,
    SharedModule,
    NzAutocompleteModule
  ], providers: [
    ParsePipe,
    DatePipe,
    CurrencyPipe,
    CookieService
  ]
})
export class CompensationsManagementModule {
}
