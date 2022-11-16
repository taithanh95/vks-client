import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../../../../shared/constants/constant.class';
import {CategoriesService} from '../../../../service/categories.service';
import {NotificationService} from '../../../../service/notification.service';
import {SoThuLyService} from '../../../so-thu-ly/service/so-thu-ly.service';
import {ParsePipe} from 'ngx-moment';
import {DatePipe} from '@angular/common';
import {ViolationLaw} from '../model/violation-law';
import {ResponseBody} from '../../../so-thu-ly/model/response-body';
import * as moment from 'moment';
import {ViolationLegislationDocument} from '../model/violation-legislation-document';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {ViolationLegislationDocumentListComponent} from '../violation-legislation-document/violation-legislation-document-list/violation-legislation-document-list.component';
import {ViolationResult} from '../model/violation-result';
import {ViolationResultListComponent} from '../components/violation-result/violation-result-list/violation-result-list.component';

@Component({
  selector: 'app-violation-update',
  templateUrl: './violation-update.component.html',
  styleUrls: ['./violation-update.component.scss']
})
export class ViolationUpdateComponent implements OnInit, OnChanges, OnDestroy {
  @Input() violationId: number;
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isVisible: boolean
  myForm: FormGroup;
  isSpinning: boolean;
  lstPolices: any[];
  userInfo: any;
  violationLegislationDocumentList: ViolationLegislationDocument[] = [];
  violationResultLists: ViolationResult[] = [];
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  @ViewChild(ViolationLegislationDocumentListComponent, {static: false})
  violationLegislationDocumentListComponent: ViolationLegislationDocumentListComponent;

  @ViewChild(ViolationResultListComponent, {static: false})
  violationResultComponent: ViolationResultListComponent;
  confirmModalRef: NzModalRef<any>;
  unitsId: string;
  unitsName: string;

  constructor(private fb: FormBuilder,
              private categoriesService: CategoriesService,
              private notificationService: NotificationService,
              private soThuLyService: SoThuLyService,
              private parsePipe: ParsePipe,
              private datePipe: DatePipe,
              private modalService: NzModalService) {
  }

  convertStringToDateFromObject(): ViolationLegislationDocument[] {
    const data: ViolationLegislationDocument[] = this.violationLegislationDocumentList;
    if (data.length > 0) {
      if (data instanceof Array) {
        for (const obj of data) {
          obj.documentDate = obj.documentDate ? this.stringToDate(obj.documentDate) : null;
        }
      }
    }
    return data;
  }


