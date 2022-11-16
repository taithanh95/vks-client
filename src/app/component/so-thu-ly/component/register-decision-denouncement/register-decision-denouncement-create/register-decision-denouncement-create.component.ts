import {Component, OnInit, ViewChild} from '@angular/core';
import {DenouncedPerson, Denouncement, Spp} from '../../../model/so-thu-ly.model';
import {RegisterDecision} from '../../../model/register-decision';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import {NotificationService} from '../../../../../service/notification.service';
import {DatePipe, Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ParsePipe} from 'ngx-moment';
import {ResponseBody} from '../../../model/response-body';
import {Constant} from '../../../../../shared/constants/constant.class';
import {SoThuLyService} from '../../../service/so-thu-ly.service';
import * as moment from 'moment';

@Component({
  selector: 'app-register-decision-denouncement-create',
  templateUrl: './register-decision-denouncement-create.component.html',
  styleUrls: ['./register-decision-denouncement-create.component.scss']
})
export class RegisterDecisionDenouncementCreateComponent implements OnInit {
  denouncement: Denouncement;
  denouncedPerson: DenouncedPerson[];
  listOfItems: RegisterDecision[] = [];
  selectedItem: RegisterDecision;
  listOfOption: Array<{ value: string; text: string }> = [];
  collapse = true;
  isVisible: boolean;
  isVisibleDeleteConfirm: boolean;
  isConfirmLoading = false;
  myForm!: FormGroup;
  confirmDeleteForm!: FormGroup;
  denouncementId!: number;
  sppCode!: string;
  spp!: Spp;
  account: any;
  loading = true;
  isDisable: boolean;
  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  @ViewChild('inDatePicker') inDatePicker!: NzDatePickerComponent;
  @ViewChild('decisionSelect') decisionSelect!: NzSelectComponent;

  constructor(
    private soThuLyService: SoThuLyService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private parsePipe: ParsePipe,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.denouncementId = +this.route.snapshot.paramMap.get('id');
    this.account = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.initForm();
    this.getDenouncement().then();

    this.getSpp().then((resp: ResponseBody) => {
      if (resp.responseCode === '0000') {
        this.spp = resp.responseData;
        this.sppCode = this.spp.isDePart === 'Y' ? this.spp.sppParent : this.spp.sppId;
        this.getListRegisterDecision().then();
      } else {
        this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
      }
    }).catch(err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi: ' + err.message));

    this.getDecision().then();
  }

  initForm() {
    this.myForm = this.fb.group({
      id: [null],
      stage: ['TBTG', [Validators.required]],
      issuesDate: [null, [Validators.required]],
      decisionCode: [null, [Validators.required]],
      decisionNumAuto: [null],
      fromDate: [null, [this.inDateValidator]],
      toDate: [null],
    });

    this.confirmDeleteForm = this.fb.group({
      id: [null],
      reason: [null, [Validators.required, Validators.maxLength(500)]]
    });
  }

  inDateValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) return {}

    const fromDate = (control.value) ? this.convertTimeToBeginningOfTheDay(control.value) : null;
    const inDate = (this.issuesDate().value) ? this.convertTimeToBeginningOfTheDay(this.issuesDate().value) : null;
    if (fromDate && inDate && (fromDate.getTime() < inDate.getTime())) {
      return {confirm: true, error: true};
    }
    return {};
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

  toggleCollapse() {
    this.collapse = !this.collapse;
  }

  /*
   * Các sự kiện button
   */

  goBack(): void {
    this.location.back();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.selectedItem = null;
    this.resetForm();
  }

