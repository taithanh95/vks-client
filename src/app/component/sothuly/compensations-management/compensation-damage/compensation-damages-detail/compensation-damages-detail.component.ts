import {DatePipe} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NotificationService} from '../../../../../service/notification.service';
import {ComponentMode, Constant} from '../../../../../shared/constants/constant.class';
import {CompensationDamage} from '../compensation-damages-list/compensation-damages-list.component';
import {StringService} from '../../../../../common/util/string.service';

@Component({
  selector: 'app-compensation-damages-detail',
  templateUrl: './compensation-damages-detail.component.html',
  styleUrls: ['./compensation-damages-detail.component.scss']
})
export class CompensationDamagesDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Output() saveChange: EventEmitter<CompensationDamage> = new EventEmitter<CompensationDamage>();
  @Input() ComponentDamage: CompensationDamage;
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
  listOfData: CompensationDamage[] = [];
  loading: boolean;
  pageSize: number[] = [5, 10, 15];
  popupModeEnum = ComponentMode;
  compensationAmountErrorMsg: string;

  constructor(private fb: FormBuilder,
              private datePipe: DatePipe,
              private notificationService: NotificationService,
              private stringService: StringService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('CompensationDetailComponent.ngOnChanges');
    if (changes.isVisible && this.isVisible) {
      this.myForm.reset();
      if (this.compensationId) {
        this.myForm.get('compensationId').setValue(this.compensationId);
      }
      if (this.ComponentDamage) {
        switch (this.popupMode) {
          case ComponentMode.VIEW:
          case ComponentMode.VIEW_FROM_PARENT:
            this.myForm.disable();
            this.myForm.patchValue({
              ...this.ComponentDamage
            });
            break;
          case ComponentMode.UPDATE:
            this.myForm.enable();
            this.myForm.patchValue({
              ...this.ComponentDamage
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
    console.log('CompensationDamagesDetailComponent.ngOnInit');
    this.myForm = this.fb.group({
      id: [{value: null, disabled: true}],
      compensationId: [null],
      damagesName: [null,[Validators.required]] ,
      damagesBirthday: [null],
      damagesAddress: [null],
      status: [null],
      damagesCccd: [null, [Validators.maxLength(12), Validators.minLength(9)]],
    });
  }

  ngOnDestroy(): void {
    console.log('CompensationDamagesDetailComponent.onDestroy');
  }

  handleCancel(): void {
    console.log('CompensationDamagesDetailComponent.handleCancel click');
    this.clearForm();
    this.closeChange.emit(false);
  }

  handleOk(data: CompensationDamage): void {
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
    this.clearForm();
    this.saveChange.emit({...data,damagesName: this.stringService.capitalize(data.damagesName) });
  }
  /*
   * Form element & validate
   */
  clearForm(): void {
    console.log('CompensationDamagesDetailComponent.clearForm');
    this.myForm.reset();
  }

  onEdit(i: number) {
    console.log('CompensationDamagesDetailComponent.onEdit click');
    this.indexOfData = i;
    this.myForm.patchValue(this.listOfData[i]);
  }

  /*
   * Date
   */
  disabledDate = (inputDate: Date): boolean => {
    if (!inputDate) {
      return false;
    }
    return inputDate.getTime() > new Date().getTime();
  };

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
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

  convertCccd() {
    const ex = this.myForm.get('damagesCccd').value;
    const newC = ex.replace(/[a-z]+/img,'');
    return this.myForm.get('damagesCccd').setValue(newC);
  }
}
