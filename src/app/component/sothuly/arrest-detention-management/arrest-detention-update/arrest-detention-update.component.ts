import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ComponentMode, Constant} from '../../../../shared/constants/constant.class';
import {LoaderService} from '../../../../service/loader.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {CategoriesService} from '../../../../service/categories.service';
import {ArrestDetentionInfoModel} from '../../../../model/arrest-detention-info.model';
import {ArresteeListComponent} from '../arrestee/arrestee-list/arrestee-list.component';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {ConstantService} from '../../../../service/constant.service';
import {NotificationService} from '../../../../service/notification.service';
import {ApParamService} from '../../../../service/apparam.service';
import {ApParamModel} from '../../../../model/ap-param.model';
import {SettlementDecisionListComponent} from '../settlement-decision/settlement-decision-list/settlement-decision-list.component';
import {DateUtils} from '../../../../shared/utils/date-utils.class';
import {Code} from '../../../../model/code';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import * as moment from 'moment';
import {Law} from "../../../so-thu-ly/model/so-thu-ly.model";

@Component({
  selector: 'app-arrest-detention-update',
  templateUrl: './arrest-detention-update.component.html',
  styleUrls: ['./arrest-detention-update.component.scss']
})
export class ArrestDetentionUpdateComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isVisibleUpdate: boolean;
  titleName: string;
  arrestForm: FormGroup;
  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.VIEW;
  @Input() update: any = ComponentMode.UPDATE;
  @Input() arrestDetentionInfoId: number;
  @Input() isChangeArresteeList: boolean;
  @Output() closeModal: EventEmitter<string> = new EventEmitter();
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  @ViewChild(ArresteeListComponent, {static: false}) arrestees = ArresteeListComponent;
  @ViewChild(SettlementDecisionListComponent, {static: false}) settlementDecisions: SettlementDecisionListComponent;
  confirmModalRef: NzModalRef<any>;
  userInfo: any;
  defaultIaHandlingOfficer: string;
  arrCollapse = [];
  accesses = Constant.ACCESSES;
  desAccessLevel: string;
  lstPolicesAndPol = [];
  procurators: any[] = [];
  arrestTypes: any[] = [];
  arrestDetentionInfo: ArrestDetentionInfoModel;
  dataInput: Partial<ArrestDetentionInfoModel> = {};
  lstLaws: Law[] = [];
  listGroupLawCode: Code[] = [];
  groupLawCode: string = null;
  searchLawChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  selectedCodeId: string = null;

  constructor(private loaderService: LoaderService,
              private fb: FormBuilder,
              private modalService: NzModalService,
              private categoriesService: CategoriesService,
              private notificationService: NzNotificationService,
              private apParamService: ApParamService,
              private constantService: ConstantService,
              private notification: NotificationService) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.desAccessLevel = this.accesses.find(e => e.value === 0).des || '';
    this.arrCollapse = [true, true, true, true];
    this.desAccessLevel = this.accesses.find(e => e.value === 0).des || '';
    this.createFormControl();
    console.log("init");
    this.valueChange();
    this.commonSelect();
    this.getBoLuatByStatus();
    this.searchLawChange$.asObservable().pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.getLaws(value);
      });
  }