  convertViolationResult(): ViolationResult[] {
    const data: ViolationResult[] = this.violationResultLists;
    if (data.length > 0) {
      if (data instanceof Array) {
        for (const obj of data) {
          obj.resultDate = obj.resultDate ? this.stringToDate(obj.resultDate) : null;
        }
      }
    }
    return data;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisible && this.isVisible) {
      if (this.violationId) {
        this.isSpinning = true;
        this.soThuLyService.postRequest(this.soThuLyService.SOTHULY_URL + 'violation/detail/', {id: this.violationId})
          .subscribe((resp: ResponseBody) => {
            if (resp.responseCode === '0000') {
              this.unitsId = resp.responseData.violatedUnitsId;
              this.unitsName = resp.responseData.violatedUnitsName;
              this.myForm.patchValue(
                {
                  ...resp.responseData,
                  violationDate: resp.responseData.violationDate ? this.stringToDate(resp.responseData.violationDate) : null,
                  resultDate: resp.responseData.resultDate ? this.stringToDate(resp.responseData.resultDate) : null,
                  violatedUnitsId: resp.responseData.violatedUnitsId + ' - ' + resp.responseData.violatedUnitsName
                });
              this.violationLegislationDocumentList = [
                ...resp.responseData.violationLegislationDocumentList
              ];
              this.violationResultLists = [
                ...resp.responseData.violationResultLists
              ];
              this.violationLegislationDocumentList = [...this.convertStringToDateFromObject()];
              this.violationResultLists = [...this.convertViolationResult()];
            } else {
              this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
            }
            this.isSpinning = false;
          }, error => {
            this.notificationService.showNotification(Constant.ERROR, error);
            this.isSpinning = false;
          });
      }
    }
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.myForm = this.fb.group({
      id: [{value: null, disabled: true}],
      violationDate: [null, [Validators.required]],
      violatedAgency: [{value: null, disabled: true}, [Validators.required]],
      violatedUnitsId: [{value: null, disabled: true}, [Validators.required]],
      violatedUnitsName: [null],
      sppId: [null],
      status: [1]
    });
  }

  handleCancel(): void {
    this.clearForm();
    this.closeChange.emit(false);
  }

  convertDateInViolationLegislationDocument(): ViolationLegislationDocument[] {
    let data: ViolationLegislationDocument[] = [];
    if (this.violationLegislationDocumentListComponent.getListOfData()) {
      data = JSON.parse(JSON.stringify(this.violationLegislationDocumentListComponent.getListOfData()));
      if (data instanceof Array) {
        for (const obj of data) {
          obj.documentDate = obj.documentDate ? this.dateToString(new Date(obj.documentDate)) : null;
        }
      }
    }
    return data;
  }

  convertDateInViolationResult(): ViolationResult[] {
    let data: ViolationResult[] = [];
    if (this.violationResultComponent.getListOfData()) {
      data = JSON.parse(JSON.stringify(this.violationResultComponent.getListOfData()));
      if (data instanceof Array) {
        for (const obj of data) {
          obj.resultDate = obj.resultDate ? this.dateToString(new Date(obj.resultDate)) : null;
        }
      }
    }
    return data;
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      for (const key in this.myForm.controls) {
        if (this.myForm.controls.hasOwnProperty(key)) {
          this.myForm.controls[key].markAsDirty();
          this.myForm.controls[key].updateValueAndValidity();
        }
      }
      this.notificationService.showNotification(Constant.ERROR, 'Vui lòng nhập các trường bắt buộc đánh dấu *');
      return;
    }
    const violationDate = this.convertTimeToBeginningOfTheDay(this.violationDate().value);
    if (violationDate.getTime() > new Date().getTime()) {
      this.notificationService.showNotification(Constant.ERROR,
        `Ngày vi phạm không lớn hơn ngày hiện tại: ${this.dateToString(new Date())}`);
      this.violationDate().setValue(null);
      return;
    }
    this.showConfirm();
  }

  showConfirm(): void {
    this.isSpinning = true;
    this.confirmModalRef = this.modalService.create({
      nzTitle: this.confirmHeaderTemplate,
      nzContent: this.confirmTemplate,
      nzClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: 'Có', onClick: () => {
            this.saveData(this.myForm.getRawValue());
            this.confirmModalRef.close();
          }
        },
        {
          label: 'Không', onClick: () => {
            this.confirmModalRef.close();
          }
        }
      ]
    });
  }

  saveData(model: ViolationLaw) {
    const request = {
      ...model,
      violationDate: this.dateToString(model.violationDate),
      sppId: this.userInfo.sppid,
      violatedUnitsId: this.unitsId,
      violatedUnitsName: this.unitsName,
      violationLegislationDocumentList: this.convertDateInViolationLegislationDocument(),
      violationResultLists: this.convertDateInViolationResult()
    }
    setTimeout(() => {
      this.soThuLyService.postRequest(this.soThuLyService.SOTHULY_URL + 'violation/update/', request)
        .subscribe((resp: ResponseBody) => {
          if (resp.responseCode === '0000') {
            this.notificationService.showNotification(Constant.SUCCESS, 'Lưu thành công!');
            this.clearForm();
          } else {
            this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
          }
          this.closeChange.emit(false);
          this.isSpinning = false;
        }, error => {
          this.notificationService.showNotification(Constant.ERROR, error);
          this.closeChange.emit(false);
          this.isSpinning = false;
        });
    }, 500);
  }

  /*
   * Form element & validate
   */
  violatedAgencyChange(value: string) {
    switch (value) {
      case '02':
        this.categoriesService.getPoliceSelect({sppCode: value}).subscribe(res => {
          this.lstPolices = res.datas;
        });
        break;
    }
  }

  clearForm(): void {
    this.myForm.reset();
  }

  violatedAgency(): AbstractControl {
    return this.myForm.get('violatedAgency');
  }

  violatedUnitsId(): AbstractControl {
    return this.myForm.get('violatedUnitsId');
  }

  violationDate(): AbstractControl {
    return this.myForm.get('violationDate');
  }

  /*
   * Date
   */
  disabledViolationDate = (violationDate: Date): boolean => {
    if (!violationDate) {
      return false;
    }
    return violationDate.getTime() > new Date().getTime();
  };

  convertTimeToBeginningOfTheDay(date: Date | string): Date {
    if (date instanceof Date) {
      date.setHours(0, 0, 0, 0);
    } else {
      date = this.stringToDate(date);
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

  stringToDate(date: string | Date): Date {
    return this.parsePipe.transform(date, 'DD/MM/YYYY').toDate();
  }

  stringToDateWithFormat(inputString: string | Date, format: string): Date {
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

  onDataChange(listOfItems: ViolationLegislationDocument[]) {
    this.violationLegislationDocumentList = listOfItems;
  }

  onViolationResultDataChange(listOfItems: ViolationResult[]) {
    this.violationResultLists = listOfItems;
  }

  ngOnDestroy(): void {
    console.log('onDestroy');
  }
}
