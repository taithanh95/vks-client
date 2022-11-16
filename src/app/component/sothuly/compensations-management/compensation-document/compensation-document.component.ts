import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../shared/constants/constant.class';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoriesService} from '../../../../service/categories.service';
import {NotificationService} from '../../../../service/notification.service';
import {SoThuLyService} from '../../../so-thu-ly/service/so-thu-ly.service';
import {ParsePipe} from 'ngx-moment';
import {DatePipe} from '@angular/common';
import * as moment from 'moment';
import {CompensationDocument} from '../model/compensation-document';
import {Compensation} from '../model/compensation';

@Component({
  selector: 'app-compensation-document',
  templateUrl: './compensation-document.component.html',
  styleUrls: ['./compensation-document.component.scss']
})
export class CompensationDocumentComponent implements OnInit, OnChanges, OnDestroy {
  @Output() closeChange: EventEmitter<CompensationDocument[]> = new EventEmitter<CompensationDocument[]>();
  @Input() isVisible: boolean
  @Input() popupMode: ComponentMode = ComponentMode.CREATE;
  @Input() selectedItem: Compensation;
  @Input() listOfData: CompensationDocument[] = [];
  confirmModalRef: NzModalRef<any>;
  userInfo: any;
  selectedSpp: any;
  
  myForm: FormGroup = this.fb.group({
    id: [{value: null, disabled: true}],
    compensationId: [null],
    documentName: [null, [Validators.required]],
    deadlines: [null, [Validators.required]],
    finish: [null],
    note: [null],
    status: [GeneralModelStatus.ACTIVE]
  });

  isSpinning: boolean;
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  arrCollapse = [true, true, true, true, true, true, true]
  indexOfData = -1;
  listOfDeletedData: CompensationDocument[] = [];
  loading: boolean;
  pageSize: number[] = [5, 10, 15];
  popupModeEnum = ComponentMode;

  constructor(private fb: FormBuilder,
              private categoriesService: CategoriesService,
              private notificationService: NotificationService,
              private soThuLyService: SoThuLyService,
              private parsePipe: ParsePipe,
              private datePipe: DatePipe,
              private modalService: NzModalService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisible && this.isVisible) {
      if (this.popupMode === ComponentMode.VIEW) {
        this.myForm.disable();
      }
    }
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.selectedSpp = JSON.parse(localStorage.getItem(Constant.SPP));
  }

  ngOnDestroy(): void {
    console.log('onDestroy');
  }

  handleCancel(): void {
    this.clearForm();
    this.closeChange.emit([...this.listOfData, ...this.listOfDeletedData]);
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
    this.showConfirmSave();
  }

  showConfirmSave(): void {
    this.isSpinning = true;
    this.confirmModalRef = this.modalService.create({
      nzTitle: this.confirmHeaderTemplate,
      nzContent: this.confirmTemplate,
      nzClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: 'Có', onClick: () => {
            this.saveData(this.myForm.value);
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

  saveData(model: CompensationDocument) {
    console.log(this.indexOfData);
    if (this.indexOfData !== -1) {
      this.listOfData[this.indexOfData] = model;
      this.listOfData = [...this.listOfData];
      this.indexOfData = -1;
    } else {
      this.listOfData = [...this.listOfData, model];
    }
    this.clearForm();
  }

  /*
   * Form element & validate
   */

  clearForm(): void {
    this.myForm.reset();
    this.myForm.get("status").setValue(GeneralModelStatus.ACTIVE);
  }

  /*
   * Date
   */
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

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  onEdit(i: number) {
    this.indexOfData = i;
    this.myForm.patchValue(this.listOfData[i]);
  }

  handleDataDeleted(i: number) {
    const item = this.listOfData.splice(i, 1)[0];
    this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công!');
    this.listOfData = [...this.listOfData];
    if (item && item.id) {
      item.status = GeneralModelStatus.INACTIVE;
      this.listOfDeletedData.push(item);
    }
  }
}