// dieu luat, khoan luat
  onSearchLaw(value: string) {
    this.searchLawChange$.next(value);
  }

  handleLawIdOpenChange(open: boolean): void {
    if (open && this.groupLawCode == null) {
      this.notification.showNotification(Constant.ERROR, 'Yêu cầu chọn Bộ luật trước');
    }
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

  ipnEnactmentValueChange() {
    this.getControl('arrestEnactmentId').valueChanges.subscribe(
      value => {
        const law = this.lstLaws.find(e => e.lawCode === value);
        if (law) {
          this.getControl('arrestEnactmentName').setValue(law.lawName);
          this.getControl('lawClauseId').setValue(law.item);
          this.getControl('lawPointId').setValue(law.point);
        } else {
          this.getControl('arrestEnactmentName').setValue(null);
          this.getControl('lawClauseId').setValue(null);
          this.getControl('lawPointId').setValue(null);
        }
      }
    );
  }

  // iaHandlingEnactmentIdValueChange() {
  //   this.getControl('arrestEnactmentId').valueChanges.subscribe(
  //     value => {
  //       this.getControl('arrestEnactmentName').setValue(
  //         this.lstLaws.find(e => e.lawId === value)?.lawName
  //       );
  //     }
  //   )
  // }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisibleUpdate && this.isVisibleUpdate && this.arrestDetentionInfoId) {
      switch (this.mode) {
        case ComponentMode.UPDATE:
          this.arrestForm.enable();
          this.arrestForm.get('id').disable();
          this.arrestForm.get('lawPointId').disable();
          this.arrestForm.get('lawClauseId').disable();
          this.titleName = 'Cập nhật thông tin bắt, tạm giam,tạm giữ';
          break;
        case ComponentMode.VIEW_FROM_PARENT:
          this.arrestForm.disable();
          this.titleName = 'Xem chi tiết thông tin bắt, tạm giam, tạm giữ';
          break;
      }
      this.loaderService.show();
      this.dataInput.id = this.arrestDetentionInfoId;
      this.constantService.postRequest(this.constantService.SOTHULY_URL + 'arrest-detention/getLstArresteeById'
        , this.dataInput)
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            if (resJson.responseData) {
              this.arrestDetentionInfo = resJson.responseData;
            }
            this.arrestForm.patchValue({
              ...this.arrestDetentionInfo,
              fnDate: new Date()
            });
            this.getListInspector(this.arrestDetentionInfo.takenOverProcuratorName);
            this.dataChange();
          } else {
            // tslint:disable-next-line:max-line-length
            this.notification.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
            this.closeModal.emit('close');
          }
          this.loaderService.hide();
        })
        .catch(err => {
          this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
          this.closeModal.emit('close');
        });
    }
  }

  ngOnDestroy(): void {
  }

  handleCancel(): void {
    this.closeModal.emit('close');
    this.resetPage();
  }

  resetPage() {
    this.arrestForm.reset();
    this.arrestForm.patchValue({
      takenOverAgencyCode: Constant.TAKEN_OVER_AGENCY_CQDT,
      crimeReportSource: Constant.DENOUNCEMENT_TYPE_NEW,
      iaHandlingUnit: this.defaultIaHandlingOfficer || null,
      takenOverOfficer: this.userInfo.userid,
      fnDate: new Date()
    });
    this.closeModal.emit('save');
  }

  createFormControl() {
    this.arrestForm = this.fb.group({
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
      codeIdFormControlName: [null],
      sppid: [this.userInfo.sppid],
      arresteeList: [],
      lawPointId: [{value: null, disabled: true}],
      arrestEnactmentName: [null],
      arrestEnactmentId: [null],
      lawClauseId: [{value: null, disabled: true}]
    });
  }

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  onSubmitForm() {
    this.validForm();
    if (this.arrestForm.invalid) {
      return;
    }
    this.showConfirmSave();
  }

  onSearch(e, list) {
    this.getPolAndPolice(e, list);
  }

  getPolAndPolice(value, list) {
    this.categoriesService.getListPoliceAndPolByName(value)
      .subscribe(res => {
        this[list] = res;
      });
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

   takenOverProsecutorIdValueChange() {
    const takenOverProsecutorIdControl =   this.arrestForm.get('takenOverProsecutorId');
    takenOverProsecutorIdControl.valueChanges.subscribe(
       value => {
         this.categoriesService.getListInspectorByPositionSearchKey('KS', '').subscribe(next => {
           this.procurators = next;
         }, error => {
           this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + error);
         });
        const procuratorName =  this.procurators.find(e => e.inspCode === value)?.fullName || '';
         this.arrestForm.get('takenOverProcuratorName').setValue(procuratorName);
      }
    );
  }

  valueChange() {

    this.iaHandlingUnitIdValueChange();
    // this.dateOfBirthValueChange();
    // this.getDefaultLevelShareInfo();
    this.shareInfoLevelValueChange();
    this.takenOverProsecutorIdValueChange();
    this.ipnEnactmentValueChange();
    // this.iaHandlingEnactmentIdValueChange();

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

  dataChange() {
    this.onSearch('', 'lstPolicesAndPol');
    this.getSelectBoxList();
  }

  getSelectBoxList() {
    if (this.arrestDetentionInfo.arrestingUnitId && this.arrestDetentionInfo.arrestingUnitName) {
      this.lstPolicesAndPol = [{
        value: this.arrestDetentionInfo.arrestingUnitId,
        name: this.arrestDetentionInfo.arrestingUnitName
      }];
    }
    if (this.arrestDetentionInfo.arrestEnactmentId && this.arrestDetentionInfo.arrestEnactmentName) {
      let label = 'Điều ' + this.arrestDetentionInfo.law.lawId;
      if (this.arrestDetentionInfo.law.item) {
        label += ', Khoản ' + this.arrestDetentionInfo.law.item;
      }
      if (this.arrestDetentionInfo.law.point) {
        label += ', Điểm ' + this.arrestDetentionInfo.law.point;
      }
      this.lstLaws = [
        {
          lawCode: this.arrestDetentionInfo.arrestEnactmentId,
          label: label + ' - ' + this.arrestDetentionInfo.law.lawName,
          item: this.arrestDetentionInfo.law.item,
          point: this.arrestDetentionInfo.law.point,
        }];
    }
    this.getCodeIdSelected();
  }

  getCodeIdSelected() {
    if (this.arrestDetentionInfo.arrestEnactmentId != null) {
      const getByLawCode = this.arrestDetentionInfo.arrestEnactmentId;
      this.categoriesService.getLawByLawCode(getByLawCode).subscribe((result: any) => {
        this.selectedCodeId = result.CODEID;
      });
    }
  }

  getControl(controlName) {
    if (this.arrestForm) {
      return this.arrestForm.controls[controlName];
    }
  }

  shareInfoLevelValueChange() {
    const shareInfoLevelControl = this.arrestForm.get('shareInfoLevel');
    shareInfoLevelControl.valueChanges.subscribe(
      value => {
        this.desAccessLevel = this.accesses.find(e => e.value === value)?.des || '';
      }
    );
  }

  commonSelect() {
    this.getDomainValueList({code: Constant.ARREST_TYPE}, 'arrestTypes');
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

  validForm(): void {
    if (this.arrestForm.invalid) {
      Object.keys(this.arrestForm.controls).forEach(key => {
        this.arrestForm.get(key).markAsDirty();
        this.arrestForm.get(key).updateValueAndValidity();
      });
    }
    this.checkMaxlengCustom();
    this.arrestForm.updateValueAndValidity();
    this.checkProcuracyTakenOverDate();
    this.checkProcuratorAssignmentDate();

  }

  checkProcuracyTakenOverDate() {
    const currentDate = new Date();
    const procuracyTakenOverDate = new Date(this.arrestForm.get('procuracyTakenOverDate').value);
    const invalidDate = Math.floor(currentDate.getTime() / 60000) < Math.floor(procuracyTakenOverDate.getTime() / 60000);
    const procuracyTakenOverDateError = this.arrestForm.get('procuracyTakenOverDate').errors;
    this.arrestForm.get('procuracyTakenOverDate').setErrors(invalidDate ? {
      ...procuracyTakenOverDateError,
      invalidProcuracyTakenOverDate: true
    } : null);
  }

  checkProcuratorAssignmentDate() {
    const procuratorAssignmentDate = new Date(this.arrestForm.get('procuratorAssignmentDate').value);
    const invalidDate = (DateUtils.compareDate(new Date(procuratorAssignmentDate), new Date()) > 0);
    const procuratorAssignmentDateError = this.arrestForm.get('procuratorAssignmentDate').errors;
    this.arrestForm.get('procuratorAssignmentDate').setErrors(invalidDate ? {
      ...procuratorAssignmentDateError,
      invalidProcuratorAssignmentDate: true
    } : null);
  }

  saveData(): any {
    if (this.settlementDecisions.getActualDecisionList().length !== 0) {
      this.arrestDetentionInfo.arrestees.forEach((arrestee, index) => {
        this.arrestDetentionInfo.arrestees[index].settlementDecisions = [];
      });
      this.settlementDecisions.getActualDecisionList().forEach((decision) => {
        const index = this.arrestDetentionInfo.arrestees.findIndex(arrestee => arrestee.id === decision.arresteeId);
        if (index >= 0) {
          this.arrestDetentionInfo.arrestees[index].settlementDecisions.push(decision);
        }
      });
    }
    const objToSubmit: ArrestDetentionInfoModel = {...this.arrestDetentionInfo, ...this.arrestForm.getRawValue()};
    for (const prop in objToSubmit) {
      if (objToSubmit.hasOwnProperty(prop) && objToSubmit[prop] && typeof objToSubmit[prop] === 'string') {
        objToSubmit[prop] = objToSubmit[prop]?.trim();
      }
    }
    if (!this.getControl('arrestingUnitId').value) {
      this.getControl('arrestingUnitName').setValue(null);
    }

    setTimeout(() => {
      this.constantService.postRequest(this.constantService.SOTHULY_URL + 'arrest-detention', objToSubmit)
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.resetPage();
            this.notification.showNotification(Constant.SUCCESS, 'Cập nhật dữ liệu thành công');
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

  onSearchInspector(e) {
    this.getListInspector(this.arrestForm.value.takenOverProsecutorId);
  }

  getListInspector(takenOverProsecutorId: string) {
    this.categoriesService.getListInspectorByPositionSearchKey('KS', takenOverProsecutorId).subscribe(next => {
      this.procurators = next;
    }, error => {
      this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + error);
    });
    // this.constantService.postRequest(this.constantService.MANAGE_URL + 'inspector/getPage/'
    //   , {
    //     pageNumber: 1,
    //     pageSize: 10,
    //     dataRequest: {
    //       fullName: e,
    //       status: 'Y'
    //     }
    //   }).toPromise()
    //   .then(res => res.json())
    //   .then(resJson => {
    //     if (resJson.responseCode === '0000') {
    //       if (resJson.responseData) {
    //         this.procurators = resJson.responseData.data;
    //       } else {
    //         this.procurators = [];
    //       }
    //     }
    //     // else {
    //     //   // tslint:disable-next-line:max-line-length
    //     //   this.notification.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
    //     // }
    //   })
    //   .catch(err => {
    //     this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
    //   });
  }

  listenToArresteeListChange(e: string) {
    if (e === 'changeList') {
      this.isChangeArresteeList = true;
      this.constantService.postRequest(this.constantService.SOTHULY_URL + 'arrest-detention/getLstArresteeById'
        , this.dataInput).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            if (resJson.responseData) {
              this.arrestDetentionInfo = resJson.responseData;
            } else {
              this.procurators = [];
            }
          } else {
            // tslint:disable-next-line:max-line-length
            this.notification.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
          }
        })
        .catch(err => {
          this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
        });
    } else {
      this.isChangeArresteeList = false;
    }
  }

  onCodeIdChange(value: any): void {
    this.lstLaws = [];
    this.groupLawCode = value;
    this.getLaws('');
  }

  checkMaxlengCustom() {
    const content = this.arrestForm.get('arrestContent').value;
    const recaptureDateErr = this.arrestForm.get('arrestContent').errors;
    const textEncoder = new TextEncoder();
    const invalidArrestContentCheckNull = content == null;
    const invalidArrestContent = textEncoder.encode(content).length > 3000;
    if (invalidArrestContentCheckNull === true) {
      this.arrestForm.get('arrestContent').setErrors(invalidArrestContentCheckNull ? {
        ...recaptureDateErr,
        required: true
      } : null);
      return;
    }
    if (invalidArrestContent === true) {
      this.arrestForm.get('arrestContent').setErrors(invalidArrestContent ? {
        ...recaptureDateErr,
        invalidMaxlength: true
      } : null);
      return;
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
