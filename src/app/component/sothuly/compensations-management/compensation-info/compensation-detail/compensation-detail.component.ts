import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ComponentMode, Constant} from '../../../../../shared/constants/constant.class';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {CompensationDetail} from '../../model/compensation-detail';
import * as moment from 'moment';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {NotificationService} from '../../../../../service/notification.service';
import { SoThuLyService } from 'src/app/component/so-thu-ly/service/so-thu-ly.service';
import { CookieService } from 'ngx-cookie-service';
import { ResponseBody } from 'src/app/component/so-thu-ly/model/response-body';
import { Spp } from 'src/app/component/so-thu-ly/model/so-thu-ly.model';

export function amountValidator(isErr: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return isErr ? {wrongAmount: {value: control.value}} : null;
  };
}

@Component({
  selector: 'app-compensation-detail',
  templateUrl: './compensation-detail.component.html',
  styleUrls: ['./compensation-detail.component.scss']
})
export class CompensationDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Output() saveChange: EventEmitter<CompensationDetail> = new EventEmitter<CompensationDetail>();
  @Input() compensationDetail: CompensationDetail;
  @Input() compensationId: number;
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isVisible: boolean
  @Input() popupMode: ComponentMode = ComponentMode.CREATE;
  confirmModalRef: NzModalRef<any>;
  myForm: FormGroup;
  isSpinning: boolean;
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  indexOfData = -1;
  listOfData: CompensationDetail[] = [];
  listSpp: Spp[] = [];
  loading: boolean;
  pageSize: number[] = [5, 10, 15];
  popupModeEnum = ComponentMode;
  compensationAmountErrorMsg: string;

  constructor(private fb: FormBuilder,
              private datePipe: DatePipe,
              private currencyPipe: CurrencyPipe,
              private notificationService: NotificationService,
              private soThuLyService: SoThuLyService,
              private cookieService: CookieService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisible && this.isVisible) {
      this.myForm.reset();
      if (this.compensationId) {
        this.myForm.get('compensationId').setValue(this.compensationId);
      }
      if (this.compensationDetail) {
        switch (this.popupMode) {
          case ComponentMode.VIEW:
          case ComponentMode.VIEW_FROM_PARENT:
            this.myForm.disable();
            this.myForm.patchValue({
              ...this.compensationDetail
            });
            break;
          case ComponentMode.UPDATE:
            this.myForm.enable();
            this.myForm.patchValue({
              ...this.compensationDetail
            });
            break;
          case ComponentMode.CREATE:
            this.myForm.enable();
            break;
        }
      } else {
        this.myForm.enable();
      }
    }
  }

  ngOnInit(): void {
    this.getVienKiemSatByUsername();
    this.myForm = this.fb.group({
      id: [{value: null, disabled: true}],
      compensationId: [null],
      documentaryNumber: [null],
      documentaryDate: [null],
      financeNumber: [null],
      financeDate: [null],
      compensationEnforceDate: [null],
      restoreHonorDate: [null],
      compensationAmountTemp: [null],
      compensationAmount: [null],
      note: [null],
      sppid: [null],
      status: [null]
    });
  }

  ngOnDestroy(): void {
    console.log('CompensationDetailComponent.onDestroy');
  }

  handleCancel(): void {
    console.log('CompensationDetailComponent.handleCancel click');
    this.clearForm();
    this.closeChange.emit(false);
  }

  handleOk(data: CompensationDetail): void {
    const compensationAmount: number = this.compensationAmount.value;
    const compensationAmountTemp: number = this.compensationAmountTemp.value;
    if (compensationAmount - compensationAmountTemp < 0) {
      this.compensationAmountErrorMsg = `Số tiền phải bồi hoàn phải lớn hơn hoặc bằng Số tiền tạm bồi thường`;
      this.notificationService.showNotification(Constant.ERROR, this.compensationAmountErrorMsg);
      this.compensationAmount.setValue(null);
      this.compensationAmount.setValidators([amountValidator(true)]);
      this.compensationAmount.updateValueAndValidity();
      return;
    } else {
      this.compensationAmount.setValidators(null);
      this.compensationAmount.updateValueAndValidity();
    }
    this.clearForm();
    this.saveChange.emit({
      ...data,
      compensationAmount,
      compensationAmountTemp
    });
  }

  get compensationAmount(): AbstractControl {
    return this.myForm.get('compensationAmount');
  }

  get compensationAmountTemp(): AbstractControl {
    return this.myForm.get('compensationAmountTemp');
  }

  getVienKiemSatByUsername(): void {
    this.soThuLyService.postRequest(this.soThuLyService.MANAGE_URL + 'spp/findByUsername/'
      , {
        username: this.cookieService.get(Constant.USERNAME)
      }).subscribe((resp: ResponseBody) => {
      if (resp.responseCode === '0000') {
        this.listSpp = resp.responseData;
      } else {
        this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
      }
    }, err => {
      this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
    });
  }

  /*
   * Form element & validate
   */
  clearForm(): void {
    console.log('CompensationDetailComponent.clearForm');
    this.myForm.reset();
  }

  onEdit(i: number) {
    console.log('CompensationDetailComponent.onEdit click');
    this.indexOfData = i;
    this.myForm.patchValue(this.listOfData[i]);
  }

  convertTimeToBeginningOfTheDay(date: Date | string): Date {
    if (date instanceof Date) {
      date.setHours(0, 0, 0, 0);
    } else {
      date = this.stringToDateWithFormat(date, 'dd/MM/yyyy');
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }


  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  dateToString(date: Date | string): string {
    if (date instanceof Date) {
      return this.datePipe.transform(date, 'dd/MM/yyyy');
    } else {
      return this.datePipe.transform(this.convertTimeToBeginningOfTheDay(date), 'dd/MM/yyyy')
    }
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  onDateValueChange(event: any, formControl: AbstractControl): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        formControl.setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        formControl.setValue(null);
        return;
      } else {
        formControl.setValue(date);
      }
    }
  }

  // formatCurrency(e: Event, formControl: AbstractControl) {
  //   const value = this.removeCurrencyPipeFormat((e.target as HTMLInputElement).value);
  //   formControl.setValue(this.currencyPipe.transform(value, 'VND', true, '1.0-0', 'vi-VN'));
  // }

  // removeCurrencyPipeFormat(formatNumber: any): number {
  //   return formatNumber ? formatNumber.replace(/[\s₫.]/g, '') : null;
  // }
}
