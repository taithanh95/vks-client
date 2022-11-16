import {Component,EventEmitter,Input,OnInit,Output,SimpleChanges,ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CategoriesService} from '../../../../../service/categories.service';
import {ComponentMode, Constant} from '../../../../../shared/constants/constant.class';
import {LoaderService} from '../../../../../service/loader.service';
import {DenouncementModel} from '../../../../../model/denouncement.model';
import {NotificationService} from '../../../../../service/notification.service';
import {Observable} from 'rxjs';
import {Code} from '../../../../../model/code';
import {ConstantService} from '../../../../../service/constant.service';
import {Law} from '../../../../so-thu-ly/model/so-thu-ly.model';
import {ResponseBody} from '../../../../so-thu-ly/model/response-body';
import {ParsePipe} from 'ngx-moment';
import {VerificationInvestigationModel} from '../../../../../model/verification-investigation.model';
import {InvestigationActivityModel} from '../../../../../model/investigation-activity.model';
import {SettlementDecisionModel} from '../../../../../model/settlement-decision.model';
import {DenouncedPersonModel} from '../../../../../model/denounced-person.model';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import { FDenouncedPersonListComponent } from './f-denounced-person-list/f-denounced-person-list.component';
import { FVerificationInvestigationListComponent } from './f-verification-investigation-list/f-verification-investigation-list.component';
import { FSettlementDecisionListComponent } from './f-settlement-decision-list/f-settlement-decision-list.component';
import { FInvestigationActivityListComponent } from './f-investigation-activity-list/f-investigation-activity-list.component';

@Component({
  selector: 'app-d-denunciation-detail',
  templateUrl: './d-denunciation-detail.component.html',
  styleUrls: ['./d-denunciation-detail.component.scss']
})
export class DDenunciationDetailComponent implements OnInit {
  @Input() mode: ComponentMode = ComponentMode.VIEW_FROM_PARENT;
  @Input() denouncementId: number;
  @Input() isVisibleDetail: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @ViewChild(FDenouncedPersonListComponent, {static: false})
  denouncedPersonListComponent: FDenouncedPersonListComponent;
  @ViewChild(FVerificationInvestigationListComponent, {static: false})
  verificationInvestigationListComponent: FVerificationInvestigationListComponent;
  @ViewChild(FSettlementDecisionListComponent, {static: false})
  settlementDecisionListComponent: FSettlementDecisionListComponent;
  @ViewChild(FInvestigationActivityListComponent, {static: false})
  investigationActivityListComponent: FInvestigationActivityListComponent;

  userInfo: any;
  denouncement: DenouncementModel;
  denouncementForm: FormGroup;
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
  procurators: any[] = [];

  selectedCodeId: string = null;

  constructor(private fb: FormBuilder,
              private categoriesService: CategoriesService,
              private parsePipe: ParsePipe,
              private loaderService: LoaderService,
              private notificationService: NzNotificationService,
              private notification: NotificationService,
              private constantService: ConstantService
  ) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.initComboBox();
    this.initFormControl();
    this.categoriesService.getListInspector().subscribe(next => {
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
      takenOverDate: [null],
      settlementTerm: [null],
      crimeReportSource: [Constant.DENOUNCEMENT_TYPE_NEW],
      complicatedCircumstance: false,
      takenOverOfficer: [this.userInfo.userid],
      officerPosition: [null],

      iaHandlingUnit: [this.defaultIaHandlingOfficer || null],
      iaHandlingUnitId: [null],
      iaHandlingOfficer: [null],
      iaAssignmentDecisionNumber: [null],
      iaAssignmentDate: [null],

      phandlingDate: [null],
      phandlingProsecutor: [null],
      phandlingProsecutorId: [null],
      passignmentDecisionNumber: [null],
      passignmentDate: [null],

      rreporter: [null],
      rdateOfBirth: [null],
      ryearOfBirth: [null],
      raddress: [null],
      rphoneNumber: [null],
      rdelation: [null],
      rnote: [null],

      ipnSettlementAgency: [Constant.TAKEN_OVER_AGENCY_CQDT],
      ipnSettlementUnit: [null],
      ipnSettlementUnitId: [null],
      ipnClassifiedNews: [null],
      ipnEnactment: [null],
      ipnEnactmentTemp: [null],
      ipnEnactmentId: [null],
      ipnLawClause: [{value: null, disabled: true}],
      ipnLawPoint: [{value: null, disabled: true}],

      fnCode: [null],
      fnDate: [null],
      fnTakenOverAgency: [null],
      fnTakenOverUnit: [null],
      fnNote: [null],

      shareInfoLevel: [0],
      sppCode: [],
      denouncedPersonList: [],

      corruptionCrime: [false],
      economicCrime: [false],
      otherCrime: [false],
      codeIdFormControlName: [null],
    });
    this.classifiedNews = this.denouncementForm.get('ipnClassifiedNews').valueChanges;
  }

  handleCancel(): void {
    this.closeModal.emit(false);
  }

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
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
        this.categoriesService.getPolSelect(search).subscribe(res => {
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
    // this.getControl('ipnEnactmentId').valueChanges.subscribe(
    //   value => {
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

  getSelectBoxList() {
    this.getPolAndPolice('', 'lstIpnPolices');
    if (this.denouncement.ipnEnactmentId && this.denouncement.ipnEnactmentId.length > 0) {
      const laws = [];
      for (let i = 0 ; i < this.denouncement.ipnEnactmentId.length ; i++) {
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

  convertResponseToDenouncement(denouncement: DenouncementModel): DenouncementModel {
    denouncement.takenOverDate = denouncement.takenOverDate ? this.stringToDate(denouncement.takenOverDate) : null;
    denouncement.settlementTerm = denouncement.settlementTerm ? this.stringToDate(denouncement.settlementTerm) : null;
    denouncement.iaAssignmentDate = denouncement.iaAssignmentDate ? this.stringToDate(denouncement.iaAssignmentDate) : null;
    denouncement.ipnEnactmentId = denouncement.ipnEnactmentId ? denouncement.ipnEnactmentId.split(',') : null;
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
    return denouncement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisibleDetail && this.isVisibleDetail && this.denouncementId) {
          this.denouncementForm.disable();
          this.loaderService.show();
      /*
       * Gọi API mới ở đây
       */
      this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/detail', {id: this.denouncementId})
        .toPromise().then(resp => resp.json())
        .then((resp: ResponseBody) => {
          if (resp.responseCode === '0000') {
            this.denouncement = this.convertResponseToDenouncement(resp.responseData);
            this.dataChange();
            this.denouncementForm.patchValue(this.denouncement);
            this.loaderService.hide();
          } else {
            this.notification.showNotification(Constant.ERROR, resp.responseMessage);
            this.closeModal.emit(false);
          }
        });
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
          this.notification.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  onSubmitForm = () => null;
}

