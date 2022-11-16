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
import {CategoriesService} from '../../../../service/categories.service';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../shared/constants/constant.class';
import {DenouncedPersonListComponent} from '../denounced-person/denounced-person-list/denounced-person-list.component';
import {DatePipe} from '@angular/common';
import {CustomValidator} from '../../../../shared/custom-validator/custom-validator.class';
import {ApParamService} from '../../../../service/apparam.service';
import {DenouncementService} from '../../../../service/denouncement.service';
import {LoaderService} from '../../../../service/loader.service';
import {DenouncementModel} from '../../../../model/denouncement.model';
import {VerificationInvestigationListComponent} from '../verification-investigation/verification-investigation-list/verification-investigation-list.component';
import {SettlementDecisionListComponent} from '../settlement-decision/settlement-decision-list/settlement-decision-list.component';
import {InvestigationActivityListComponent} from '../investigation-activity/investigation-activity-list/investigation-activity-list.component';
import {NotificationService} from '../../../../service/notification.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {DateUtils} from '../../../../shared/utils/date-utils.class';
import {Code} from '../../../../model/code';
import {ConstantService} from '../../../../service/constant.service';
import {Law} from '../../../so-thu-ly/model/so-thu-ly.model';
import {ResponseBody} from '../../../so-thu-ly/model/response-body';
import {ParsePipe} from 'ngx-moment';
import {VerificationInvestigationModel} from '../../../../model/verification-investigation.model';
import {InvestigationActivityModel} from '../../../../model/investigation-activity.model';
import {SettlementDecisionModel} from '../../../../model/settlement-decision.model';
import {DenouncedPersonModel} from '../../../../model/denounced-person.model';
import * as moment from 'moment';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {GeneralService} from '../../../../service/general-service';
import {WebUtilities} from '../../../../shared/utils/qla-utils.class';

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
  selector: 'app-denouncement-update',
  templateUrl: './denouncement-update.component.html',
  styleUrls: ['./denouncement-update.component.scss']
})
export class DenouncementUpdateComponent implements OnInit, OnChanges {
  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.VIEW;
  @Input() denouncementId: number;
  @Input() isVisibleUpdate: boolean;
  @Output() closeModal: EventEmitter<string> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @ViewChild(DenouncedPersonListComponent, {static: false})
  denouncedPersonListComponent: DenouncedPersonListComponent;
  @ViewChild(VerificationInvestigationListComponent, {static: false})
  verificationInvestigationListComponent: VerificationInvestigationListComponent;
  @ViewChild(SettlementDecisionListComponent, {static: false})
  settlementDecisionListComponent: SettlementDecisionListComponent;
  @ViewChild(InvestigationActivityListComponent, {static: false})
  investigationActivityListComponent: InvestigationActivityListComponent;
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;

  userInfo: any;
  denouncement: DenouncementModel;
  denouncementForm: FormGroup;
  police: any;
  lstPolicesAndPol = [];
  lstIpnPolices = [];
  lstSpp = [];
  fnTakenLstSpp = [];
  fnTakenLstPolices = [];
  fnTakenLstPol = [];
  lstLaws: Law[] = [];
  ipnClassifiedNews = [];
  defaultIaHandlingOfficer: string;
  takenOverAgencies = [];
  denouncementSources = [];
  ipnSettlementAgencies = [];
  fnTakenOverAgencies = [];
  decisionAgencies = [];
  investigationActivityType = [];
  denouncementProcessType = [];
  arrCollapse = [];
  accesses = Constant.ACCESSES;
  desAccessLevel: string;
  sppName: string;
  classifiedNews: Observable<number>;
  listGroupLawCode: Code[] = [];
  groupLawCode: string = null;
  procurators: any[] = [];

  titleName: string;
  confirmModalRef: NzModalRef<any>;
  selectedCodeId: string = null;

  unitsId: string;
  unitsName: string;
  selectedSpp: any;
  isSpinning: boolean;

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