  handleOk(model: RegisterDecision): void {
    Object.keys(this.myForm.controls).forEach(key => {
      this.myForm.get(key).markAsDirty();
      this.myForm.get(key).updateValueAndValidity();
    });
    if (this.myForm.invalid) return;
    model.fromDate = model.fromDate ? this.convertTimeToBeginningOfTheDay(model.fromDate) : null;
    model.toDate = model.toDate ? this.convertTimeToBeginningOfTheDay(model.toDate) : null;
    model.issuesDate = this.convertTimeToBeginningOfTheDay(model.issuesDate);

    if (model.fromDate && model.toDate && model.fromDate.getTime() > model.toDate.getTime()) {
      this.notificationService.showNotification(Constant.ERROR, 'Từ ngày phải nhỏ hơn hoặc bằng đến ngày');
      this.fromDatePicker.open();
      return;
    }

    if (model.issuesDate.getTime() > new Date().getTime()) {
      this.notificationService.showNotification(Constant.ERROR, `Yêu cầu ngày cấp lệnh nhỏ hơn hoặc bằng ngày ${this.dateToString(new Date())}`);
      this.issuesDate().setValue(null);
      return;
    }

    this.isConfirmLoading = true;
    setTimeout(() => {
      // Đặt Timeout để tránh người dùng click liên tục Submit
      const registerDecision: RegisterDecision = {
        id: model.id,
        stage: model.stage,
        decisionCode: model.decisionCode,
        decisionNum: model.decisionNumAuto,
        decisionNumAuto: model.decisionNumAuto,
        issuesDate: model.issuesDate ? this.dateToString(model.issuesDate) : null,
        toDate: model.toDate ? this.dateToString(model.toDate) : null,
        fromDate: model.fromDate ? this.dateToString(model.fromDate) : null,
        denouncementId: this.denouncement.id,
        sppCode: this.spp.sppId,
        type: 3,
        sppid: this.spp.sppId
      };
      if (registerDecision.id) { // Update Form
        // const issuesDateInObject: Date = this.convertTimeToBeginningOfTheDay(registerDecision.issuesDate);
        // let issuesDateNotErr = true;
        // this.listOfItems.forEach(value => {
        //   if (issuesDateNotErr) {
        //     const issuesDateInList = this.convertTimeToBeginningOfTheDay(value.issuesDate);
        //     if (value.id > registerDecision.id && issuesDateInObject.getTime() > issuesDateInList.getTime()) {
        //       this.notificationService.showNotification(Constant.ERROR, `Yêu cầu ngày cấp lệnh nhỏ hơn ngày ${this.dateToString(issuesDateInList)}`);
        //       this.isConfirmLoading = false;
        //       this.issuesDate().setValue(null);
        //       this.inDatePicker.open();
        //       issuesDateNotErr = false;
        //     }
        //     if (value.id < registerDecision.id && issuesDateInObject.getTime() < issuesDateInList.getTime()) {
        //       this.notificationService.showNotification(Constant.ERROR, `Yêu cầu ngày cấp lệnh lớn hơn ngày ${this.dateToString(issuesDateInList)}`);
        //       this.isConfirmLoading = false;
        //       this.issuesDate().setValue(null);
        //       this.inDatePicker.open();
        //       issuesDateNotErr = false;
        //     }
        //   }
        // });
        // if (issuesDateNotErr) {
          this.updateRegisterDecisionAccused(registerDecision);
        // }
      } else { // Create Form
        const issuesDateInObject: Date = this.convertTimeToBeginningOfTheDay(registerDecision.issuesDate);
        let ngayLonNhat: Date;
        const DSQuyetDinhDaCap: RegisterDecision[] = [];
        this.listOfItems.forEach(value => {
          const issuesDateInList = this.convertTimeToBeginningOfTheDay(value.issuesDate);
          if (issuesDateInObject.getTime() < issuesDateInList.getTime()) {
            // Lọc ra những QĐ có ngày cấp lớn hơn ngày QĐ đang cấp
            DSQuyetDinhDaCap.push(value);
          }
        });
        if (DSQuyetDinhDaCap.length > 0) {
          // Tìm ngày cấp lớn nhất
          ngayLonNhat = this.convertTimeToBeginningOfTheDay(DSQuyetDinhDaCap[0].issuesDate);
          DSQuyetDinhDaCap.forEach(value => {
            const issuesDate = this.convertTimeToBeginningOfTheDay(value.issuesDate);
            if (ngayLonNhat.getTime() < issuesDate.getTime()) {
              ngayLonNhat = issuesDate;
            }
          });
        }
        if (ngayLonNhat) {
          this.notificationService.showNotification(Constant.ERROR, `Yêu cầu ngày cấp lệnh lớn hơn ngày ${this.dateToString(ngayLonNhat)}`);
          this.isConfirmLoading = false;
          this.issuesDate().setValue(null);
          this.inDatePicker.open();
        } else {
          this.createRegisterDecisionAccused(registerDecision);
        }
      }
    }, 500);
  }

  showPopupCreate(): void {
    this.isVisible = true;
  }

  onInDateChange(value: Date): void {
    Promise.resolve().then(() => this.myForm.controls.fromDate.updateValueAndValidity());
    if (value) {
      if (this.selectedItem &&
        (this.convertTimeToBeginningOfTheDay(this.selectedItem.issuesDate).getTime() ===
          this.convertTimeToBeginningOfTheDay(this.issuesDate().value).getTime()
          || value.getFullYear() === new Date().getFullYear())
      ) {
        // this.decisionNum().setValue(this.selectedItem.decisionNum);
        this.decisionNumAuto().setValue(this.selectedItem.decisionNumAuto);
        this.getDecisionNum();
      } else {
        this.getDecisionNum();
      }
    } else {
      // this.decisionNum().setValue(null);
      this.decisionNumAuto().setValue(null);
    }
  }

