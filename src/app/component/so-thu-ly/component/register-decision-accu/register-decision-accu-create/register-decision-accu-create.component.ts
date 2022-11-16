import {Component, OnInit, ViewChild} from '@angular/core';
import {RegisterDecision} from '../../../model/register-decision';
import {ResponseBody} from '../../../model/response-body';
import {Constant} from '../../../../../shared/constants/constant.class';
import {NotificationService} from '../../../../../service/notification.service';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DatePipe, Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import {Accused, Spp} from '../../../model/so-thu-ly.model';
import {UserForPipe} from '../../../pipe/user-for.pipe';
import {ParsePipe} from 'ngx-moment';
import {ConstantService} from '../../../../../service/constant.service';
import {SoThuLyService} from '../../../service/so-thu-ly.service';
import * as moment from 'moment';
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";
import {CategoriesService} from "../../../../../service/categories.service";
import {GeneralService} from "../../../../../service/general-service";
import {DateService} from "../../../../../common/util/date.service";

@Component({
  selector: 'app-register-decision-accu-create',
  templateUrl: './register-decision-accu-create.component.html',
  styleUrls: ['./register-decision-accu-create.component.scss']
})
export class RegisterDecisionAccuCreateComponent implements OnInit {
  accused: Accused;
  listOfItems: RegisterDecision[] = [];
  selectedItem: RegisterDecision;
  listOfOption: Array<{ value: string; text: string }> = [];
  collapse = true;
  isVisible: boolean;
  isVisibleDeleteConfirm: boolean;
  isConfirmLoading = false;
  myForm!: FormGroup;
  confirmDeleteForm!: FormGroup;
  account: any;
  spp!: Spp;
  isDisable: boolean;

  lstInpectors: any[];
  inspectorOpions: any[]
  sppId: any;
  regicode: any;
  decicode: any;

  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  @ViewChild('inDatePicker') inDatePicker!: NzDatePickerComponent;
  @ViewChild('decisionSelect') decisionSelect!: NzSelectComponent;

