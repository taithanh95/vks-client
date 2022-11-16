import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {DateFormatPipe} from './pipe/format-date.pipe';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {NzTagModule} from 'ng-zorro-antd/tag';

import {NzNotificationModule} from 'ng-zorro-antd/notification';
import {NotificationService} from '../service/notification.service';
import {I18nModule} from '../i18n/i18n.module';
import {SelectLanguageComponent} from './component/select-language/select-language.component';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzResultModule} from 'ng-zorro-antd/result';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {CurrencyFormatPipe} from './pipe/currency-format.pipe';
import {ImageFormatPipe} from './pipe/image-format.pipe';
import {OrderStatusFormatPipe} from './pipe/order-status-format.pipe';
import {FullNameFormatPipe} from './pipe/fullname-format.pipe';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {FocusInvalidDirective} from './directive/focus-invalid.directive';
import {IsNumberDirective} from './directive/is-number.directive';
import {ValueToDisplayTextPipe} from './pipe/value-to-display-text.pipe';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {RemoveSpecialCharactersDirective} from './directive/remove-special-characters.directive';
import {NumbericDirective} from './directive/numberic.directive';
import {AppTitleCaseDirective} from './directive/app-title-case.directive';
import {CategoriesService} from '../service/categories.service';
import {DownloadFileDirective} from './directive/download-file.directive';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import {CookieService} from 'ngx-cookie-service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import {NumberFormatPipe} from "./pipe/number-format.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzTableModule,
    NzPaginationModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzModalModule,
    NzIconModule,
    NzLayoutModule,
    ScrollingModule,
    DragDropModule,
    NzCollapseModule,
    NzNotificationModule,
    I18nModule,
    NzFormModule,
    NzResultModule,
    NzTagModule,
    NzDropDownModule,
    NzDatePickerModule,
    ScrollingModule,
    DragDropModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzTableModule,
    NzPaginationModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzModalModule,
    NzIconModule,
    NzLayoutModule,
    ScrollingModule,
    DragDropModule,
    NzCollapseModule,
    NzNotificationModule,
    I18nModule,
    NzFormModule,
    NzResultModule,
    NzTagModule,
    NzDropDownModule,
    NzDatePickerModule,
    ScrollingModule,
    DragDropModule,
    NzRadioModule,
    NzGridModule,
    NzToolTipModule,
    NzAutocompleteModule,
    NzCheckboxModule,
    NzInputNumberModule,
    NzRadioModule,
    NgxMaskModule,
    NzSpinModule,
    NzTreeViewModule
  ],
  exports: [
    DateFormatPipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzTableModule,
    NzPaginationModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzModalModule,
    NzIconModule,
    NzCollapseModule,
    NzNotificationModule,
    I18nModule,
    SelectLanguageComponent,
    NzFormModule,
    NzResultModule,
    NzTagModule,
    NzDropDownModule,
    NzDatePickerModule,
    ScrollingModule,
    DragDropModule,
    CurrencyFormatPipe,
    ImageFormatPipe,
    FullNameFormatPipe,
    NumberFormatPipe,
    OrderStatusFormatPipe,
    NzCheckboxModule,
    NzInputNumberModule,
    NzRadioModule,
    FocusInvalidDirective,
    AppTitleCaseDirective,
    IsNumberDirective,
    ValueToDisplayTextPipe,
    RemoveSpecialCharactersDirective,
    NumbericDirective,
    DownloadFileDirective,
    ValueToDisplayTextPipe,
    NzPopconfirmModule,
    NgxMaskModule,
    NzSpinModule,
    NzTreeViewModule
  ],
  declarations: [
    DateFormatPipe,
    SelectLanguageComponent,
    CurrencyFormatPipe,
    ImageFormatPipe,
    FullNameFormatPipe,
    NumberFormatPipe,
    OrderStatusFormatPipe,
    FocusInvalidDirective,
    DownloadFileDirective,
    IsNumberDirective,
    ValueToDisplayTextPipe,
    RemoveSpecialCharactersDirective,
    NumbericDirective,
    AppTitleCaseDirective
  ],
  providers: [NotificationService, NzMessageService, CategoriesService, CookieService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
}
