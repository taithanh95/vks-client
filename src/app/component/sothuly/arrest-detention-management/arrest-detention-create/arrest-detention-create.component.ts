import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../shared/constants/constant.class';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {LoaderService} from '../../../../service/loader.service';
import {ApParamService} from '../../../../service/apparam.service';
import {CategoriesService} from '../../../../service/categories.service';
import {ArrestDetentionInfoModel} from '../../../../model/arrest-detention-info.model';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {ArresteeListComponent} from '../arrestee/arrestee-list/arrestee-list.component';
import {ConstantService} from '../../../../service/constant.service';
import {NotificationService} from '../../../../service/notification.service';
import {DateUtils} from '../../../../shared/utils/date-utils.class';
import * as moment from 'moment';

@Component({
  selector: 'app-arrest-detention-create',
  templateUrl: './arrest-detention-create.component.html',
  styleUrls: ['./arrest-detention-create.component.scss'],
  providers: [
    DatePipe
  ]
})
export class ArrestDetentionCreateComponent implements OnInit, OnChanges {
  @Input() isVisibleAdd: boolean;
  @Output() closeModal: EventEmitter<string> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @ViewChild(ArresteeListComponent, {static: false}) arresteeList: ArresteeListComponent;
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;
  formArrestDetention: FormGroup;
  isSpinning: boolean;
  arrCollapse = [];
  userInfo: any;
  accesses = Constant.ACCESSES;
  desAccessLevel: string;
  theFirstClick: boolean;
  defaultIaHandlingOfficer: string;
  lstPolicesAndPol = [];
  procurators = [];
  @Input() mode: ComponentMode = ComponentMode.VIEW;
  tmoList = [];

