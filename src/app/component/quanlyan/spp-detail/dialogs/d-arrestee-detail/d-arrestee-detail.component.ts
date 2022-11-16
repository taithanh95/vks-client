import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {ComponentMode, Constant} from '../../../../../shared/constants/constant.class';
import {ArresteeModel} from '../../../../../model/arrestee.model';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from '../../../../../shared/custom-validator/custom-validator.class';
import {ApParamModel} from '../../../../../model/ap-param.model';
import {CategoriesService} from '../../../../../service/categories.service';
import {ApParamService} from '../../../../../service/apparam.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {ConstantService} from '../../../../../service/constant.service';
import {NotificationService} from '../../../../../service/notification.service';
import {Subscription} from 'rxjs';
import {DateUtils} from '../../../../../shared/utils/date-utils.class';
import {DateService} from '../../../../../common/util/date.service';
import * as moment from 'moment';
import {DDisciplineViolationListComponent} from '../d-discipline-violation-list/d-discipline-violation-list.component';
import {DLawOffenceListComponent} from '../d-law-offence-list/d-law-offence-list.component';

@Component({
  selector: 'app-d-arrestee-detail',
  templateUrl: './d-arrestee-detail.component.html',
  styleUrls: ['./d-arrestee-detail.component.scss']
})
export class DArresteeDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isVisibleDialog: boolean;
  @Input() mode: ComponentMode = ComponentMode.VIEW;
  @Input() arrestee: ArresteeModel;
  @Output() onSave: EventEmitter<ArresteeModel> = new EventEmitter<ArresteeModel>();
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Input() isVisibleAdd: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Input() arrestTypes: ApParamModel[] = [];
  @Input() causeDeaths: ApParamModel[] = [];
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  @ViewChild(DDisciplineViolationListComponent, {static: false}) violationList: DDisciplineViolationListComponent;
  @ViewChild(DLawOffenceListComponent, {static: false}) lawOffenseList: DLawOffenceListComponent;
  @Input() update: any;
  @Input() arrestDetentionInfoId: number;
  lstCase: any[] = [];
  lstAccused: any[] = [];
  confirmModalRef: NzModalRef<any>;
  modeEnum = ComponentMode;
  isCollapse = true;
  // arrestTypes =[];
  theFirstClick: boolean;
  isSpinning: boolean;
  arrCollapse = [];
  arresteeForm: FormGroup;
  subscription: Subscription = new Subscription();
  userInfo: any;

  constructor(private fb: FormBuilder,
              private categoriesService: CategoriesService,
              private apParamService: ApParamService,
              private modalService: NzModalService,
              private notificationService: NzNotificationService,
              private constantService: ConstantService,
              private notification: NotificationService,
              private dateService: DateService) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.createFormControl();
    this.valueChange();
    this.mode = ComponentMode.VIEW;
  }

  handleCancel() {
    this.onCancel.emit();
    this.closeModal.emit(false);
    this.isVisibleDialog = false;
  }

  iaHandlingCauseDeathIdValueChange() {
    this.getControl('causeOfDeathId').valueChanges.subscribe(
      value => {
        this.getControl('causeOfDeathName').setValue(
          this.causeDeaths.find(e => e.paramValue === value)?.paramName
        );
      }
    );
  }

  changeCauseOfDeathId(value) {
    this.getControl('causeOfDeathName').setValue(
      this.causeDeaths.find(e => e.paramValue === value)?.paramName
    );
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisibleDialog) {
      this.arresteeForm.reset();
    }
    this.getDomainValueList({code: Constant.CAUSE_DEATH}, 'causeDeaths');
    if (this.arrestee) {
      this.arresteeForm.disable();
      this.arresteeForm.patchValue({
        ...this.arrestee
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createFormControl() {
    this.arresteeForm = this.fb.group({
      arrestDate: [new Date(), Validators.required],
      procuracyHandlingDate: [],
      arrestReason: ['', Validators.maxLength(1000)],
      arrestViolation: ['', Validators.maxLength(1000)],
      fullName: ['', [CustomValidator.validateNoFullSpace, Validators.maxLength(100)]],
      yearOfBirth: [null, [Validators.pattern(Constant.PATTERN_ONLY_NUMBER),
        Validators.maxLength(4), Validators.minLength(4), Validators.required]],
      dateOfBirth: [null, [CustomValidator.checkDateAndCurrentDate]],
      job: ['', Validators.maxLength(100)],
      workplace: ['', Validators.maxLength(300)],
      address: ['', Validators.maxLength(300)],
      isDead: false,
      deathDate: [{value: null, disabled: true}],
      escaped: false,
      escapingDate: [{value: null, disabled: true}],
      reasonForEscaping: [null, Validators.maxLength(1000)],
      recaptureDate: [{value: null, disabled: true}],
      moveToAnotherPlace: false,
      moveToAnotherPlaceDate: [{value: null, disabled: true}],
      arriveFromAnotherPlace: false,
      arriveFromAnotherPlaceDate: [{value: null, disabled: true}],
      reason: [null, Validators.maxLength(1000)],
      arrestType: ['BTG'],
      caseId: [null, Validators.required],
      caseName: [null],
      defendantId: [null, Validators.required],
      defendantName: [null],
      causeOfDeathId: [null],
      causeOfDeathName: [null],
      arresteeYear: [null],
      arresteeMonth: [null],
      arresteeDay: [null],
      detentionPlace: ['', Validators.maxLength(300)],
      noiChuyenDi: ['', Validators.maxLength(300)],
      noiChuyenDen: ['', Validators.maxLength(300)],
    });
  }

  getDomainValueList(code, list) {
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'dm/ApParam/getParams'
      , code
    ).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (resJson.responseData) {
            this[list] = resJson.responseData as ApParamModel[];
          }
        } else {
          // tslint:disable-next-line:max-line-length
          this.notification.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  getControl(controlName) {
    if (this.arresteeForm) {
      return this.arresteeForm.controls[controlName];
    }
  }

  convertYearToDate(year: number) {
    const date = `31/12/${year}`.split('/');
    const newDate = date[1] + '/' + date[0] + '/' + date[2];
    return new Date(newDate);
  }

  valueChange() {
    this.caseIdValueChange();
    this.defendantIdValueChange();
    this.dateOfBirthValueChange();
    this.iaHandlingCauseDeathIdValueChange();
  }

  dateOfBirthValueChange() {
    const value = this.getControl('dateOfBirth').value;
    this.getControl('dateOfBirth').valueChanges.subscribe(
      value => {
        const dateOB = new Date(value);
        if (value && this.getControl('yearOfBirth').value !== dateOB.getFullYear()) {
          this.getControl('yearOfBirth').setValue(dateOB.getFullYear());
        }
      }
    );
  }

  dateOfYearValueChange(e) {
    if (e && !isNaN(e) && this.getControl('yearOfBirth').valid) {
      this.getControl('dateOfBirth').setValue(this.convertYearToDate(e));
    }
  }

  checkDateOfBirth() {
    const yearOfBirth = this.arresteeForm.get('yearOfBirth').value;
    const dateOfBirth = this.arresteeForm.get('dateOfBirth').value;
    if (!dateOfBirth && (!yearOfBirth && yearOfBirth !== 0)) {
      return;
    }
    if (this.arresteeForm.get('yearOfBirth').errors) {
      return;
    }
    if (!isNaN(yearOfBirth)) {
      this.arresteeForm.get('yearOfBirth').setValue(Number(yearOfBirth));
    }
    if (dateOfBirth && isNaN(yearOfBirth)) {
      this.arresteeForm.get('yearOfBirth').setValue(dateOfBirth.getFullYear());
    } else if (!dateOfBirth && !isNaN(yearOfBirth)) {
      this.arresteeForm.get('dateOfBirth').setValue(this.convertYearToDate(yearOfBirth));
    }
  }

  checkProcuracyHandlingDate() {
    const arrestDate = new Date(this.arresteeForm.get('arrestDate').value);
    if (this.arresteeForm.get('procuracyHandlingDate').value != null) {
      const procuracyHandlingDate = new Date(this.arresteeForm.get('procuracyHandlingDate').value);
      if (!arrestDate || !procuracyHandlingDate) {
        return;
      }
      const invalidDate = Math.floor(procuracyHandlingDate.getTime() / 60000) < Math.floor(arrestDate.getTime() / 60000) ? true : false;
      const procuracyHandlingDateError = this.arresteeForm.get('procuracyHandlingDate').errors;
      this.arresteeForm.get('procuracyHandlingDate').setErrors(invalidDate ? {
        ...procuracyHandlingDateError,
        invalidProcuracyHandlingDate: true
      } : null);
    } else {
      return;
    }
  }

  checkDeathDate() {
    const deathDate = this.arresteeForm.get('deathDate').value;
    const dateOfBirth = this.arresteeForm.get('dateOfBirth').value;
    if (!deathDate || !dateOfBirth) {
      return;
    }
    const invalidDate = (DateUtils.compareDate(new Date(dateOfBirth), new Date(deathDate)) > 0);
    const deathDateError = this.arresteeForm.get('deathDate').errors;
    this.arresteeForm.get('deathDate').setErrors(invalidDate ? {...deathDateError, invalidDeathDate: true} : null);
  }

  checkEscapingDateRecaptureDate() {
    const escapingDate = this.arresteeForm.get('escapingDate').value;
    const recaptureDate = this.arresteeForm.get('recaptureDate').value;
    if (!escapingDate || !recaptureDate) {
      return;
    }
    const invalidDate = (DateUtils.compareDate(new Date(escapingDate), new Date(recaptureDate)) > 0);
    const recaptureDateErr = this.arresteeForm.get('recaptureDate').errors;
    this.arresteeForm.get('recaptureDate').setErrors(invalidDate ? {...recaptureDateErr, invalidRecaptureDate: true} : null);
  }

  disableItemInited() {
    if (this.arresteeForm.get('isDead').value) {
      this.arresteeForm.get('deathDate').enable();
      this.arresteeForm.get('causeOfDeathId').enable();
    } else {
      this.arresteeForm.get('deathDate').disable();
      this.arresteeForm.get('causeOfDeathId').disable();
    }
    if (this.arresteeForm.get('escaped').value) {
      this.arresteeForm.get('escapingDate').enable();
      this.arresteeForm.get('recaptureDate').enable();
      this.arresteeForm.get('reasonForEscaping').enable();
    } else {
      this.arresteeForm.get('escapingDate').disable();
      this.arresteeForm.get('recaptureDate').disable();
      this.arresteeForm.get('reasonForEscaping').disable();
    }
    if (this.arresteeForm.get('moveToAnotherPlace').value) {
      this.arresteeForm.get('moveToAnotherPlaceDate').enable();
      this.arresteeForm.get('noiChuyenDen').enable();
    } else {
      this.arresteeForm.get('moveToAnotherPlaceDate').disable();
      this.arresteeForm.get('noiChuyenDen').disable();
    }
    if (this.arresteeForm.get('arriveFromAnotherPlace').value) {
      this.arresteeForm.get('arriveFromAnotherPlaceDate').enable();
      this.arresteeForm.get('noiChuyenDi').enable();
    } else {
      this.arresteeForm.get('arriveFromAnotherPlaceDate').disable();
      this.arresteeForm.get('noiChuyenDi').disable();
    }
  }

  chekChange(value: any, checked: any) {
    if (value === 'isDead') {
      if (checked) {
        this.arresteeForm.get('deathDate').enable();
        this.arresteeForm.get('causeOfDeathId').enable();
      } else {
        this.arresteeForm.get('deathDate').disable();
        this.arresteeForm.get('causeOfDeathId').disable();
        this.arresteeForm.patchValue({deathDate: null, causeOfDeathId: null});
      }
    } else if (value === 'escaped') {
      if (checked) {
        this.arresteeForm.get('escapingDate').enable();
        this.arresteeForm.get('recaptureDate').enable();
        this.arresteeForm.get('reasonForEscaping').enable();
      } else {
        this.arresteeForm.get('escapingDate').disable();
        this.arresteeForm.get('recaptureDate').disable();
        this.arresteeForm.get('reasonForEscaping').disable();
        this.arresteeForm.patchValue({escapingDate: null, recaptureDate: null, reasonForEscaping: null});
      }
    } else if (value === 'moveToAnotherPlace') {
      if (checked) {
        this.arresteeForm.get('moveToAnotherPlaceDate').enable();
        this.arresteeForm.get('noiChuyenDen').enable();
      } else {
        this.arresteeForm.get('moveToAnotherPlaceDate').disable();
        this.arresteeForm.get('noiChuyenDen').disable();
        this.arresteeForm.patchValue({moveToAnotherPlaceDate: null});
      }
    } else if (value === 'arriveFromAnotherPlace') {
      if (checked) {
        this.arresteeForm.get('arriveFromAnotherPlaceDate').enable();
        this.arresteeForm.get('noiChuyenDi').enable();
      } else {
        this.arresteeForm.get('arriveFromAnotherPlaceDate').disable();
        this.arresteeForm.get('noiChuyenDi').disable();
        this.arresteeForm.patchValue({arriveFromAnotherPlaceDate: null});
      }
    }
  }

  caseIdValueChange() {
    this.getControl('caseId').valueChanges.subscribe(
      value => {
        this.getControl('caseName').setValue(
          this.lstCase.find(e => e.caseCode === value)?.caseName
        );
      }
    );
  }

  defendantIdValueChange() {
    this.getControl('defendantId').valueChanges.subscribe(
      value => {
        this.getControl('defendantName').setValue(
          this.lstAccused.find(e => e.accuCode === value)?.fullName
        );
      }
    );
  }

  changeArrestType() {
    if (this.arresteeForm.get('arrestType').value !== 'BTG') {
      this.arresteeForm.patchValue({
        caseId: 1,
        caseName: null,
        defendantId: 1,
        defendantName: null
      });
    } else {
      this.arresteeForm.patchValue({
        caseId: null,
        caseName: null,
        defendantId: null,
        defendantName: null
      });
    }
  }

  getLstCase(e) {
    this.constantService.postRequest(this.constantService.MANAGE_URL + 'case/getPage/'
      , {
        pageNumber: 1,
        pageSize: 10,
        dataRequest: {
          caseName: e,
          sppId: this.userInfo.sppid
        }
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (resJson.responseData) {
            this.lstCase = resJson.responseData.data;
          } else {
            this.lstCase = [];
          }
        } else {
          // tslint:disable-next-line:max-line-length
          // this.notification.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  getLstAccused(e) {
    const caseId = this.arresteeForm.get('caseId').value;
    if (!caseId) {
      this.lstAccused = [];
      return;
    }
    this.constantService.postRequest(this.constantService.MANAGE_URL + 'accused/getPage/'
      , {
        pageNumber: 1,
        pageSize: 10,
        dataRequest: {
          fullName: e,
          sppId: this.userInfo.sppid,
          caseCode: caseId
        }
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (resJson.responseData) {
            this.lstAccused = resJson.responseData.data;
          } else {
            this.lstAccused = [];
          }
        } else {
          this.lstAccused = [];
          if (this.arresteeForm.get('arrestType').value === 'BTG') {
            this.arresteeForm.patchValue({
              defendantId: null,
              defendantName: null
            });
          }
          // tslint:disable-next-line:max-line-length
          // this.notification.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  searchByCaseName(e) {
    this.getLstCase(e);
  }

  changeLstCaseId(e) {
    if (this.arresteeForm.get('arrestType').value === 'BTG') {
      this.arresteeForm.patchValue({
        defendantId: null,
        defendantName: null
      });
      this.getLstAccused('');
    }
  }

  searchByDefendantName(e) {
    this.getLstAccused(e);
  }

  convertDate(inputDate: any) {
    return this.dateService.convertDateToStringByPattern(inputDate, 'HH:mm:ss dd/MM/yyyy');
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  onDateTimeValueChange(event: any, formControl: AbstractControl): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.error('Lỗi', 'Sai định dạng ngày tháng dd/MM/yyyy.');
        formControl.setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.error('Lỗi', 'Ngày tháng không hợp lệ.');
        formControl.setValue(null);
        return;
      } else {
        date.setHours(new Date().getHours());
        date.setMinutes(new Date().getMinutes());
        formControl.setValue(date);
      }
    }
  }

  onDateValueChange(event: any, formControl: AbstractControl): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.error('Lỗi', 'Sai định dạng ngày tháng dd/MM/yyyy.');
        formControl.setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.error('Lỗi', 'Ngày tháng không hợp lệ.');
        formControl.setValue(null);
        return;
      } else {
        formControl.setValue(date);
      }
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  formatterYear = (value: number) => `${value} Năm`;
  parserYear = (value: string) => value.replace('Năm ', '');

  formatterMonth = (value: number) => `${value} Tháng`;
  parserMonth = (value: string) => value.replace('Tháng ', '');

  formatterDay = (value: number) => `${value} Ngày`;
  parserDay = (value: string) => value.replace('Ngày ', '');

  nzFocusYear() {
    this.formatterYear = (value: number) => `${value}`;
    this.parserYear = (value: string) => value.replace('', '');
  }

  nzBlurYear() {
    this.formatterYear = (value: number) => `${value} Năm`;
    this.parserYear = (value: string) => value.replace('Năm ', '');
  }

  nzFocusMonth() {
    this.formatterMonth = (value: number) => `${value}`;
    this.parserMonth = (value: string) => value.replace('', '');
  }

  nzBlurMonth() {
    this.formatterMonth = (value: number) => `${value} Tháng`;
    this.parserMonth = (value: string) => value.replace('Tháng ', '');
  }

  nzFocusDay() {
    this.formatterDay = (value: number) => `${value}`;
    this.parserDay = (value: string) => value.replace('', '');
  }

  nzBlurDay() {
    this.formatterDay = (value: number) => `${value} Ngày`;
    this.parserDay = (value: string) => value.replace('Ngày ', '');
  }
}