  constructor(
    private constantService: ConstantService,
    private soThuLyService: SoThuLyService,
    private notificationService: NotificationService,
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private dateService: DateService,
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private parsePipe: ParsePipe,
    private datePipe: DatePipe
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.initForm();
    this.getSppByUserId().then(() => {
      this.getAccused().then(() => {
        this.getListRegisterDecision();
      }, err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi: ' + err.message));
    }, err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi: ' + err.message));
    this.getDecision();
  }

  initForm() {
    this.myForm = this.fb.group({
      id: [null],
      stage: ['G1', [Validators.required]],
      issuesDate: [null, [Validators.required]],
      decisionCode: [null, [Validators.required]],
      decisionNumAuto: [null],
      fromDate: [null, [this.inDateValidator]],
      toDate: [null],
      note: [null, [Validators.maxLength(2000)]],
      signer: [null, [Validators.required]],
      position: [null, [Validators.required]]
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
    this.selectedItem = null;
    this.isVisible = false;
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
        caseCode: this.accused.caseCode,
        accusedCode: this.accused.accuCode,
        sppCode: this.spp.sppId,
        note: model.note,
        type: 2,
        sppid: this.spp.sppId,
        signer: model.signer,
        position: model.position
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
            const issuesDate: Date = this.convertTimeToBeginningOfTheDay(value.issuesDate);
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
    this.checkStatusRegister();
    this.isVisible = true;
  }

  onStageChange(open: boolean) {
    if (!open) {
      this.checkStatusRegister();
    }
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
    this.stage().setValue('G1');
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

  async getAccused(): Promise<void> {
    const accuCode = this.route.snapshot.paramMap.get('id');
    const resp = await this.soThuLyService.postRequest(this.soThuLyService.MANAGE_URL + 'accused/detail/', {accuCode}).toPromise();
    if (resp.responseCode === '0000') {
      this.accused = resp.responseData;
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
      toDate: obj.toDate ? this.convertTimeToBeginningOfTheDay(obj.toDate) : null,
      note: obj.note ? obj.note : null,
      signer: obj.signer,
      position: obj.position
    });
    // this.myForm.get('signer').disable();
    // this.myForm.get('position').disable();
    this.selectedItem = this.myForm.value;
    this.isVisible = true;
    this.isDisable = true;
  }

  getDecision(): void {
    this.constantService.postRequest(
      this.constantService.MANAGE_URL + 'decision/getListForDropbox/', {status: 'Y', applyFor: 'A'}
    ).toPromise()
      .then(resp => resp.json())
      .then((resp: ResponseBody) => {
        const listOfOption: Array<{ value: string; text: string }> = [];
        resp.responseData.forEach(item => {
          listOfOption.push({
            value: item.deciId,
            text: item.name
          });
        });
        this.listOfOption = listOfOption;
      });
  }

  async getSppByUserId(): Promise<void> {
    this.account = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.spp = JSON.parse(localStorage.getItem(Constant.SPP));
    if (this.account.userid) {
      const resp = await this.soThuLyService.postRequest(
        this.soThuLyService.MANAGE_URL + 'spp/findFirstByUsername/', {
          username: this.account.userid
        }).toPromise();
      if (resp.responseCode === '0000') {
        this.spp = resp.responseData;
      }
    } else {
      this.notificationService.showNotification(Constant.ERROR, 'Vui lòng đăng nhập trước');
    }
  }

  getListRegisterDecision(): void {
    this.constantService.postRequest(
      this.constantService.SOTHULY_URL + 'registerDecision/getList/',
      {
        accusedCode: this.accused.accuCode,
        type: 2,
        sppCode: this.spp.isDePart === 'Y' ? this.spp.sppParent : this.spp.sppId
      }).toPromise()
      .then(resp => resp.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0007') {
          // Không có dữ liệu thì không làm gì cả (Không bắn thông báo nữa)
        } else if (resp.responseCode === '0000') {
          this.listOfItems = resp.responseData;
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }).catch(err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không phản hồi. ' + err.message));
  }

  confirmDelete(id: number) {
    this.constantService.postRequest(
      this.constantService.SOTHULY_URL + 'registerDecision/deleteRegisterDecisionAccused/',
      {
        id,
        status: 0,
        sppCode: this.spp.isDePart === 'Y' ? this.spp.sppParent : this.spp.sppId
      }).toPromise()
      .then(resp => resp.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công!');
          this.listOfItems = this.listOfItems.filter(item => item.id !== id);
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }).catch(err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi. ' + err.message));
  }

  private checkStatusRegister(): void {
    this.constantService.postRequest(
      this.constantService.MANAGE_URL + 'register/findFirstByCaseCodeAndStage/', {
        caseCode: this.accused.caseCode,
        stage: this.stage().value
      }).toPromise()
      .then(resp => resp.json())
      .then((resp: ResponseBody) => {
        const stage = new UserForPipe().transform(this.stage().value);
        if (resp.responseCode === '0000') {
          this.regicode = resp.responseData.regiCode;
          // if (resp.responseData.status === 'KTVA') {
          //   this.notificationService.showNotification(Constant.ERROR, `Giai đoạn ${stage} đã kết thúc thụ lý và không được cấp số lệnh/quyết định`);
          //   this.disableForm();
          // } else {
          //   this.enableForm();
          // }
          this.enableForm();
        } else if (resp.responseCode === '0007') {
          this.notificationService.showNotification(Constant.ERROR, `Vụ án chưa chuyển sang giai đoạn ${stage}, không thể cấp số lệnh/quyết định.`);
          this.disableForm();
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }).catch(err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi. ' + err.message))
  }

  private disableForm(): void {
    this.decisionCode().disable();
    this.issuesDate().disable();
    // this.decisionNum().disable();
    this.fromDate().disable();
    this.toDate().disable();
  }

  private enableForm() {
    this.decisionCode().enable();
    this.issuesDate().enable();
    // this.decisionNum().enable();
    this.fromDate().enable();
    this.toDate().enable();
  }

  /*
   * Lấy số QĐ tự sinh đổ ra TextBox
   */
  getDecisionNum(): void {
    if (this.decisionCode().valid && this.issuesDate().valid) {
      const issuesDate = new DatePipe('en-US').transform(this.issuesDate().value, 'dd/MM/yyyy');
      this.constantService.postRequest(
        this.constantService.SOTHULY_URL + 'registerDecision/getDecisionNum/', {
          decisionCode: this.decisionCode().value,
          issuesDate,
          sppCode: this.spp.sppId,
          accusedCode: this.accused.accuCode,
          type: 2
        }).toPromise()
        .then(resp => resp.json())
        .then((resp: ResponseBody) => {
          if (resp.responseCode === '0000') {
            // Gán số QĐ tự sinh vào Input
            this.decisionNumAuto().setValue(resp.responseData);
            // this.decisionNum().setValue(resp.responseData);
          } else {
            this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
            this.decisionNumAuto().setValue(null);
            // this.decisionNum().setValue(null);
          }
        }, err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err.message));
    }
  }

  createRegisterDecisionAccused(registerDecision: RegisterDecision) {
    console.log('registerDecision::::::::::::::::', registerDecision);
    this.constantService.postRequest(
      this.constantService.SOTHULY_URL + 'registerDecision/createRegisterDecisionAccused/'
      , registerDecision).toPromise()
      .then(resp => resp.json())
      .then(async respJson => {
        if (respJson.responseCode === '0000') {
          // Lưu thêm quyết định vụ án ở đây
          let decision = {
            setnumdeci: '',
            indate: null,
            atxSpp: null,
            atxPolice: null,
            atxSpc: null,
            atxArmy: null,
            atxCustoms: null,
            atxRanger: null,
            atxBorderGuards: null,
            decicode: '',
            deciid: '',
            fromdate: null,
            todate: null,
            signname: '',
            signoffice: '',
            casecode: '',
            regicode: '',
            begin_office: '',
            begin_officeid: '',
            accucode: '',
            registerdeciid: '',
            rutgon: null
          };
          const atxSpp = await this.getObject('getSppBySppid', registerDecision.sppid);
          decision.atxSpp = atxSpp;
          decision.setnumdeci = registerDecision.decisionNum;
          decision.indate = this.dateService.stringToDate(registerDecision.issuesDate?.toString(), 'DD/MM/YYYY');
          decision.deciid = registerDecision.decisionCode;
          decision.fromdate = this.dateService.stringToDate(registerDecision.fromDate?.toString(), 'DD/MM/YYYY');
          decision.todate = this.dateService.stringToDate(registerDecision.toDate?.toString(), 'DD/MM/YYYY');
          decision.signname = registerDecision.signer;
          decision.signoffice = registerDecision.position;
          decision.casecode = registerDecision.caseCode;
          decision.accucode = registerDecision.accusedCode;
          decision.regicode = this.regicode;
          decision.begin_office = 'SPP';
          decision.begin_officeid = registerDecision.sppid;

          const savedItem = {
            decision: decision,
            action: 'I',
            sppid: registerDecision.sppid,
            rutgon: 'N'
          };
          this.generalService.saveSppDecisionCase(savedItem).subscribe(res => {
            this.decicode = res;
          }, error => {
            if (error.error && error.error.text) {
              this.notificationService.showNotification(Constant.ERROR, error.error.text);
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
            }
          });
          this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới quyết định thành công!');
          this.resetForm();
          // Thực hiện tải lại DS
          this.getListRegisterDecision();
          this.isConfirmLoading = false;
        } else {
          this.notificationService.showNotification(Constant.ERROR, respJson.responseMessage);
          this.isConfirmLoading = false;
        }
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err.message);
        this.isConfirmLoading = false;
      });
  }

  updateRegisterDecisionAccused(registerDecision: RegisterDecision) {
    this.constantService.postRequest(
      this.constantService.SOTHULY_URL + 'registerDecision/updateRegisterDecisionAccused/'
      , registerDecision).toPromise()
      .then(resp => resp.json())
      .then(async respJson => {
        if (respJson.responseCode === '0000') {
          // Lưu thêm quyết định vụ án ở đây
          let decision = {
            setnumdeci: '',
            indate: null,
            atxSpp: null,
            atxPolice: null,
            atxSpc: null,
            atxArmy: null,
            atxCustoms: null,
            atxRanger: null,
            atxBorderGuards: null,
            decicode: '',
            deciid: '',
            fromdate: null,
            todate: null,
            signname: '',
            signoffice: '',
            casecode: '',
            regicode: '',
            begin_office: '',
            begin_officeid: '',
            accucode: '',
            registerdeciid: '',
            rutgon: null
          };
          const atxSpp = await this.getObject('getSppBySppid', registerDecision.sppid);
          decision.atxSpp = atxSpp;
          decision.setnumdeci = registerDecision.decisionNum;
          decision.indate = this.dateService.stringToDate(registerDecision.issuesDate?.toString(), 'DD/MM/YYYY');
          decision.deciid = registerDecision.decisionCode;
          decision.fromdate = this.dateService.stringToDate(registerDecision.fromDate?.toString(), 'DD/MM/YYYY');
          decision.todate = this.dateService.stringToDate(registerDecision.toDate?.toString(), 'DD/MM/YYYY');
          decision.signname = registerDecision.signer;
          decision.signoffice = registerDecision.position;
          decision.casecode = registerDecision.caseCode;
          decision.accucode = registerDecision.accusedCode;
          decision.regicode = this.regicode;
          decision.begin_office = 'SPP';
          decision.begin_officeid = registerDecision.sppid;
          decision.decicode = this.decicode;

          const savedItem = {
            decision: decision,
            action: 'U',
            sppid: registerDecision.sppid,
            rutgon: 'N'
          };
          this.generalService.saveSppDecisionCase(savedItem).subscribe(res => {
          }, error => {
            if (error.error && error.error.text) {
              this.notificationService.showNotification(Constant.ERROR, error.error.text);
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
            }
          });


          this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật quyết định thành công!');
          this.resetForm();
          // Thực hiện tải lại DS
          this.getListRegisterDecision();
          this.isConfirmLoading = false;
        } else {
          this.notificationService.showNotification(Constant.ERROR, respJson.responseMessage);
          this.isConfirmLoading = false;
        }
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err.message);
        this.isConfirmLoading = false;
      });
  }

  async getObject(funcName: string, param: string) {
    return new Promise<any>(async (resolve) => {
      this.categoriesService[funcName](param).subscribe(res => {
        resolve(res ?? '');
      });
    })
  }

  showConfirmDeleteModal(id: number) {
    this.confirmDeleteForm.get('id').setValue(id);
    this.isVisibleDeleteConfirm = true;
  }

  handleDeleteOk({id, reason}): void {
    if (this.confirmDeleteForm.invalid) {
      return;
    }
    this.constantService.postRequest(
      this.constantService.SOTHULY_URL + 'registerDecision/deleteRegisterDecisionAccused/',
      {
        id,
        reason,
        status: 0,
        sppCode: this.spp.isDePart === 'Y' ? this.spp.sppParent : this.spp.sppId
      }).toPromise()
      .then(resp => resp.json())
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

  onInputInspector(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (value === ' ') value = '0';
    if (!value || value.indexOf('@') >= 0) {
      this.lstInpectors = [];
    } else {
      this.categoriesService.getLstInspectorByQuery(value, 'ALL', this.sppId).subscribe(res => {
        this.lstInpectors = res;
      });
    }
  }

  handleChangeSignname() {
    if (this.lstInpectors) {
      const rs = this.lstInpectors.find(s => s.FULLNAME === this.myForm.get('signer').value);
      if (rs) {
        this.categoriesService.getInspectorByinpcode(rs?.INSPCODE).subscribe(res => {
          this.inspectorOpions = [res];
          this.myForm.get('position').setValue(res.JOBTITLE);
        }, err => {
          console.log(err.error.text);
        });
      }
    }
  }
}
