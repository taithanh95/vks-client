import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../../../../../../service/notification.service';
import {ConstantService} from '../../../../../../../service/constant.service';
import {Constant} from '../../../../../../../shared/constants/constant.class';
import {SppViolantion} from '../../../../../model/spp-violantion';
import {DateChangeService} from '../../../../../../../service/date-change.service';

@Component({
  selector: 'app-hanh-vi-vi-pham',
  templateUrl: './hanh-vi-vi-pham.component.html',
  styleUrls: ['./hanh-vi-vi-pham.component.scss']
})
export class HanhViViPhamComponent implements OnInit {
  i = 1;
  isVisible: boolean;
  collapse = true;
  @Input() modalType = 'create';
  @Input() listOfData: SppViolantion[] = [];
  @Output() submitData: EventEmitter<SppViolantion[]> = new EventEmitter<SppViolantion[]>();
  sppViolantion: SppViolantion = {processing: null, contentViolations: null, stage: 'G6'};
  loading = false;
  fieldsetDisabled = false;

  constructor(private notificationService: NotificationService,
              private constantService: ConstantService,
              private dateChangeService: DateChangeService) {
  }

  ngOnInit(): void {
    this.initForm();
    this.loadDataFromServer();
  }

  initForm(): void {
    // To do
  }

  loadDataFromServer(): void {
    // To do
  }

  toggleCollapse(): void {
    this.collapse = !this.collapse;
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onOpenModal(data?: SppViolantion, type?: string): void {
    console.log(data);
    if (data) {
      this.fieldsetDisabled = type === 'details';
      this.sppViolantion = data;
    } else {
      this.fieldsetDisabled = false;
    }
    this.isVisible = true;
  }

  /*
   * Date
   */
  disabledInDate = (myDate: Date): boolean => {
    if (!myDate) {
      return false;
    }
    return myDate.getTime() > new Date().getTime();
  };

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onDateValueChange(event: Event): Date {
    const value = (event.target as HTMLInputElement).value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, `Sai định dạng ngày tháng ${Constant.DATE_FMT}.`);
        return;
      }
      const date: Date = this.dateChangeService.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        return;
      } else {
        return date;
      }
    }
  }

  onCancel(): void {
    this.isVisible = false;
  }

  onSubmit(): void {
    this.loading = true;
    if (!this.sppViolantion.dateOfViolation) {
      this.notificationService.showNotification(Constant.ERROR, 'Ngày vi phạm bắt buộc nhập');
      this.loading = false;
      return;
    }
    if (this.sppViolantion.index) {
      const findIndex = this.listOfData.findIndex(d => d.index === this.sppViolantion.index);
      this.listOfData[findIndex] = this.sppViolantion;
    } else {
      this.listOfData = [...this.listOfData, {
        index: this.i,
        typeOfViolations: this.sppViolantion.typeOfViolations,
        dateOfViolation: this.sppViolantion.dateOfViolation,
        contentViolations: this.sppViolantion.contentViolations,
        processing: this.sppViolantion.processing
      }];
      this.i++;
    }
    this.submitData.emit(this.listOfData);
    // reset dữ liệu
    this.sppViolantion = {processing: null, contentViolations: null, stage: 'G6'};
    this.isVisible = false;
    this.loading = false;
  }

  deleteRow(index: number): void {
    this.listOfData = this.listOfData.filter(d => d.index !== index);
    this.submitData.emit(this.listOfData);
  }
}