  constructor(private fb: FormBuilder,
              private categoriesService: CategoriesService,
              private apParamService: ApParamService,
              private datePipe: DatePipe,
              private parsePipe: ParsePipe,
              private modalService: NzModalService,
              private denouncementService: DenouncementService,
              private loaderService: LoaderService,
              private notificationService: NzNotificationService,
              private notification: NotificationService,
              private constantService: ConstantService,
              private generalService: GeneralService
  ) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.selectedSpp = JSON.parse(localStorage.getItem(Constant.SPP));
    this.initComboBox();
    this.initFormControl();
    this.categoriesService.getListInspectorByPosition('KS').subscribe(next => {
      this.procurators = next;
    }, error => {
      console.error(error);
    });
    this.arrCollapse = [true, true, true, true, true, true];
    this.desAccessLevel = this.accesses.find(e => e.value === 0).des || '';
    this.getPoliceNameBySppId();
    this.getNameSppOfUserLogged();
    this.valueChange();
    this.getBoLuatByStatus();
  }

  valueChange(): void {
    this.pHandlingProsecutorIdValueChange();
    this.shareInfoLevelValueChange();
    this.onChangeIpnSettlementAgencyValue();
    this.dateOfBirthValueChange();
    this.ipnEnactmentValueChange();
    this.fnTakenOverAgencyValueChange();
  }

  initComboBox(): void {
    this.getListParam(Constant.TAKEN_OVER_AGENCY, 'takenOverAgencies');
    this.getListParam(Constant.DENOUNCEMENT_TYPE, 'denouncementSources');
    this.getListParam(Constant.IPN_SETTLEMENT_AGENCY, 'ipnSettlementAgencies');
    this.getListParam(Constant.IPN_CLASSIFIED_NEWS, 'ipnClassifiedNews');
    this.getListParam(Constant.FN_TAKEN_OVER_AGENCY, 'fnTakenOverAgencies');
    this.getListParam(Constant.DECISION_MAKING_AGENCY, 'decisionAgencies');
    this.getListParam(Constant.INVESTIGATION_ACTIVITY_TYPE, 'investigationActivityType');
    this.getListParam(Constant.DENOUNCEMENT_PROCESS_TYPE, 'denouncementProcessType');
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
        this.denouncementForm?.controls.iaHandlingUnit.setValue(data);
        this.denouncementForm?.controls.sppCode.setValue(this.userInfo.sppid);
      });
    }
  }

  getPolAndPolice(value, list) {
    this.categoriesService.getListPoliceAndPolByName(value)
      .subscribe(res => {
        this[list] = res;
      });
  }

  getLaws(name: string) {
    if (this.groupLawCode != null) {
      const search = {
        LawName: name,
        sortField: 'lawId',
        sortOrder: 'ESC',
        codeId: this.groupLawCode,
        size: 20
      };
      this.categoriesService.getListLaw(search).subscribe(res => {
        this.lstLaws = res?.datas || [];
      });
    }
  }

  getNameSppOfUserLogged() {
    this.categoriesService.getNameBySppId(this.userInfo.sppid).subscribe(res => {
      this.sppName = res;
    });
  }

  initFormControl(): void {
    this.denouncementForm = this.fb.group({
      id: [null],
      denouncementCode: [{value: null, disabled: true}],
      takenOverAgencyCode: [Constant.TAKEN_OVER_AGENCY_CQDT],
      takenOverDate: [null, [Validators.required, CustomValidator.checkDateAndCurrentDate]],
      settlementTerm: [null, Validators.required],
      takenResultDate: [null, Validators.required],
      crimeReportSource: [Constant.DENOUNCEMENT_TYPE_NEW],
      complicatedCircumstance: false,
      takenOverOfficer: [this.userInfo.userid, [Validators.required, Validators.maxLength(100)]],
      officerPosition: [null, [Validators.maxLength(100)]],

      iaHandlingUnit: [this.defaultIaHandlingOfficer || null],
      iaHandlingUnitId: [null],
      iaHandlingOfficer: [null, [Validators.maxLength(100)]],
      iaAssignmentDecisionNumber: [null, [Validators.maxLength(100)]],
      iaAssignmentDate: [null],

      phandlingNumber: [null],
      phandlingDate: [null],
      phandlingProsecutor: [null],
      phandlingProsecutorId: [null],
      passignmentDecisionNumber: [null, [Validators.maxLength(100)]],
      passignmentDate: [null],

      rreporter: [null, [Validators.maxLength(200)]],
      rdateOfBirth: [null],
      ryearOfBirth: [null, [Validators.pattern(Constant.PATTERN_ONLY_NUMBER), Validators.maxLength(4)]],
      raddress: [null, [Validators.maxLength(500)]],
      rphoneNumber: [null, [Validators.maxLength(20)]],
      rdelation: ['', [Validators.maxLength(3000), Validators.required]],
      rnote: [null, [Validators.maxLength(1000)]],
      rcccd: [null, [Validators.maxLength(12), Validators.minLength(9)]],

      ipnSettlementAgency: [Constant.TAKEN_OVER_AGENCY_CQDT],
      ipnSettlementUnit: [null],
      ipnSettlementUnitId: [null],
      ipnClassifiedNews: [null, Validators.required],
      ipnEnactment: [null],
      ipnEnactmentTemp: [null],
      ipnEnactmentId: [null],
      ipnLawClause: [{value: null, disabled: true}],
      ipnLawPoint: [{value: null, disabled: true}],

      fnCode: [null, [Validators.maxLength(20)]],
      fnDate: [null],
      fnTakenOverAgency: [null],
      fnTakenOverUnit: [null],
      fnNote: [null, [Validators.maxLength(1000)]],

      shareInfoLevel: [0],
      sppCode: [],
      denouncedPersonList: [],

      corruptionCrime: [false],
      economicCrime: [false],
      otherCrime: [false],
      codeIdFormControlName: [null],
      denouncementAgency: [null],
      denouncementUnitsId: [null],
      denouncementUnitsName: [null]
    });
    this.classifiedNews = this.denouncementForm.get('ipnClassifiedNews').valueChanges;
  }

  handleCancel(): void {
    this.closeModal.emit('close');
    this.clearForm();
  }

  clearForm(): void {
    this.denouncementForm.reset();
    this.denouncementForm.patchValue({
      takenOverAgencyCode: Constant.TAKEN_OVER_AGENCY_CQDT,
      crimeReportSource: Constant.DENOUNCEMENT_TYPE_NEW,
      iaHandlingUnit: this.defaultIaHandlingOfficer || null,
      takenOverOfficer: this.userInfo.userid,
      fnDate: new Date()
    });
  }

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  validForm(): void {
    if (this.denouncementForm.invalid) {
      Object.keys(this.denouncementForm.controls).forEach(key => {
        this.denouncementForm.get(key).markAsDirty();
        this.denouncementForm.get(key).updateValueAndValidity();
      });
    }

    if (this.denouncementForm.get('rdateOfBirth').value && !this.denouncementForm.get('ryearOfBirth').value) {
      const year = new Date(this.denouncementForm.get('rdateOfBirth').value).getFullYear();
      this.denouncementForm.get('ryearOfBirth').setValue(year);
    }
    if (this.denouncementForm.get('ryearOfBirth').value && !this.denouncementForm.get('rdateOfBirth').value) {
      this.denouncementForm.get('rdateOfBirth').setValue(this.convertYearToDate(this.denouncementForm.get('ryearOfBirth').value));
    }

    const takenResultDate = this.denouncementForm.get('takenResultDate').value;
    const settleDate = this.denouncementForm.get('settlementTerm').value;
    if (takenResultDate && settleDate) {
      const invalidDate = (DateUtils.compareDate(new Date(takenResultDate), new Date(settleDate)) > 0);
      this.denouncementForm.get('settlementTerm').setErrors(invalidDate ? {invalidSettleDate: true} : null);
    }

    // if (!this.denouncementForm.get('rdelation').value) {
    //   const rdelationErr = this.denouncementForm.get('rdelation').errors;
    //   const err = (this.denouncementForm.get('crimeReportSource').value == 2 || this.denouncementForm.get('crimeReportSource').value == 3);
    //   this.denouncementForm.get('rdelation').setErrors(err ? {...rdelationErr, rdelationErr: true} : null);
    // }
    this.denouncementForm.updateValueAndValidity();
  }

  onSearch(e, list) {
    this.getPolAndPolice(e, list);
  }

  onSearchLaw(e) {
    this.getLaws(e);
  }

  onSearchSpp(e) {
    this.categoriesService.getSppSelect({name: e, page: 0}).subscribe(res => {
      this.lstSpp = res?.datas || [];
    });
  }

  onCodeIdChange(value: any, flag = false): void {
    if (value) {
      this.lstLaws = [];
      this.groupLawCode = value;
      this.getLaws('');
    }
  }

  onSearchTakenOverAgency(name, takenOverAgency) {
    const search = {
      name,
      page: 0
    };
    switch (takenOverAgency) {
      case '1':
        this.categoriesService.getPoliceSelect(search).subscribe(res => {
          this.fnTakenLstPolices = res.datas;
        });
        break;
      case '2':
        this.categoriesService.getSPCSelect(search).subscribe(res => {
          this.fnTakenLstPol = res.datas;
        });
        break;
      case '3':
        this.categoriesService.getSppSelect(search).subscribe(res => {
          this.fnTakenLstSpp = res.datas;
        });
        break;
      default:
        break;
    }
  }

  pHandlingProsecutorIdValueChange() {
    const pHandlingProsecutorIdControl = this.denouncementForm.get('phandlingProsecutorId');
    pHandlingProsecutorIdControl.valueChanges.subscribe(
      value => {
        const procuratorName = this.procurators.find(e => e.inspCode === value)?.fullName || '';
        this.denouncementForm.get('phandlingProsecutor').setValue(procuratorName);
      }
    );
  }

  shareInfoLevelValueChange() {
    const shareInfoLevelControl = this.denouncementForm.get('shareInfoLevel');
    shareInfoLevelControl.valueChanges.subscribe(
      value => {
        this.desAccessLevel = this.accesses.find(e => e.value === value)?.des || '';
      }
    );
  }

  dateOfBirthValueChange() {
    this.getControl('rdateOfBirth').valueChanges.subscribe(
      value => {
        const year = new Date(value).getFullYear();
        if (value && this.getControl('ryearOfBirth').value !== year) {
          this.getControl('ryearOfBirth').setValue(year);
        }
      }
    );
  }

  ipnEnactmentValueChange() {
    // update them nhiu dieu luat => khong can thiet
    // this.getControl('ipnEnactmentId').valueChanges.subscribe(
    //   value => {
    //     // const lstId = value.split(',')
    //     const law = this.lstLaws.find(e => e.lawCode === value);
    //     if (law) {
    //       this.getControl('ipnEnactment').setValue(law.lawName);
    //       this.getControl('ipnLawClause').setValue(law.item);
    //       this.getControl('ipnLawPoint').setValue(law.point);
    //     } else {
    //       this.getControl('ipnEnactment').setValue(null);
    //       this.getControl('ipnLawClause').setValue(null);
    //       this.getControl('ipnLawPoint').setValue(null);
    //     }
    //   }
    // );
  }

  dateOfYearValueChange(e) {
    if (e && !isNaN(e) && this.getControl('ryearOfBirth').valid) {
      this.getControl('rdateOfBirth').setValue(this.convertYearToDate(e));
    }
  }

  convertYearToDate(year: number) {
    return this.stringToDate(`31/12/${year}`);
  }

  fnTakenOverAgencyValueChange() {
    this.getControl('fnTakenOverAgency').valueChanges.subscribe(
      value => {
        this.onSearchTakenOverAgency('', value);
      }
    );
  }

  onChangeIpnSettlementAgencyValue() {
    this.getControl('ipnSettlementAgency').valueChanges.subscribe(
      (value) => {
        if (value === 'VKS') {
          this.lstSpp = [{value: this.userInfo.sppid, name: this.sppName}];
          this.getControl('ipnSettlementUnitId').setValue(this.userInfo.sppid);
          this.getControl('ipnSettlementUnit').setValue(this.sppName);
        } else {
          if (this.denouncement && this.denouncement.iaHandlingUnitId) {
            this.getControl('ipnSettlementUnitId').setValue(this.denouncement.iaHandlingUnitId);
            this.getControl('ipnSettlementUnit').setValue(this.denouncement.iaHandlingUnit);
          } else {
            this.getPolAndPolice('', 'lstIpnPolices');
            this.getControl('ipnSettlementUnitId').setValue(null);
            this.getControl('ipnSettlementUnit').setValue(null);
          }
        }
      }
    );
  }

  hasError(controlName: string, errorName: string) {
    if (this.denouncementForm && this.denouncementForm.controls[controlName]) {
      return this.getControl(controlName).invalid &&
        (this.getControl(controlName).touched || this.getControl(controlName).dirty) &&
        this.getControl(controlName).hasError(errorName);
    }
  }

  onSubmitForm() {
    this.validForm();
    if (this.denouncementForm.invalid) {
      return;
    }
    this.showConfirmSave();
  }

  saveData() {
    const objDenouncementModel: DenouncementModel = this.convertFormToDenouncement(this.denouncementForm.value);
    const objToSubmit: DenouncementModel = {...this.denouncement, ...objDenouncementModel};
    for (const prop in objToSubmit) {
      if (objToSubmit.hasOwnProperty(prop) && objToSubmit[prop] && typeof objToSubmit[prop] === 'string') {
        objToSubmit[prop] = objToSubmit[prop]?.trim();
      }
    }
    switch (objToSubmit.ipnClassifiedNews) {
      case '1':
      case '3':
        objToSubmit.denounceDenouncedPersonList = this.formToDenounceDenouncedPersonList();
        objToSubmit.verificationInvestigationList = this.formToVerificationInvestigationList();
        objToSubmit.settlementDecisionList = this.formToSettlementDecisionList();
        objToSubmit.settlementDecisionList?.forEach((obj, index) => {
          obj.executeOrder = index;
        });
        objToSubmit.investigationActivityList = this.formToInvestigationActivityList();
        break;
      case '2':
        objToSubmit.denounceDenouncedPersonList = this.formToDenounceDenouncedPersonList();
        objToSubmit.verificationInvestigationList = this.formToVerificationInvestigationList();
        objToSubmit.settlementDecisionList = this.formToSettlementDecisionList();
        objToSubmit.settlementDecisionList?.forEach((obj, index) => {
          obj.executeOrder = index;
        });
        objToSubmit.investigationActivityList = this.formToInvestigationActivityList();
        break;
    }
    objToSubmit.status = GeneralModelStatus.ACTIVE;
    setTimeout(() => {
      this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/update',
        objToSubmit).toPromise().then(resp => resp.json())
        .then((resp: ResponseBody) => {
          if (resp.responseCode === '0000') {
            this.clearForm();
            this.notificationService.success('Cập nhật tin báo thành công', null);
            this.closeModal.emit('save');
          } else {
            this.notificationService.error('Lỗi', resp.responseMessage);
          }
        }, err => this.notificationService.error('Lỗi', err));
    }, 500);
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

  getSelectBoxList() {
    this.getPolAndPolice('', 'lstIpnPolices');
    if (this.denouncement.ipnEnactmentId && this.denouncement.ipnEnactmentId.length > 0) {
      const laws = [];
      for (let i = 0; i < this.denouncement.ipnEnactmentId.length; i++) {
        let label = 'Điều ' + this.denouncement.law[i].lawId;
        if (this.denouncement.law[i].item) {
          label += ', Khoản ' + this.denouncement.law[i].item;
        }
        if (this.denouncement.law[i].point) {
          label += ', Điểm ' + this.denouncement.law[i].point;
        }
        laws.push({
          lawCode: this.denouncement.ipnEnactmentId[i],
          label: label + ' - ' + this.denouncement.law[i].lawName,
          item: this.denouncement.law[i].item,
          point: this.denouncement.law[i].point,
        });
      }
      this.lstLaws = laws;
    }
    if (this.denouncement.ipnSettlementUnit && this.denouncement.ipnSettlementUnitId) {
      this.lstIpnPolices = [{value: this.denouncement.ipnSettlementUnitId, name: this.denouncement.ipnSettlementUnit}];
    }

    if (this.denouncement.iaHandlingUnitId && this.denouncement.iaHandlingUnit) {
      this.lstPolicesAndPol = [{value: this.denouncement.iaHandlingUnitId, name: this.denouncement.iaHandlingUnit}];
    }
    this.getCodeIdSelected();
  }

  getCodeIdSelected() {
    if (this.denouncement.ipnEnactmentId && this.denouncement.ipnEnactmentId.length > 0) {
      const getByLawCode = this.denouncement.ipnEnactmentId[0];
      this.categoriesService.getLawByLawCode(getByLawCode).subscribe((result: any) => {
        this.selectedCodeId = result?.CODEID;
      });
    }
  }

  dataChange() {
    this.getSelectBoxList();
    if (!this.denouncement.ipnSettlementAgency) {
      this.denouncement.ipnSettlementAgency = Constant.TAKEN_OVER_AGENCY_CQDT;
    }
    if (this.denouncement.ipnSettlementAgency === 'CQĐT' && !this.denouncement.ipnSettlementUnit &&
      this.denouncement.iaHandlingUnitId != null) {
      this.denouncement.ipnSettlementUnit = this.denouncement.iaHandlingUnit;
    }

    if (!this.denouncement.ipnClassifiedNews) {
      this.denouncement.ipnClassifiedNews = '1';
    }

    if (!this.denouncement.fnTakenOverAgency) {
      this.denouncement.fnTakenOverAgency = '1';
    } else {
      this.denouncement.fnTakenOverAgency = this.denouncement.fnTakenOverAgency.toString();
    }
  }

  getControl(controlName) {
    return this.denouncementForm.controls[controlName];
  }

  stringToDate(date: Date | string): Date {
    return this.parsePipe.transform(date, 'DD/MM/YYYY').toDate();
  }

  dateToString(date: Date | string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  /*
   * Convert Model String To Date
   */
  denounceDenouncedPersonList(denounceDenouncedPerson: DenouncedPersonModel[]): DenouncedPersonModel[] {
    const data: DenouncedPersonModel[] = denounceDenouncedPerson;
    if (data instanceof Array) {
      for (const obj of data) {
        obj.dateOfBirth = obj.dateOfBirth ? this.stringToDate(obj.dateOfBirth) : null;
      }
    }
    return data;
  }

  verificationInvestigationList(verificationInvestigation: VerificationInvestigationModel[]): VerificationInvestigationModel[] {
    const data: VerificationInvestigationModel[] = verificationInvestigation;
    if (data instanceof Array) {
      for (const obj of data) {
        obj.verificationDate = obj.verificationDate ? this.stringToDate(obj.verificationDate) : null;
      }
    }
    return data;
  }

  investigationActivityList(investigationActivity: InvestigationActivityModel[]): InvestigationActivityModel[] {
    const data: InvestigationActivityModel[] = investigationActivity;
    if (data instanceof Array) {
      for (const obj of data) {
        obj.executionDate = obj.executionDate ? this.stringToDate(obj.executionDate) : null;
      }
    }
    return data;
  }

  settlementDecisionList(settlementDecision: SettlementDecisionModel[]): SettlementDecisionModel[] {
    const data: SettlementDecisionModel[] = settlementDecision;
    if (data instanceof Array) {
      for (const obj of data) {
        obj.decisionDate = obj.decisionDate ? this.stringToDate(obj.decisionDate) : null;
        obj.effectStartDate = obj.effectStartDate ? this.stringToDate(obj.effectStartDate) : null;
        obj.effectEndDate = obj.effectEndDate ? this.stringToDate(obj.effectEndDate) : null;
      }
    }
    return data;
  }

  /*
   * Convert Model Date To String
   */
  formToDenounceDenouncedPersonList(): DenouncedPersonModel[] {
    // copy array
    const data: DenouncedPersonModel[] =
      JSON.parse(JSON.stringify(this.denouncedPersonListComponent?.getActualPersonList()));
    if (data instanceof Array) {
      for (const obj of data) {
        obj.dateOfBirth = obj.dateOfBirth ? this.dateToString(obj.dateOfBirth) : null;
      }
    }
    return data;
  }

  formToVerificationInvestigationList(): VerificationInvestigationModel[] {
    let data: VerificationInvestigationModel[] = [];
    if (this.verificationInvestigationListComponent?.getActualInvestigationRequestList()) {
      data = JSON.parse(JSON.stringify(this.verificationInvestigationListComponent?.getActualInvestigationRequestList()));
      if (data instanceof Array) {
        for (const obj of data) {
          obj.verificationDate = obj.verificationDate ? this.dateToString(obj.verificationDate) : null;
        }
      }
    }
    return data;
  }

  formToInvestigationActivityList(): InvestigationActivityModel[] {
    // copy array
    let data: InvestigationActivityModel[] = [];
    if (this.investigationActivityListComponent?.getActualActivityList()) {
      data = JSON.parse(JSON.stringify(this.investigationActivityListComponent?.getActualActivityList()));
      if (data instanceof Array) {
        for (const obj of data) {
          obj.executionDate = obj.executionDate ? this.dateToString(obj.executionDate) : null;
        }
      }
    }
    return data;
  }

  formToSettlementDecisionList(): SettlementDecisionModel[] {
    // copy array
    let data: SettlementDecisionModel[] = [];
    if (this.settlementDecisionListComponent?.getActualDecisionList()) {
      data = JSON.parse(JSON.stringify(this.settlementDecisionListComponent?.getActualDecisionList()));
      if (data instanceof Array) {
        for (const obj of data) {
          obj.decisionDate = obj.decisionDate ? this.dateToString(obj.decisionDate) : null;
          obj.effectStartDate = obj.effectStartDate ? this.dateToString(obj.effectStartDate) : null;
          obj.effectEndDate = obj.effectEndDate ? this.dateToString(obj.effectEndDate) : null;
        }
      }
    }
    return data;
  }

  convertResponseToDenouncement(denouncement: DenouncementModel): DenouncementModel {
    denouncement.takenOverDate = denouncement.takenOverDate ? this.stringToDate(denouncement.takenOverDate) : null;
    denouncement.takenResultDate = denouncement.takenResultDate ? this.stringToDate(denouncement.takenResultDate) : null;
    denouncement.settlementTerm = denouncement.settlementTerm ? this.stringToDate(denouncement.settlementTerm) : null;
    denouncement.iaAssignmentDate = denouncement.iaAssignmentDate ? this.stringToDate(denouncement.iaAssignmentDate) : null;
    denouncement.ipnEnactmentId = denouncement.ipnEnactmentId ? denouncement.ipnEnactmentId.split(',') : null;
    denouncement.phandlingProsecutorId = denouncement.phandlingProsecutorId ? denouncement.phandlingProsecutorId.split(',') : null;
    denouncement.phandlingDate = denouncement.phandlingDate ? this.stringToDate(denouncement.phandlingDate) : null;
    denouncement.passignmentDate = denouncement.passignmentDate ? this.stringToDate(denouncement.passignmentDate) : null;
    denouncement.rdateOfBirth = denouncement.rdateOfBirth ? this.stringToDate(denouncement.rdateOfBirth) : null;
    denouncement.fnDate = denouncement.fnDate ? this.stringToDate(denouncement.fnDate) : null;
    denouncement.denounceDenouncedPersonList =
      denouncement.denounceDenouncedPersonList ? this.denounceDenouncedPersonList(denouncement.denounceDenouncedPersonList) : null;
    denouncement.verificationInvestigationList = denouncement.verificationInvestigationList ?
      this.verificationInvestigationList(denouncement.verificationInvestigationList) : null;
    denouncement.investigationActivityList = denouncement.investigationActivityList ?
      this.investigationActivityList(denouncement.investigationActivityList) : null;
    denouncement.settlementDecisionList = denouncement.settlementDecisionList ?
      this.settlementDecisionList(denouncement.settlementDecisionList) : null;
    denouncement.denouncementUnitsId ? (denouncement.denouncementUnitsId = denouncement.denouncementUnitsId + ' - ' + denouncement.denouncementUnitsName) : denouncement.denouncementUnitsId = null;
    return denouncement;
  }

  convertFormToDenouncement(denouncement: DenouncementModel): DenouncementModel {
    const data: DenouncementModel = {...denouncement};
    data.takenOverDate = data.takenOverDate ? this.dateToString(data.takenOverDate) : null;
    data.takenResultDate = data.takenResultDate ? this.dateToString(data.takenResultDate) : null;
    data.settlementTerm = data.settlementTerm ? this.dateToString(data.settlementTerm) : null;
    data.iaAssignmentDate = data.iaAssignmentDate ? this.dateToString(data.iaAssignmentDate) : null;

    data.phandlingDate = data.phandlingDate ? this.dateToString(data.phandlingDate) : null;
    data.passignmentDate = data.passignmentDate ? this.dateToString(data.passignmentDate) : null;
    data.rdateOfBirth = data.rdateOfBirth ? this.dateToString(data.rdateOfBirth) : null;
    data.fnDate = data.fnDate ? this.dateToString(data.fnDate) : null;
    data.denouncementUnitsId = this.getDenouncementUnitsId();
    data.denouncementUnitsName = this.getDenouncementUnitsName();
    data.ipnEnactmentId = data.ipnEnactmentId ? data.ipnEnactmentId.toString() : null;
    data.phandlingProsecutorId = data.phandlingProsecutorId ? data.phandlingProsecutorId.toString() : null;
    return data;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisibleUpdate && this.isVisibleUpdate && this.denouncementId) {
      switch (this.mode) {
        case ComponentMode.UPDATE:
          this.denouncementForm.enable();
          this.denouncementForm.get('denouncementCode').disable();
          this.denouncementForm.get('ipnLawClause').disable();
          this.denouncementForm.get('ipnLawPoint').disable();
          this.titleName = 'Cập nhật tiếp nhận tin báo, tố giác, kiến nghị khởi tố';
          break;
        case ComponentMode.VIEW_FROM_PARENT:
          this.denouncementForm.disable();
          this.titleName = 'Thông tin chi tiết';
          break;
      }
      this.loaderService.show();

      /*
       * Gọi API mới ở đây
       */
      this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/detail', {id: this.denouncementId})
        .toPromise().then(resp => resp.json())
        .then((resp: ResponseBody) => {
          if (resp.responseCode === '0000') {
            this.unitsId = resp.responseData.denouncementUnitsId ? resp.responseData.denouncementUnitsId : null;
            this.unitsName = resp.responseData.denouncementUnitsName ? resp.responseData.denouncementUnitsName : null;
            this.denouncement = this.convertResponseToDenouncement(resp.responseData);
            this.denouncementForm.patchValue(this.denouncement);
            this.dataChange();
            this.getLstTakenOverAgency();
            this.loaderService.hide();
          } else {
            this.notification.showNotification(Constant.ERROR, resp.responseMessage);
            this.closeModal.emit('close');
          }
        });
    }
  }

  getLstTakenOverAgency() {
    const overAgency = this.getControl('fnTakenOverAgency').value;
    const unit = this.getControl('fnTakenOverUnit').value;
    // this.onSearchTakenOverAgency('', overAgency, unit);
    switch (overAgency) {
      case '1':
        this.categoriesService.getPoliceFromBySppId(unit).subscribe(res => {
          this.fnTakenLstPolices = res ? [{name: res.NAME, policeId: res.POLICEID}] : [];
        });
        break;
      case '2':
        this.categoriesService.getFromSpp(unit).subscribe(res => {
          this.fnTakenLstPol = res ? [WebUtilities.toLowercaseFields(res[0])] : [];
        });
        break;
      case '3':
        this.categoriesService.getSppBySppid(unit).subscribe(res => {
          this.fnTakenLstSpp = res ? [{name: res.name, sppId: res.sppid}] : [];
        });
        break;
      default:
        break;
    }
  }

  onChangeIpnSettlementUnit(text, type) {
    if (type === 'CQĐT') {
      this.getPolAndPolice(text.target.value, 'lstIpnPolices');
    } else {
      this.onSearchSpp(text.target.value);
    }
  }

  onSelectedValue(value, type) {
    const object = this.lstIpnPolices.find(element => element.name === value.nzValue);

    if (object) {
      if (type === 'CQĐT') {
        this.getControl('ipnSettlementUnitId').setValue(object.value);
      } else {
        this.getControl('ipnSettlementUnitId').setValue(object.sppId);
      }
    }
  }

  blurInput(type) {
    if ((type === 'CQĐT' && this.lstIpnPolices.length === 0) || (type === 'VKS' && this.lstSpp.length === 0)) {
      this.getControl('ipnSettlementUnitId').setValue(null);
      this.getControl('ipnSettlementUnit').setValue(null);
    }
  }

  handleLawIdOpenChange(open: boolean): void {
    if (open && this.groupLawCode == null) {
      this.notification.showNotification(Constant.ERROR, 'Yêu cầu chọn Bộ luật trước');
    }
  }

  getBoLuatByStatus() {
    this.constantService.postRequest(this.constantService.MANAGE_URL + 'code/getList/'
      , {
        status: 'Y'
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listGroupLawCode = resJson.responseData;
        } else {
          // tslint:disable-next-line:max-line-length
          this.notification.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
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
    return this.denouncementForm.get('denouncementAgency');
  }

  get denouncementUnitsId(): AbstractControl {
    return this.denouncementForm.get('denouncementUnitsId');
  }

  getDenouncementUnitsName(): string {
    if (this.denouncementAgency.value === 'SPP') {
      return this.denouncementUnitsId?.value?.name;
    } else if (this.denouncementAgency.value === '10') {
      return 'Cảnh sát biển';
    } else if (this.denouncementAgency.value === '12') {
      return 'Cơ quan khác';
    } else {
      if (this.denouncementUnitsId.value?.NAME) {
        return this.denouncementUnitsId.value?.NAME;
      } else {
        const index = this.denouncementUnitsId.value?.indexOf(' - ');
        return this.denouncementUnitsId.value?.substring(index + 3);
      }
    }
  }

  getDenouncementUnitsId(): string {
    if (this.denouncementUnitsId.value) {
      switch (this.denouncementAgency.value) {
        case '02':
          if (this.denouncementUnitsId.value?.POLICEID) {
            return this.denouncementUnitsId.value?.POLICEID;
          } else {
            const index = this.denouncementUnitsId.value?.indexOf(' - ');
            return this.denouncementUnitsId.value?.substring(0, index);
          }
        case '04':
          if (this.denouncementUnitsId.value?.ARMYID) {
            return this.denouncementUnitsId.value?.ARMYID;
          } else {
            const index = this.denouncementUnitsId.value?.indexOf(' - ');
            return this.denouncementUnitsId.value?.substring(0, index);
          }
        case '06':
          if (this.denouncementUnitsId.value?.CUSTOMID) {
            return this.denouncementUnitsId.value?.CUSTOMID;
          } else {
            const index = this.denouncementUnitsId.value.indexOf(' - ');
            return this.denouncementUnitsId.value?.substring(0, index);
          }
        case '08':
          if (this.denouncementUnitsId.value?.RANGID) {
            return this.denouncementUnitsId.value?.RANGID;
          } else {
            const index = this.denouncementUnitsId.value?.indexOf(' - ');
            return this.denouncementUnitsId.value?.substring(0, index);
          }
        case '09':
          if (this.denouncementUnitsId.value?.BORGUAID) {
            return this.denouncementUnitsId.value?.BORGUAID;
          } else {
            const index = this.denouncementUnitsId.value?.indexOf(' - ');
            return this.denouncementUnitsId.value?.substring(0, index);
          }
        case '10':
        case '12':
          return this.denouncementAgency.value;
        case 'SPC':
          if (this.denouncementUnitsId.value?.SPCID) {
            return this.denouncementUnitsId.value?.SPCID;
          } else {
            const index = this.denouncementUnitsId.value?.indexOf(' - ');
            return this.denouncementUnitsId.value?.substring(0, index);
          }
        case 'SPP':
          if (this.denouncementUnitsId.value?.sppid) {
            return this.denouncementUnitsId.value?.sppid;
          } else {
            const index = this.denouncementUnitsId.value?.indexOf(' - ');
            return this.denouncementUnitsId.value?.substring(0, index);
          }
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
          this.denouncementForm.get('denouncementUnitsId').clearValidators();
          this.denouncementForm.get('denouncementUnitsId').updateValueAndValidity();
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
    const ex = this.denouncementForm.get('rcccd').value;
    const newC = ex.replace(/[a-z]+/img, '');
    return this.denouncementForm.get('rcccd').setValue(newC);
  }

  changeSettlementTerm(e){
    this.denouncementForm.get('settlementTerm').setValue('');
    const date = new Date(this.denouncementForm.get('takenResultDate').value), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
    if (e) {
      const newDate = new Date(y, m+4, d);
      return this.denouncementForm.get('settlementTerm').setValue(newDate);
    }
  }
}