  onDecisionChange(value: any): void {
    if (value) {
      if (this.selectedItem && this.selectedItem.decisionCode === this.decisionCode().value) {
        // this.decisionNum().setValue(this.selectedItem.decisionNum);
        this.decisionNumAuto().setValue(this.selectedItem.decisionNumAuto);
        this.getDecisionNum();
      } else {
        this.getDecisionNum();
      }
    } else {
      // this.decisionNum().setValue(null);
      this.decisionNumAuto().setValue(null);
    }
  }

  disabledIssueDate = (issueDateValue: Date): boolean => {
    if (!issueDateValue) {
      return false;
    }
    return issueDateValue.getTime() > new Date().getTime();
  };
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.fromDate().value) {
      return false;
    }
    return endValue.getTime() <= this.fromDate().value.getTime();
  };

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  onIssueDateValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        this.issuesDate().setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        this.issuesDate().setValue(null);
        return;
      } else {
        this.issuesDate().setValue(date);
      }
    }
  }

  onFromDateValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        this.fromDate().setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        this.fromDate().setValue(null);
        return;
      } else {
        this.fromDate().setValue(date);
      }
    }
  }

  onToDateValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        this.toDate().setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        this.toDate().setValue(null);
        return;
      } else {
        this.toDate().setValue(date);
      }
    }
  }

  /*
   * Liên quan đến Form
   */
  resetForm(): void {
    this.isConfirmLoading = false;
    this.isVisible = false;
    this.myForm.reset();
    this.stage().setValue('TBTG');
    // Thực hiện tải lại DS
    this.getListRegisterDecision();
  }

  id(): AbstractControl {
    return this.myForm.get('id');
  }

  stage(): AbstractControl {
    return this.myForm.get('stage');
  }

  issuesDate(): AbstractControl {
    return this.myForm.get('issuesDate');
  }

  decisionCode(): AbstractControl {
    return this.myForm.get('decisionCode');
  }

  fromDate(): AbstractControl {
    return this.myForm.get('fromDate');
  }

  toDate(): AbstractControl {
    return this.myForm.get('toDate');
  }
  //
  // decisionNum(): AbstractControl {
  //   return this.myForm.get('decisionNum');
  // }

  decisionNumAuto(): AbstractControl {
    return this.myForm.get('decisionNumAuto');
  }

  /*
   * Các phương thức call lên API
   */

  async getDenouncement(): Promise<void> {
    const resp: ResponseBody = await this.soThuLyService.postRequest(
      this.soThuLyService.SOTHULY_URL + 'denouncedDenouncement/detail/', {id: this.denouncementId}
    ).toPromise();
    if (resp.responseCode === '0000') {
      this.denouncement = resp.responseData;
      this.denouncedPerson = this.denouncement.denounceDenouncedPersonList;
    } else {
      this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
    }
  }

  stringToDate(date: string): Date {
    return this.parsePipe.transform(date, 'DD/MM/YYYY').toDate();
  }

  dateToString(date: Date | string): string {
    if (date instanceof Date) {
      return this.datePipe.transform(date, 'dd/MM/yyyy');
    } else {
      return this.datePipe.transform(this.convertTimeToBeginningOfTheDay(date), 'dd/MM/yyyy')
    }
  }

  onEdit(obj: RegisterDecision): void {
    this.myForm.patchValue({
      id: obj.id,
      stage: obj.stage,
      issuesDate: obj.issuesDate ? this.convertTimeToBeginningOfTheDay(obj.issuesDate) : null,
      decisionCode: obj.decisionCode,
      decisionNum: obj.decisionNum,
      decisionNumAuto: obj.decisionNumAuto,
      fromDate: obj.fromDate ? this.convertTimeToBeginningOfTheDay(obj.fromDate) : null,
      toDate: obj.toDate ? this.convertTimeToBeginningOfTheDay(obj.toDate) : null
    });
    this.selectedItem = this.myForm.value;
    this.isVisible = true;
    this.isDisable = true;
  }

  async getDecision() {
    const resp: ResponseBody = await this.soThuLyService.postRequest(
      this.soThuLyService.MANAGE_URL + 'decision/getListForDropbox/', {status: 'Y', applyFor: 'T'}
    ).toPromise();
    if (resp.responseCode === '0000') {
      const listOfOption: Array<{ value: string; text: string }> = [];
      resp.responseData.forEach(item => {
        listOfOption.push({
          value: item.deciId,
          text: item.name
        });
      });
      this.listOfOption = listOfOption;
    } else {
      this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
    }
  }

  async getSpp(): Promise<ResponseBody> {
    return await this.soThuLyService.postRequest(
      this.soThuLyService.MANAGE_URL + 'spp/findFirstByUsername/', {
        username: this.account.userid
      }).toPromise();
  }

  async getListRegisterDecision(): Promise<void> {
    this.loading = true;
    const resp: ResponseBody = await this.soThuLyService.postRequest(
      this.soThuLyService.SOTHULY_URL + 'registerDecision/getList/',
      {
        sppCode: this.sppCode,
        denouncementId: this.denouncementId,
        type: 3
      }).toPromise();
    this.loading = false;
    if (resp.responseCode === '0007') {
      // Không làm gì cả
    } else if (resp.responseCode === '0000') {
      this.listOfItems = resp.responseData;
    } else {
      this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
    }
  }

  confirmDelete(id: number) {
    this.soThuLyService.postRequest(
      this.soThuLyService.SOTHULY_URL + 'registerDecision/deleteRegisterDecisionAccused/',
      {
        id,
        status: 0,
        sppCode: this.sppCode
      }).toPromise()
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công!');
          this.listOfItems = this.listOfItems.filter(item => item.id !== id);
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }).catch(err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi. ' + err.message));
  }

  /*
   * Lấy số QĐ tự sinh đổ ra TextBox
   */
  getDecisionNum(): void {
    if (this.decisionCode().valid && this.issuesDate().valid) {
      const issuesDate = this.datePipe.transform(this.issuesDate().value, 'dd/MM/yyyy');
      this.soThuLyService.postRequest(
        this.soThuLyService.SOTHULY_URL + 'registerDecision/getDecisionNum/', {
          decisionCode: this.decisionCode().value,
          issuesDate,
          sppCode: this.sppCode,
          denouncementId: this.denouncement.id,
          type: 3
        }).toPromise()
        .then((resp: ResponseBody) => {
          if (resp.responseCode === '0000') {
            // Gán số QĐ tự sinh vào Input
            // this.decisionNum().setValue(resp.responseData);
            this.decisionNumAuto().setValue(resp.responseData);
          } else {
            this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
          }
        }, err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err.message));
    }
  }

  createRegisterDecisionAccused(registerDecision: RegisterDecision) {
    this.soThuLyService.postRequest(
      this.soThuLyService.SOTHULY_URL + 'registerDecision/createRegisterDecisionAccused/'
      , registerDecision).toPromise()
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới quyết định thành công!');
          this.resetForm();
          this.isConfirmLoading = false;
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
          this.isConfirmLoading = false;
        }
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err.message);
        this.isConfirmLoading = false;
      });
  }

  updateRegisterDecisionAccused(registerDecision: RegisterDecision) {
    this.soThuLyService.postRequest(
      this.soThuLyService.SOTHULY_URL + 'registerDecision/updateRegisterDecisionAccused/'
      , registerDecision).toPromise()
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật quyết định thành công!');
          this.resetForm();
          this.isConfirmLoading = false;
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
          this.isConfirmLoading = false;
        }
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err.message);
        this.isConfirmLoading = false;
      });
  }

  showConfirmDeleteModal(id: number) {
    this.confirmDeleteForm.get('id').setValue(id);
    this.isVisibleDeleteConfirm = true;
  }

  handleDeleteOk({id, reason}): void {
    if (this.confirmDeleteForm.invalid) {
      return;
    }
    this.soThuLyService.postRequest(
      this.soThuLyService.SOTHULY_URL + 'registerDecision/deleteRegisterDecisionAccused/',
      {
        id,
        reason,
        status: 0,
        sppCode: this.spp.isDePart === 'Y' ? this.spp.sppParent : this.spp.sppId
      }).toPromise()
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công!');
          this.listOfItems = this.listOfItems.filter(item => item.id !== id);
          this.confirmDeleteForm.reset();
          this.isVisibleDeleteConfirm = false;
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
          this.isVisibleDeleteConfirm = false;
        }
      }).catch(err => {
      this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi. ' + err.message);
      this.isVisibleDeleteConfirm = false;
    });
  }

  handleDeleteCancel() {
    this.isVisibleDeleteConfirm = false;
  }

  submitDeleteForm() {
    this.isVisibleDeleteConfirm = false;
  }
}
