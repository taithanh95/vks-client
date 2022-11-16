import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../shared/constants/constant.class';
import {ViolationLegislationDocument} from '../../model/violation-legislation-document';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {NotificationService} from '../../../../../service/notification.service';
import {SoThuLyService} from '../../../../so-thu-ly/service/so-thu-ly.service';
import {ParsePipe} from 'ngx-moment';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-violation-legislation-document-detail',
  templateUrl: './violation-legislation-document-detail.component.html',
  styleUrls: ['./violation-legislation-document-detail.component.scss']
})
export class ViolationLegislationDocumentDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveChange: EventEmitter<ViolationLegislationDocument> = new EventEmitter<ViolationLegislationDocument>();
  @Input() popupMode: ComponentMode = ComponentMode.CREATE;
  @Input() isVisible: boolean;
  @Input() violationLegislationDocument: ViolationLegislationDocument;
  @Input() violationId: number;
  popupModeEnum = ComponentMode;
  isSpinning: boolean;

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
      if (this.violationId) {
        this.myForm.get('violationLawId').setValue(this.violationId);
      }
      if (this.violationLegislationDocument) {
        switch (this.popupMode) {
          case ComponentMode.VIEW:
          case ComponentMode.VIEW_FROM_PARENT:
            this.myForm.disable();
            this.myForm.patchValue({
              ...this.violationLegislationDocument
            });
            break;
          case ComponentMode.UPDATE:
            this.myForm.enable();
            this.myForm.patchValue({
              ...this.violationLegislationDocument
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
    this.myForm = this.fb.group({
      id: [null],
      violationLawId: [null],
      documentCode: [null, [Validators.required]],
      documentNumber: [null, [Validators.required]],
      documentDate: [null, Validators.required],
      content: [null, [Validators.maxLength(2000)]]
    })
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

  handleCancel(): void {
    this.clearForm();
    this.closeChange.emit(false);
  }

  handleOk(data: ViolationLegislationDocument): void {
    if (this.myForm.invalid) {
      Object.keys(this.myForm.controls).forEach(key => {
        this.myForm.get(key).markAsDirty();
        this.myForm.get(key).updateValueAndValidity();
      });
      this.notificationService.showNotification(Constant.ERROR, 'Vui lòng nhập các trường bắt buộc đánh dấu *');
      return;
    }
    const documentDate = this.convertTimeToBeginningOfTheDay(data.documentDate);
    if (documentDate.getTime() > new Date().getTime()) {
      this.notificationService.showNotification(Constant.ERROR, `Ngày ban hành không lớn hơn ngày hiện tại: ${this.dateToString(new Date())}`);
      this.documentDate().setValue(null);
      return;
    }
    data.status = GeneralModelStatus.ACTIVE;
    this.saveChange.emit(data);
  }

  /*
   * Form
   */
  documentDate(): AbstractControl {
    return this.myForm.get('documentDate');
  }

  clearForm(): void {
    this.myForm.reset();
  }

  /*
   * Date
   */
  disabledDocumentDate = (documentDate: Date): boolean => {
    if (!documentDate) {
      return false;
    }
    return documentDate.getTime() > new Date().getTime();
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
}
