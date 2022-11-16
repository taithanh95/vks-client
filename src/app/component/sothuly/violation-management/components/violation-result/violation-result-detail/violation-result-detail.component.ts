import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../../shared/constants/constant.class';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../../../../service/notification.service';
import {SoThuLyService} from '../../../../../so-thu-ly/service/so-thu-ly.service';
import {ParsePipe} from 'ngx-moment';
import {DatePipe} from '@angular/common';
import * as moment from 'moment';
import {ViolationResult} from '../../../model/violation-result';
import {ViolationLaw} from '../../../model/violation-law';

@Component({
  selector: 'app-violation-result-detail',
  templateUrl: './violation-result-detail.component.html',
  styleUrls: ['./violation-result-detail.component.scss']
})
export class ViolationResultDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveChange: EventEmitter<ViolationResult> = new EventEmitter<ViolationResult>();
  @Input() popupMode: ComponentMode = ComponentMode.CREATE;
  @Input() isVisible: boolean;
  @Input() violationLaw: ViolationLaw;
  @Input() violationResult: ViolationResult;
  popupModeEnum = ComponentMode;
  isSpinning: boolean;
  resultCode = [];
  isVisibleCreate: boolean;

  myForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private notificationService: NotificationService,
              private soThuLyService: SoThuLyService,
              private parsePipe: ParsePipe,
              private datePipe: DatePipe) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisible && this.isVisible) {
      this.myForm.reset();
      if (this.violationLaw.id) {
        // Cho biết đang sử hay thêm mới dữ liệu
        this.myForm.get('violationLawId').setValue(this.violationLaw.id);
      }
      if (this.violationResult) {
        switch (this.popupMode) {
          case ComponentMode.VIEW:
          case ComponentMode.VIEW_FROM_PARENT:
            this.myForm.disable();
            this.myForm.patchValue({
              ...this.violationResult
            });
            if (this.violationResult.chapNhan) {
              this.resultCode.push('CHAP_NHAN');
            }
            if (this.violationResult.khongChapNhan) {
              this.resultCode.push('KHONG_CHAP_NHAN');
            }
            break;
          case ComponentMode.UPDATE:
            this.myForm.enable();
            this.myForm.patchValue({
              ...this.violationResult
            });
            if (this.violationResult.chapNhan) {
              this.resultCode.push('CHAP_NHAN');
            }
            if (this.violationResult.khongChapNhan) {
              this.resultCode.push('KHONG_CHAP_NHAN');
            }
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
    this.myForm = this.fb.group({
      id: [{value: null, disabled: true}],
      violationLawId: [null],
      chapNhan: [null],
      chapNhanMotPhan: [null],
      khongChapNhan: [null],
      khongChapNhanMotPhan: [null],
      resultNumber: [1],
      resultDate: [new Date(), [this.resultDateValidator]],
      resultContent: ['Nội dung kết quả', [Validators.maxLength(2000)]],
      note: ['Ghi chú', [Validators.maxLength(500)]],
      status: [1]
    });
  }

  checkKQ(kq: string): boolean {
    return this.resultCode.length > 0 ? this.resultCode.includes(kq) : false;
  }

  ngOnDestroy(): void {
    this.clearForm();
  }

  handleCancel(): void {
    this.clearForm();
    this.closeChange.emit(false);
  }

  handleOk(data: ViolationResult): void {
    if (this.myForm.invalid) {
      Object.keys(this.myForm.controls).forEach(key => {
        this.myForm.get(key).markAsDirty();
        this.myForm.get(key).updateValueAndValidity();
      });
      this.notificationService.showNotification(Constant.ERROR, 'Vui lòng nhập các trường bắt buộc đánh dấu *');
      return;
    }
    const resultDate = this.convertTimeToBeginningOfTheDay(data.resultDate);
    if (resultDate.getTime() > new Date().getTime()) {
      this.notificationService.showNotification(Constant.ERROR, `Ngày ra kết quả không lớn hơn ngày hiện tại: ${this.dateToString(new Date())}`);
      this.resultDate().setValue(null);
      return;
    }
    data.status = GeneralModelStatus.ACTIVE;
    if (this.checkKQ('CHAP_NHAN')) {
      data.chapNhan = 'Y';
    } else {
      // this.resultCode.filter(item => item !== 'CHAP_NHAN');
      data.chapNhan = null;
      data.chapNhanMotPhan = null;
    }
    if (this.checkKQ('KHONG_CHAP_NHAN')) {
      data.khongChapNhan = 'Y';
    } else {
      // this.resultCode.filter(item => item !== 'KHONG_CHAP_NHAN');
      data.khongChapNhan = null;
      data.khongChapNhanMotPhan = null;
    }
    data.chapNhanMotPhan = data.chapNhanMotPhan ? 'Y' : null;
    data.khongChapNhanMotPhan = data.khongChapNhanMotPhan ? 'Y' : null;
    this.saveChange.emit(data);
    this.clearForm();
  }

  /*
   * Form
   */
  resultDate(): AbstractControl {
    return this.myForm.get('resultDate');
  }

  clearForm(): void {
    this.resultCode = [];
    this.myForm.reset();
  }

  /*
   * Date
   */
  disabledResultDate = (resultDate: Date): boolean => {
    if (!resultDate) {
      return false;
    }
    return resultDate.getTime() > new Date().getTime();
  };

  convertTimeToBeginningOfTheDay(date: Date | string): Date {
    if (date instanceof Date) {
      date.setHours(0, 0, 0, 0);
    } else {
      date = this.stringToDateWithFormat(date, 'dd/MM/yyyy');
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  numberOnly(event: KeyboardEvent): boolean {
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

  resultDateValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) return {}

    const resultDate = (control.value) ? this.convertTimeToBeginningOfTheDay(control.value) : null;
    const violationDate = (this.violationLaw.violationDate) ? this.convertTimeToBeginningOfTheDay(this.violationLaw.violationDate) : null;
    if (resultDate && violationDate && (resultDate.getTime() < violationDate.getTime())) {
      return {error: true};
    }
    return {};
  };

  openModal(){
    this.isVisibleCreate = true;
  }

  closeModal($event: boolean){
    this.isVisibleCreate = $event;
  }

  submitResult(data){
    this.myForm.get('resultContent').setValue(data);
  }
}
