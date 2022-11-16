import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constant, GeneralModelStatus} from '../../../../shared/constants/constant.class';
import {CategoriesService} from '../../../../service/categories.service';
import {ApParamService} from '../../../../service/apparam.service';
import {CustomValidator} from '../../../../shared/custom-validator/custom-validator.class';
import {DatePipe} from '@angular/common';
import {DenouncementService} from '../../../../service/denouncement.service';
import {DenouncedPersonListComponent} from '../denounced-person/denounced-person-list/denounced-person-list.component';
import {DenouncementModel} from '../../../../model/denouncement.model';
import {LoaderService} from '../../../../service/loader.service';
import {DateUtils} from '../../../../shared/utils/date-utils.class';
import {ConstantService} from '../../../../service/constant.service';
import {ResponseBody} from '../../../so-thu-ly/model/response-body';
import * as moment from 'moment';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {DenouncedPersonModel} from '../../../../model/denounced-person.model';
import {ParsePipe} from 'ngx-moment';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {NotificationService} from "../../../../service/notification.service";
import {StringService} from "../../../../common/util/string.service";

interface LstPolices {
  POLICEID: string;
  NAME: string;
}

interface LstArmies {
  ARMYID: string;
  NAME: string;
}

interface LstCustoms {
  CUSTOMID: string;
  NAME: string;
}

interface LstRangers {
  RANGID: string;
  NAME: string;
}

interface LstBorderGuards {
  BORGUAID: string;
  NAME: string;
}

interface LstSpps {
  sppid: string;
  name: string;
}

interface LstSpcs {
  SPCID: string;
  NAME: string;
}

@Component({
  selector: 'app-denouncement-create',
  templateUrl: './denouncement-create.component.html',
  styleUrls: ['./denouncement-create.component.scss'],
  providers: [
    DatePipe,
    ParsePipe
  ]
})
export class DenouncementCreateComponent implements OnInit, OnChanges {

  @Input() isVisibleAdd: boolean;
  @Output() closeModal: EventEmitter<string> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @ViewChild(DenouncedPersonListComponent, {static: false}) denouncedPersonList: DenouncedPersonListComponent;
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;
  userInfo: any;
  selectedSpp: any;

  lstPolices: LstPolices[]; // 02 - Công an
  lstPolicesChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  lstArmies: LstArmies[]; // 04 - Quân đội
  lstArmiesChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  lstCustoms: LstCustoms[]; // 06 - Hải quan
  lstCustomsChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  lstRangers: LstRangers[]; // 08 - Kiểm lâm
  lstRangersChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  lstBorderGuards: LstBorderGuards[]; // 09 - Bộ đội biên phòng
  lstBorderGuardsChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  // lstArmies: any[]; // 10 - Cảnh sát biển
  // lstArmies: any[]; // 12 - Cơ quan khác
  lstSpps: LstSpps[]; // SPP - Viện kiểm sát
  lstSppsChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  lstSpcs: LstSpcs[]; // SPC - Tòa án
  lstSpcsChange$: BehaviorSubject<string> = new BehaviorSubject(null);

  formDenouncement: FormGroup;
  police: any;
  lstPolicesAndPol = [];
  defaultIaHandlingOfficer: string;
  takenOverAgencies = [];
  denouncementSources = [];
  procurators = [];
  arrCollapse = [];
  accesses = Constant.ACCESSES;
  desAccessLevel: string;
  isSpinning: boolean;
  tmoList = [];
  theFirstClick: boolean;
  disabledEndDate = (dateValue: Date): boolean => {
    if (!dateValue) {
      return false;
    }
    const maxDate = new Date(2100, 1, 1).getTime();
    const minDate = new Date(1900, 1, 1).getTime();
    return (maxDate < dateValue.getTime() || minDate >= dateValue.getTime());

  };