  constructor(private fb: FormBuilder,
              private datePipe: DatePipe,
              private modalService: NzModalService,
              private loaderService: LoaderService,
              private apParamService: ApParamService,
              private categoriesService: CategoriesService,
              private notificationService: NzNotificationService,
              private constantService: ConstantService,
              private notification: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.createFormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisibleAdd && this.isVisibleAdd) {
      this.theFirstClick = true;
      this.isSpinning = false;
      this.arrCollapse = [true, true, true, true];
      this.desAccessLevel = this.accesses.find(e => e.value === 0).des || '';
      this.getPoliceNameBySppId();
      this.getListInspector('');
      this.formArrestDetention.markAsPristine();
      this.formArrestDetention.patchValue({
        takenOverAgencyCode: Constant.TAKEN_OVER_AGENCY_CQDT,
        crimeReportSource: Constant.DENOUNCEMENT_TYPE_NEW,
        // iaHandlingUnit: this.defaultIaHandlingOfficer,
        iaHandlingUnitId: this.userInfo.sppid,
        takenOverOfficer: this.userInfo.userid,
        sppId: this.userInfo.sppid,
        shareInfoLevel: 0,
        procuracyTakenOverDate: new Date(),
        procuratorAssignmentDate: new Date(),
        arresteeList: []

      });
      this.arresteeList.ngOnInit();
      this.valueChange();
    }
  }

  valueChange() {
    this.iaHandlingUnitIdValueChange();
    // this.dateOfBirthValueChange();
    // this.getDefaultLevelShareInfo();
    this.shareInfoLevelValueChange();
    this.takenOverProsecutorIdValueChange();
  }

  handleCancel(): void {
    this.closeModal.emit('close');
    this.resetPage();
  }

  resetPage() {
    this.formArrestDetention.reset();
    this.formArrestDetention.patchValue({
      takenOverAgencyCode: Constant.TAKEN_OVER_AGENCY_CQDT,
      crimeReportSource: Constant.DENOUNCEMENT_TYPE_NEW,
      arrestingUnitName: this.defaultIaHandlingOfficer,
      arrestingUnitId: this.userInfo.sppid,
      takenOverOfficer: this.userInfo.userid,
      sppId: this.userInfo.sppid,
      shareInfoLevel: 0,
      arresteeList: []
    });
    this.getPoliceNameBySppId();
    this.closeModal.emit('save');
  }

  handleOk(): void {
  }

  onSubmitForm() {
    this.validForm();
    if (this.formArrestDetention.invalid) {
      return;
    }
    this.showConfirmSave();
  }

  createFormControl() {
    this.formArrestDetention = this.fb.group({
      id: [null],
      code: [{value: null, disabled: true}],
      takenOverAgencyCode: [Constant.TAKEN_OVER_AGENCY_CQDT],
      // takenOverOfficer: [this.userInfo.userid, Validators.maxLength(100)],
      arrestingUnitName: [null],
      arrestingUnitId: [this.userInfo.sppid || null],
      procuracyTakenOverDate: [null],
      takenOverProcuratorName: [null],
      takenOverProsecutorId: [null],
      procuratorAssignmentDecisionNumber: [null, Validators.maxLength(10)],
      procuratorAssignmentDate: [new Date()],
      arrestContent: [null, Validators.required],
      shareInfoLevel: [0],
      sppId: [this.userInfo.sppid],
      arresteeList: []
    });
  }

  showConfirmSave(): void {
    this.confirmModalRef = this.modalService.create({
      nzTitle: this.confirmHeaderTemplate,
      nzContent: this.confirmTemplate,
      nzClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: 'Có', onClick: () => {
            this.saveData();
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

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  onSearch(e) {
    this.getPoliceAndPol(e);
  }

  onSearchInspector(e) {
    this.getListInspector(this.formArrestDetention.value.takenOverProsecutorId);
  }

  getListInspector(takenOverProsecutorId: string) {
    this.categoriesService.getListInspectorByPositionSearchKey('KS', takenOverProsecutorId).subscribe(next => {
      this.procurators = next;
    }, error => {
      this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + error);
    });
  }

  saveData(): any {
    this.isSpinning = true;
    const objToSubmit = this.formArrestDetention.value;
    for (const prop in objToSubmit) {
      if (objToSubmit.hasOwnProperty(prop) && objToSubmit[prop] && typeof objToSubmit[prop] === 'string') {
        objToSubmit[prop] = objToSubmit[prop]?.trim();
      }
    }
    if (!this.getControl('arrestingUnitId').value) {
      this.getControl('arrestingUnitName').setValue(null);
    }
    const data: ArrestDetentionInfoModel = this.formArrestDetention.value;
    data.arrestees = this.arresteeList.getActualArresteeList();
    data.status = GeneralModelStatus.ACTIVE;
    setTimeout(() => {
      this.constantService.postRequest(this.constantService.SOTHULY_URL + 'arrest-detention', objToSubmit)
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.resetPage();
            this.notification.showNotification(Constant.SUCCESS, 'Thêm mới dữ liệu thành công');
          } else {
            // tslint:disable-next-line:max-line-length
            this.notification.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
          }
        })
        .catch(err => {
          this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
        });
    }, 500);
  }

  getPoliceNameBySppId() {
    if (this.userInfo) {
      this.categoriesService.getPoliceNameBySppId(this.userInfo.sppid).subscribe(data => {
        this.defaultIaHandlingOfficer = data;
        this.lstPolicesAndPol = [{name: data, value: this.userInfo.sppid}];
        this.formArrestDetention?.controls.arrestingUnitName.setValue(data);
        this.formArrestDetention?.controls.arrestingUnitId.setValue(this.userInfo.sppid);
        this.formArrestDetention?.controls.sppId.setValue(this.userInfo.sppid);
      });
    }
  }

  getPoliceAndPol(value) {
    this.categoriesService.getListPoliceAndPolByName(value)
      .subscribe(res => {
        this.lstPolicesAndPol = res;
      });
  }



  takenOverProsecutorIdValueChange() {
    const takenOverProsecutorIdControl = this.formArrestDetention.get('takenOverProsecutorId');
    takenOverProsecutorIdControl.valueChanges.subscribe(
      value => {
        const procuratorName = this.procurators.find(e => e.inspCode === value)?.fullName || '';
        this.formArrestDetention.get('takenOverProcuratorName').setValue(procuratorName);
      }
    );
  }

  iaHandlingUnitIdValueChange() {
    this.getControl('arrestingUnitId').valueChanges.subscribe(
      value => {
        this.getControl('arrestingUnitName').setValue(
          this.lstPolicesAndPol.find(e => e.value === value)?.name
        );
      }
    );
  }

  getControl(controlName) {
    if (this.formArrestDetention) {
      return this.formArrestDetention.controls[controlName];
    }
  }

  hasError(controlName: string, errorName: string) {
    if (this.formArrestDetention && this.formArrestDetention.controls[controlName]) {
      return this.getControl(controlName).invalid &&
        (this.getControl(controlName).touched || this.getControl(controlName).dirty) &&
        this.getControl(controlName).hasError(errorName);
    }
  }

  validForm(): void {
    if (this.formArrestDetention.invalid) {
      Object.keys(this.formArrestDetention.controls).forEach(key => {
        this.formArrestDetention.get(key).markAsDirty();
        this.formArrestDetention.get(key).updateValueAndValidity();
      });
    }
    // this.checkNullCustom();
    this.checkMaxlengCustom();
    this.formArrestDetention.updateValueAndValidity();
    this.checkProcuracyTakenOverDate();
    this.checkProcuratorAssignmentDate();
  }

  checkProcuracyTakenOverDate() {
    const currentDate = new Date();
    const procuracyTakenOverDate = new Date(this.formArrestDetention.get('procuracyTakenOverDate').value);
    const invalidDate = Math.floor(currentDate.getTime() / 60000) < Math.floor(procuracyTakenOverDate.getTime() / 60000);
    const procuracyTakenOverDateError = this.formArrestDetention.get('procuracyTakenOverDate').errors;
    this.formArrestDetention.get('procuracyTakenOverDate')
      .setErrors(invalidDate ? {...procuracyTakenOverDateError, invalidProcuracyTakenOverDate: true} : null);
  }

  checkProcuratorAssignmentDate() {
    const procuratorAssignmentDate = new Date(this.formArrestDetention.get('procuratorAssignmentDate').value);
    const invalidDate = (DateUtils.compareDate(new Date(procuratorAssignmentDate), new Date()) > 0);
    const procuratorAssignmentDateError = this.formArrestDetention.get('procuratorAssignmentDate').errors;
    this.formArrestDetention.get('procuratorAssignmentDate')
      .setErrors(invalidDate ? {...procuratorAssignmentDateError, invalidProcuratorAssignmentDate: true} : null);
  }

  shareInfoLevelValueChange() {
    const shareInfoLevelControl = this.formArrestDetention.get('shareInfoLevel');
    shareInfoLevelControl.valueChanges.subscribe(
      value => {
        this.desAccessLevel = this.accesses.find(e => e.value === value)?.des || '';
      }
    );
  }

  checkMaxlengCustom() {
    const content = this.formArrestDetention.get('arrestContent').value;
    const recaptureDateErr = this.formArrestDetention.get('arrestContent').errors;
    const textEncoder = new TextEncoder();
    const invalidArrestContentCheckNull = content == null;
    const invalidArrestContent = textEncoder.encode(content).length > 3000;
    if (invalidArrestContentCheckNull === true) {
      this.formArrestDetention.get('arrestContent').setErrors(invalidArrestContentCheckNull ? {...recaptureDateErr, required: true} : null);
      return;
    }
    if (invalidArrestContent === true) {
      this.formArrestDetention.get('arrestContent').setErrors(invalidArrestContent ? {...recaptureDateErr, invalidMaxlength: true} : null);
      return;
    }
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
}