  constructor(private fb: FormBuilder,
              private categoriesService: CategoriesService,
              private apParamService: ApParamService,
              private datePipe: DatePipe,
              private parsePipe: ParsePipe,
              private modalService: NzModalService,
              private denouncementService: DenouncementService,
              private notificationService: NzNotificationService,
              private constantService: ConstantService,
              private notification: NotificationService,
              private loaderService: LoaderService,
              private stringService: StringService
  ) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.selectedSpp = JSON.parse(localStorage.getItem(Constant.SPP));
    this.createFormControl();
    this.initParam();

    this.lstPolicesChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListPolice(value).subscribe(res => {
          this.lstPolices = res;
        });
      });

    this.lstArmiesChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListArmy(value).subscribe(res => {
          this.lstArmies = res;
        });
      });

    this.lstCustomsChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListCustoms(value).subscribe(res => {
          this.lstCustoms = res;
        });
      });

    this.lstRangersChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListRangers(value).subscribe(res => {
          this.lstRangers = res;
        });
      });

    this.lstBorderGuardsChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListBorderGuards(value).subscribe(res => {
          this.lstBorderGuards = res;
        });
      });

    this.lstSppsChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListVKS(value).subscribe(res => {
          this.lstSpps = res;
        });
      });

    this.lstSpcsChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListToaAn(value).subscribe(res => {
          this.lstSpcs = res;
        });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisibleAdd && this.isVisibleAdd) {
      this.theFirstClick = true;
      this.isSpinning = false;
      this.arrCollapse = [true, true, true, true];
      this.desAccessLevel = this.accesses.find(e => e.value === 0).des || '';
      this.getPoliceNameBySppId();
      this.getListInspector();
      this.formDenouncement.markAsPristine();
      this.formDenouncement.patchValue({
        takenOverAgencyCode: Constant.TAKEN_OVER_AGENCY_CQDT,
        crimeReportSource: Constant.DENOUNCEMENT_TYPE_NEW,
        iaHandlingUnit: this.defaultIaHandlingOfficer,
        iaHandlingUnitId: this.userInfo.sppid,
        takenOverOfficer: this.userInfo.userid,
        sppId: this.userInfo.sppid,
        shareInfoLevel: 0,
        takenOverDate: new Date(),
        settlementTerm: null,
        takenResultDate: null,
        iaAssignmentDate: new Date(),
        passignmentDate: new Date(),
        phandlingDate: new Date()
      })
      this.valueChange();
    }
  }

  valueChange() {
    this.iaHandlingUnitIdValueChange();
    this.dateOfBirthValueChange();
    // this.getDefaultLevelShareInfo();
    this.shareInfoLevelValueChange();
    this.pHandlingProsecutorIdValueChange();
  }

  initParam(): void {
    this.getListParam(Constant.TAKEN_OVER_AGENCY, 'takenOverAgencies');
    this.getListParam(Constant.DENOUNCEMENT_TYPE, 'denouncementSources');
  }

  getListParam(code, list): void {
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'dm/ApParam/getParams'
      , {
        code
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        this[list] = resJson.responseData;
      })
      .catch(err => {
        this.notificationService.error(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  getPoliceNameBySppId() {
    if (this.userInfo) {
      this.categoriesService.getPoliceNameBySppId(this.userInfo.sppid).subscribe(data => {
        this.defaultIaHandlingOfficer = data;
        this.lstPolicesAndPol = [{name: data, value: this.userInfo.sppid}];
        this.formDenouncement?.controls.iaHandlingUnit.setValue(data);
        this.formDenouncement?.controls.iaHandlingUnitId.setValue(this.userInfo.sppid);
        this.formDenouncement?.controls.sppId.setValue(this.userInfo.sppid);
      })
    }
  }

  getPoliceAndPol(value) {
    this.categoriesService.getListPoliceAndPolByName(value)
      .subscribe(res => {
        this.lstPolicesAndPol = res;
      });
  }

  getListInspector() {
    this.categoriesService.getListInspectorByPosition("KS").subscribe(next => {
      this.procurators = next;
    });
  }

  createFormControl() {
    this.formDenouncement = this.fb.group({
      id: [null],
      denouncementCode: [{value: null, disabled: true}],
      takenOverAgencyCode: [Constant.TAKEN_OVER_AGENCY_CQDT],
      takenOverDate: [new Date(), [Validators.required, CustomValidator.checkDateAndCurrentDate]],
      settlementTerm: [null, Validators.required],
      takenResultDate: [null, Validators.required],
      crimeReportSource: [Constant.DENOUNCEMENT_TYPE_NEW],
      complicatedCircumstance: false,
      takenOverOfficer: [this.userInfo.userid, Validators.maxLength(100)],
      officerPosition: [null, Validators.maxLength(100)],

      iaHandlingUnit: [null],
      iaHandlingUnitId: [this.userInfo.sppid || null],
      iaHandlingOfficer: [null, Validators.maxLength(100)],
      iaAssignmentDecisionNumber: [null, Validators.maxLength(100)],
      iaAssignmentDate: [new Date()],

      phandlingNumber: [null],
      phandlingDate: [new Date()],
      phandlingProsecutor: [null],
      phandlingProsecutorId: [null],
      passignmentDecisionNumber: [null, Validators.maxLength(100)],
      passignmentDate: [new Date()],

      rreporter: [null, [Validators.maxLength(200)]],
      rdateOfBirth: [null, [CustomValidator.checkDateAndCurrentDate]],
      ryearOfBirth: [null, [Validators.pattern(Constant.PATTERN_ONLY_NUMBER), Validators.maxLength(4)]],
      raddress: [null, [Validators.maxLength(500)]],
      rphoneNumber: [null, [Validators.pattern(Constant.PATTERN_ONLY_NUMBER), Validators.maxLength(20)]],
      rdelation: ['', [Validators.maxLength(3000), Validators.required]],
      rnote: [null, Validators.maxLength(1000)],
      rcccd: [null, [Validators.maxLength(12), Validators.minLength(9)]],

      shareInfoLevel: [0],
      sppId: [this.userInfo.sppid],
      denouncedPersonList: [],

      denouncementAgency: [null],
      denouncementUnitsId: [null],
      denouncementUnitsName: [null]
    });
  }

  handleOk(): void {
  }

  handleCancel(): void {
    this.closeModal.emit('close');
    this.resetPage();
  }

  resetPage() {
    this.formDenouncement.reset();
    this.formDenouncement.patchValue({
      takenOverAgencyCode: Constant.TAKEN_OVER_AGENCY_CQDT,
      crimeReportSource: Constant.DENOUNCEMENT_TYPE_NEW,
      iaHandlingUnit: this.defaultIaHandlingOfficer,
      iaHandlingUnitId: this.userInfo.sppid,
      takenOverOfficer: this.userInfo.userid,
      sppId: this.userInfo.sppid,
      shareInfoLevel: 0
    })
    this.getPoliceNameBySppId();
    this.closeModal.emit('save');
  }

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  validForm(): void {
    if (this.formDenouncement.invalid) {
      Object.keys(this.formDenouncement.controls).forEach(key => {
        this.formDenouncement.get(key).markAsDirty();
        this.formDenouncement.get(key).updateValueAndValidity();
      });
    }
    if (this.formDenouncement.get('rdateOfBirth').value && !this.formDenouncement.get('ryearOfBirth').value) {
      const year = new Date(this.formDenouncement.get('rdateOfBirth').value).getFullYear();
      this.formDenouncement.get('ryearOfBirth').setValue(year);
    }
    if (this.formDenouncement.get('ryearOfBirth').value && !this.formDenouncement.get('rdateOfBirth').value) {
      this.formDenouncement.get('rdateOfBirth').setValue(this.convertYearToDate(this.formDenouncement.get('ryearOfBirth').value));
    }
    const takenResultDate = this.formDenouncement.get('takenResultDate').value;
    const settleDate = this.formDenouncement.get('settlementTerm').value;
    if (takenResultDate && settleDate) {
      const invalidDate = (DateUtils.compareDate(new Date(takenResultDate), new Date(settleDate)) > 0);
      const settlementTermErr = this.formDenouncement.get('settlementTerm').errors;
      this.formDenouncement.get('settlementTerm').setErrors(invalidDate ? {
        ...settlementTermErr,
        invalidSettleDate: true
      } : null);
    }
    // if (!this.formDenouncement.get('rdelation').value) {
    //   const rdelationErr = this.formDenouncement.get('rdelation').errors;
    //   const err = (this.formDenouncement.get('crimeReportSource').value == 2 || this.formDenouncement.get('crimeReportSource').value == 3);
    //   this.formDenouncement.get('rdelation').setErrors(err ? {...rdelationErr, rdelationErr: true} : null);
    // }
    this.formDenouncement.updateValueAndValidity();
  }

  onSearch(e) {
    // chặn lần click đầu tiên search empty
    if (this.theFirstClick) {
      e = this.defaultIaHandlingOfficer;
      this.theFirstClick = false;
    }
    this.getPoliceAndPol(e);
  }

  shareInfoLevelValueChange() {
    const shareInfoLevelControl = this.formDenouncement.get('shareInfoLevel');
    shareInfoLevelControl.valueChanges.subscribe(
      value => {
        this.desAccessLevel = this.accesses.find(e => e.value === value)?.des || '';
      }
    )
  }

  pHandlingProsecutorIdValueChange() {
    const pHandlingProsecutorIdControl = this.formDenouncement.get('phandlingProsecutorId');
    pHandlingProsecutorIdControl.valueChanges.subscribe(
      value => {
        const procuratorName = this.procurators.find(e => e.inspCode === value)?.fullName || '';
        this.formDenouncement.get('phandlingProsecutor').setValue(procuratorName);
      }
    )
  }

  dateOfBirthValueChange() {
    this.getControl('rdateOfBirth').valueChanges.subscribe(
      value => {
        if (value && this.getControl('ryearOfBirth').value !== value.getFullYear()) {
          this.getControl('ryearOfBirth').setValue(value.getFullYear());
        }
      }
    )
  }

  dateOfYearValueChange(e) {
    if (e && !isNaN(e) && this.getControl('ryearOfBirth').valid) {
      this.getControl('rdateOfBirth').setValue(this.convertYearToDate(e));
    }
  }

  iaHandlingUnitIdValueChange() {
    this.getControl('iaHandlingUnitId').valueChanges.subscribe(
      value => {
        this.getControl('iaHandlingUnit').setValue(
          this.lstPolicesAndPol.find(e => e.value === value)?.name
        );
      }
    )
  }

  convertYearToDate(year: number) {
    return this.stringToDate(`31/12/${year}`);
  }

  getControl(controlName) {
    if (this.formDenouncement) {
      return this.formDenouncement.controls[controlName];
    }
  }

  hasError(controlName: string, errorName: string) {
    if (this.formDenouncement && this.formDenouncement.controls[controlName]) {
      return this.getControl(controlName).invalid &&
        (this.getControl(controlName).touched || this.getControl(controlName).dirty) &&
        this.getControl(controlName).hasError(errorName);
    }
  }

  onSubmitForm() {
    this.loaderService.show();
    this.validForm();
    if (this.formDenouncement.invalid) {
      return;
    }
    this.showConfirmSave();
  }

  dateToString(date: Date | string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  /*
   * Convert Model Date To String
   */
  formToDenounceDenouncedPersonList(): DenouncedPersonModel[] {
    // copy array
    const data: DenouncedPersonModel[] =
      JSON.parse(JSON.stringify(this.denouncedPersonList?.getActualPersonList()));
    if (data instanceof Array) {
      for (const obj of data) {
        obj.dateOfBirth = obj.dateOfBirth ? this.dateToString(obj.dateOfBirth) : null;
      }
    }
    return data;
  }

  saveData(): any {
    this.isSpinning = true;
    const objToSubmit = this.formDenouncement.value;
    for (const prop in objToSubmit) {
      if (objToSubmit.hasOwnProperty(prop) && objToSubmit[prop] && typeof objToSubmit[prop] === 'string') {
        objToSubmit[prop] = objToSubmit[prop]?.trim();
      }
    }

    if (!this.getControl('iaHandlingUnitId').value) {
      this.getControl('iaHandlingUnit').setValue(null);
    }

    const data: DenouncementModel = {
      takenOverAgencyCode: this.formDenouncement.get('takenOverAgencyCode').value,
      takenOverDate: this.formDenouncement.get('takenOverDate').value ?
        this.dateToString(this.formDenouncement.get('takenOverDate').value) : null,
      takenResultDate: this.formDenouncement.get('takenResultDate').value ?
        this.dateToString(this.formDenouncement.get('takenResultDate').value) : null,
      settlementTerm: this.formDenouncement.get('settlementTerm').value ?
        this.dateToString(this.formDenouncement.get('settlementTerm').value) : null,
      crimeReportSource: this.formDenouncement.get('crimeReportSource').value,
      complicatedCircumstance: this.formDenouncement.get('complicatedCircumstance').value,
      takenOverOfficer:this.stringService.capitalize(this.formDenouncement.get('takenOverOfficer').value),
      officerPosition: this.formDenouncement.get('officerPosition').value,

      iaHandlingUnit: this.formDenouncement.get('iaHandlingUnit').value,
      iaHandlingUnitId: this.formDenouncement.get('iaHandlingUnitId').value,
      iaHandlingOfficer: this.stringService.capitalize(this.formDenouncement.get('iaHandlingOfficer').value),
      iaAssignmentDecisionNumber: this.formDenouncement.get('iaAssignmentDecisionNumber').value,
      iaAssignmentDate: this.formDenouncement.get('iaAssignmentDate').value ?
        this.dateToString(this.formDenouncement.get('iaAssignmentDate').value) : null,

      phandlingNumber: this.formDenouncement.get('phandlingNumber').value,
      phandlingDate: this.formDenouncement.get('phandlingDate').value ?
        this.dateToString(this.formDenouncement.get('phandlingDate').value) : null,
      phandlingProsecutor: this.formDenouncement.get('phandlingProsecutor').value,
      phandlingProsecutorId: this.formDenouncement.get('phandlingProsecutorId').value?.toString(),
      passignmentDecisionNumber: this.formDenouncement.get('passignmentDecisionNumber').value,
      passignmentDate: this.formDenouncement.get('passignmentDate').value ?
        this.dateToString(this.formDenouncement.get('passignmentDate').value) : null,

      rreporter: this.stringService.capitalize(this.formDenouncement.get('rreporter').value),
      rdateOfBirth: this.formDenouncement.get('rdateOfBirth').value ?
        this.dateToString(this.formDenouncement.get('rdateOfBirth').value) : null,
      ryearOfBirth: this.formDenouncement.get('ryearOfBirth').value,
      raddress: this.formDenouncement.get('raddress').value,
      rphoneNumber: this.formDenouncement.get('rphoneNumber').value,
      rdelation: this.formDenouncement.get('rdelation').value,
      rnote: this.formDenouncement.get('rnote').value,
      rcccd: this.formDenouncement.get('rcccd').value,
      shareInfoLevel: this.formDenouncement.get('shareInfoLevel').value,
      sppId: this.formDenouncement.get('sppId').value,
      denounceDenouncedPersonList: this.formToDenounceDenouncedPersonList(),
      status: GeneralModelStatus.ACTIVE,
      denouncementAgency: this.formDenouncement.get('denouncementAgency').value,
      denouncementUnitsId: this.getDenouncementUnitsId(),
      denouncementUnitsName: this.getDenouncementUnitsName()
    };
    setTimeout(() => {
      /*
       * Gọi API để lưu dữ liệu
       */
      this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/create',
        data).toPromise().then(resp => resp.json())
        .then((resp: ResponseBody) => {
            if (resp.responseCode === '0000') {
              this.resetPage();
              this.notificationService.success('Thêm mới dữ liệu thành công', null)
              this.isSpinning = false;
              this.tmoList = [...this.tmoList];
            } else {
              this.notificationService.error('Lỗi: ', resp.responseMessage);
            }
          }, err => this.notificationService.error('Lỗi', err)
        );
    }, 500);
  }

  checkDateOfBirth() {
    // use object.assign() to avoid isNaN() function modifying the original value
    const yearOfBirth = Object.assign({}, this.getControl('ryearOfBirth').value);
    const dateOfBirth = this.getControl('rdateOfBirth').value;
    if (!dateOfBirth && (!yearOfBirth || isNaN(yearOfBirth))) {
      return;
    }
    if (!isNaN(yearOfBirth)) {
      this.getControl('ryearOfBirth').setValue(Number(yearOfBirth));
    }

    if (dateOfBirth && isNaN(yearOfBirth)) {
      this.getControl('ryearOfBirth').setValue(dateOfBirth.getFullYear());
    } else if (!dateOfBirth && !isNaN(yearOfBirth)) {
      this.getControl('rdateOfBirth').setValue(this.convertYearToDate(yearOfBirth));
    }
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

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  stringToDate(date: string): Date {
    return this.parsePipe.transform(date, 'DD/MM/YYYY').toDate();
  }

  onDateValueChange(event: any, formControl: AbstractControl): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.error('Lỗi: ', 'Sai định dạng ngày tháng dd/MM/yyyy.');
        formControl.setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.error('Lỗi: ', 'Ngày tháng không hợp lệ.');
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

  get denouncementAgency(): AbstractControl {
    return this.formDenouncement.get('denouncementAgency');
  }

  get denouncementUnitsId(): AbstractControl {
    return this.formDenouncement.get('denouncementUnitsId');
  }

  getDenouncementUnitsName(): string {
    if (this.denouncementAgency.value === 'SPP') {
      return this.denouncementUnitsId?.value?.name;
    } else if (this.denouncementAgency.value === '10') {
      return 'Cảnh sát biển';
    } else if (this.denouncementAgency.value === '12') {
      return 'Cơ quan khác';
    } else {
      return this.denouncementUnitsId.value ? this.denouncementUnitsId.value.NAME : null;
    }
  }

  getDenouncementUnitsId(): string {
    if (this.denouncementUnitsId.value) {
      switch (this.denouncementAgency.value) {
        case '02':
          return this.denouncementUnitsId.value.POLICEID;
        case '04':
          return this.denouncementUnitsId.value.ARMYID;
        case '06':
          return this.denouncementUnitsId.value.CUSTOMID;
        case '08':
          return this.denouncementUnitsId.value.RANGID;
        case '09':
          return this.denouncementUnitsId.value.BORGUAID;
        case '10':
        case '12':
          return this.denouncementAgency.value;
        case 'SPC':
          return this.denouncementUnitsId.value.SPCID;
        case 'SPP':
          return this.denouncementUnitsId.value.sppid;
      }
    }
  }

  denouncementAgencyChange(value: string): void {
    this.isSpinning = true;
    this.resetParam();
    if (value) {
      switch (value) {
        case '02':
          this.categoriesService.getListPolice(' ').subscribe(res => {
            this.lstPolices = res;
            this.isSpinning = false;
          });
          break;
        case '04':
          this.categoriesService.getListArmy('0').subscribe(res => {
            this.lstArmies = res;
            this.isSpinning = false;
          });
          break;
        case '06':
          this.categoriesService.getListCustoms('0').subscribe(res => {
            this.lstCustoms = res;
            this.isSpinning = false;
          });
          break;
        case '08':
          this.categoriesService.getListRangers('0').subscribe(res => {
            this.lstRangers = res;
            this.isSpinning = false;
          });
          break;
        case '09':
          this.categoriesService.getListBorderGuards('0').subscribe(res => {
            this.lstBorderGuards = res;
            this.isSpinning = false;
          });
          break;
        case '10':
        case '12':
          this.formDenouncement.get('denouncementUnitsId').clearValidators();
          this.formDenouncement.get('denouncementUnitsId').updateValueAndValidity();
          this.isSpinning = false;
          break;
        case 'SPP':
          this.categoriesService.getListVKS(' ').subscribe(res => {
            this.lstSpps = res;
            this.isSpinning = false;
          });
          break;
        case 'SPC':
          this.categoriesService.getListToaAn(' ').subscribe(res => {
            this.lstSpcs = res;
            this.isSpinning = false;
          });
          break;
      }
    } else {
      this.isSpinning = false;
    }
  }

  resetParam(): void {
    this.lstPolices = [];
    this.lstArmies = [];
    this.lstCustoms = [];
    this.lstRangers = [];
    this.lstBorderGuards = [];
    this.lstSpps = [];
    this.lstSpcs = [];
    this.denouncementUnitsId.setValue(null);
  }

  onFocusDenouncementUnitsId(e: any) {
    if (!this.denouncementAgency.value) {
      this.notification.showNotification(Constant.ERROR, 'Yêu cầu chọn Cơ quan vi phạm trước');
    }
  }

  onInputPolice(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstPolices = [];
    } else {
      this.categoriesService.getListPolice(value
      ).subscribe(res => {
        this.lstPolices = res;
        this.isSpinning = false;
      });
      // this.lstPolicesChange$.next(value);
    }
  }

  onInputArmy(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstArmies = [];
    } else {
      this.categoriesService.getListArmy(value
      ).subscribe(res => {
        this.lstArmies = res;
        this.isSpinning = false;
      });
      // this.lstArmiesChange$.next(value);
    }
  }

  onInputCustoms(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstCustoms = [];
    } else {
      this.categoriesService.getListCustoms(value
      ).subscribe(res => {
        this.lstCustoms = res;
        this.isSpinning = false;
      });
      // this.lstCustomsChange$.next(value);
    }
  }

  onInputRangers(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstRangers = [];
    } else {
      this.categoriesService.getListRangers(value
      ).subscribe(res => {
        this.lstRangers = res;
        this.isSpinning = false;
      });
      // this.lstRangersChange$.next(value);
    }
  }

  onInputBorderGuards(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstBorderGuards = [];
    } else {
      this.categoriesService.getListBorderGuards(value
      ).subscribe(res => {
        this.lstBorderGuards = res;
        this.isSpinning = false;
      });
      // this.lstBorderGuardsChange$.next(value);
    }
  }

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpps = [];
    } else {
      this.categoriesService.getListVKS(value
      ).subscribe(res => {
        this.lstSpps = res;
        this.isSpinning = false;
      });
      // this.lstSppsChange$.next(value);
    }
  }

  onInputSpc(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpcs = [];
    } else {
      this.categoriesService.getListToaAn(value
      ).subscribe(res => {
        this.lstSpcs = res;
        this.isSpinning = false;
      });
      // this.lstSppsChange$.next(value);
    }
  }

  convertCccd() {
    const ex = this.formDenouncement.get('rcccd').value;
    const newC = ex.replace(/[a-z]+/img, '');
    return this.formDenouncement.get('rcccd').setValue(newC);
  }

  changeSettlementTerm(e) {
    this.formDenouncement.get('settlementTerm').setValue('');
    const date = new Date(this.formDenouncement.get('takenResultDate').value), y = date.getFullYear(),
      m = date.getMonth(), d = date.getDate();
    if (e) {
      const newDate = new Date(y, m + 4, d);
      return this.formDenouncement.get('settlementTerm').setValue(newDate);
    }
  }
}
