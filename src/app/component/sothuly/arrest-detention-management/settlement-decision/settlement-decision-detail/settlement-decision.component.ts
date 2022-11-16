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
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../shared/constants/constant.class';
import {ArrestSettlementDecisionModel} from '../../../../../model/arrest-settlement-decision.model';
import {CompareWith} from 'ng-zorro-antd/core/types';
import {ApParamModel} from '../../../../../model/ap-param.model';
import {Subscription} from 'rxjs';
import {ApParamService} from '../../../../../service/apparam.service';
import {NzAutocompleteComponent, NzAutocompleteOptionComponent} from 'ng-zorro-antd/auto-complete';
import {CategoriesService} from '../../../../../service/categories.service';
import {ArresteeModel} from '../../../../../model/arrestee.model';
import {DateUtils} from '../../../../../shared/utils/date-utils.class';
import {LoaderService} from '../../../../../service/loader.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {ConstantService} from '../../../../../service/constant.service';
import {NotificationService} from '../../../../../service/notification.service';
import * as moment from 'moment';
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";
import {CustomValidator} from "../../../../../shared/custom-validator/custom-validator.class";


@Component({
  selector: 'app-settlement-decision',
  templateUrl: './settlement-decision.component.html',
  styleUrls: ['./settlement-decision.component.scss']
})
export class SettlementDecisionComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('autoDecisionList') autoDecisionList: NzAutocompleteComponent;
  @ViewChild('autoDecisionMakingUnitList') autoDecisionMakingUnitList: NzAutocompleteComponent;
  @ViewChild('autoArresteeList') autoArresteeList: NzAutocompleteComponent;
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() isVisibleDialog: boolean;
  @Input() arrestSettlementDecisionModel: ArrestSettlementDecisionModel;
  @Input() listDecisionIndex: number;
  @Input() decisionList: ArrestSettlementDecisionModel[];
  @Input() listArresteeToChoose: ArresteeModel[];
  @Input() procurators: any[] = [];
  @Input() decisionAgencies: ApParamModel[] = [];
  @Input() decisionUnit: any[] = [];
  @Output() closeModal: EventEmitter<string> = new EventEmitter();
  @Output() saveEmitter: EventEmitter<ArrestSettlementDecisionModel> = new EventEmitter<ArrestSettlementDecisionModel>();
  confirmModalRef: NzModalRef<any>;
  arrestSettlementDecisionForm: FormGroup = this.fb.group({
    id: [null],
    decisionMakingAgency: [null, [Validators.required]],
    decisionMakingUnitId: [null],
    decisionMakingUnitName: [null],
    decisionMakingUnitTemp: [null],
    // TO-DO: may be replace by an object
    arresteeId: [null, Validators.required],
    decisionNumber: [null, [Validators.maxLength(10), Validators.required]],
    decisionId: [null, [Validators.required]],
    decisionName: [null, [Validators.required]],
    decisionTemp: [null, [Validators.required]],
    decisionDate: [new Date(), [Validators.required]],
    reason: [null],
    effectStartDate: [new Date()],
    effectEndDate: [new Date()],
    signer: [null, [Validators.maxLength(100), Validators.required]],
    singerPosition: [null, [Validators.maxLength(100), Validators.required]],
    note: [null, [Validators.maxLength(1000)]],
    executeOrder: [null],
    typeDate: [null],
    dayMonthYear: [null]
  });
  isCollapse = true;
  isSpinning = false;
  modeEnum = ComponentMode;
  selectedAgency: { type: number, name: string, idFieldName: string, nameField: string };
  decisionUnitsFromResponse: any[] = [];
  decisionListFromResponse: any[] = [];
  settlementExisted: boolean;
  settlementLowerDateOrder: boolean;
  settlementHigherDateOrder: boolean;
  decisionNameSubscription: Subscription = new Subscription();
  decisionMakingAgentSub: Subscription = new Subscription();
  decisionMakingUnitSub: Subscription = new Subscription();
  requestParam: any = {
    pageNumber: 1,
    pageSize: 10,
    dataRequest: {}
  };

  lstInpectors: any[]
  inspectorOpions: any[]
  sppId: any;

  compareDecision: CompareWith = (o1: any, o2: any) => {
    const id1 = o1 ? o1.deciId : null;
    const id2 = o2 ? o2.deciId : null;
    return id1 === id2;
  };
  compareDecisionMakingUnit = (o1: any, o2: any) => {
    if (this.selectedAgency) {
      const id1 = o1 ? o1[this.selectedAgency.idFieldName] : null;
      const id2 = o2 ? o2[this.selectedAgency.idFieldName] : null;
      return id1 === id2;
    } else {
      return false;
    }
  };

  constructor(
    private fb: FormBuilder,
              private apParamService: ApParamService,
              private categoriesService: CategoriesService,
              private loaderService: LoaderService,
              private notificationService: NzNotificationService,
              private modalService: NzModalService,
              private constantService: ConstantService,
              private notification: NotificationService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
  }

  ngOnDestroy(): void {
    this.decisionNameSubscription.unsubscribe();
    this.decisionMakingUnitSub.unsubscribe();
    this.decisionMakingAgentSub.unsubscribe();
  }

  ngOnInit(): void {
    this.requestParam.dataRequest = {name: ''};
    this.constantService.postRequest(this.constantService.MANAGE_URL + 'decision/getPage/',
      this.requestParam).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (resJson.responseData) {
            this.decisionListFromResponse = resJson.responseData.data;
          } else {
            this.decisionListFromResponse = [];
          }
        } else {
          this.notification.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      }).catch(err => {
      this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
    });

    this.commonSelect();

    this.decisionMakingAgentSub = this.arrestSettlementDecisionForm.get('decisionMakingAgency').valueChanges
      .subscribe(next => {
        // const val = this.arrestSettlementDecisionForm.get('decisionMakingUnitName').value || '';
        switch (next) {
          case '1':
            if (this.selectedAgency.name !== next) {
              this.selectedAgency = {name: next, type: 1, idFieldName: 'policeId', nameField: 'name'};
              this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitId').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitName').setValue(null);
              // this.onInputDecisionMakingUnit({target: {value: val}}, true);
            }
            break;
          case '2':
            if (this.selectedAgency.name !== next) {
              this.selectedAgency = {name: next, type: 2, idFieldName: 'armyId', nameField: 'armyName'};
              this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitId').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitName').setValue(null);
              // this.onInputDecisionMakingUnit({target: {value: val}}, true);
            }
            break;
          case '3':
            if (this.selectedAgency.name !== next) {
              this.selectedAgency = {name: next, type: 3, idFieldName: 'customId', nameField: 'customName'};
              this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitId').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitName').setValue(null);
              // this.onInputDecisionMakingUnit({target: {value: val}}, true);
            }
            break;
          case '4':
            if (this.selectedAgency.name !== next) {
              this.selectedAgency = {name: next, type: 4, idFieldName: 'rangId', nameField: 'rangName'};
              this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitId').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitName').setValue(null);
              // this.onInputDecisionMakingUnit({target: {value: val}}, true);
            }
            break;
          case '5':
            if (this.selectedAgency.name !== next) {
              this.selectedAgency = {name: next, type: 5, idFieldName: 'borguaId', nameField: 'borguaName'};
              this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitId').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitName').setValue(null);
              // this.onInputDecisionMakingUnit({target: {value: val}}, true);
            }
            break;
          case '6':
            if (this.selectedAgency.name !== next) {
              this.selectedAgency = {name: next, type: 6, idFieldName: 'spcId', nameField: 'name'};
              this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitId').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitName').setValue(null);
              // this.onInputDecisionMakingUnit({target: {value: val}}, true);
            }
            break;
          case '7':
            if (this.selectedAgency.name !== next) {
              this.selectedAgency = {name: next, type: 7, idFieldName: 'sppId', nameField: 'name'};
              this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitId').setValue(null);
              this.arrestSettlementDecisionForm.get('decisionMakingUnitName').setValue(null);
              // this.onInputDecisionMakingUnit({target: {value: val}}, true);
            }
            break;
          default: {
            this.selectedAgency = {name: null, type: null, idFieldName: null, nameField: null};
            this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').setValue(null);
            this.arrestSettlementDecisionForm.get('decisionMakingUnitId').setValue(null);
            this.arrestSettlementDecisionForm.get('decisionMakingUnitName').setValue(null);
          }
        }
      });
    this.onInputDecisionMakingUnit({target: {value: ''}}, true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisibleDialog) {
      this.arrestSettlementDecisionForm.reset();
    }
    if (changes.isVisibleDialog && this.isVisibleDialog) {
      this.arrestSettlementDecisionForm.reset();
      this.settlementExisted = false;
      if (this.arrestSettlementDecisionForm) {
        switch (this.mode) {
          case ComponentMode.VIEW:
          case ComponentMode.VIEW_FROM_PARENT:
            this.arrestSettlementDecisionForm.disable();
            this.arrestSettlementDecisionForm.patchValue({
              ...this.arrestSettlementDecisionModel
            });
            this.onInputDecisionMakingUnit({target: {value: this.arrestSettlementDecisionModel.decisionMakingUnitName}}, true);
            this.onInputDecisionName({target: {value: this.arrestSettlementDecisionModel.decisionName}}, true);
            break;
          case ComponentMode.UPDATE:
            this.arrestSettlementDecisionForm.enable();
            this.arrestSettlementDecisionForm.patchValue({
              ...this.arrestSettlementDecisionModel
            });
            this.arrestSettlementDecisionForm.get('arresteeId').disable();
            this.onInputDecisionMakingUnit({target: {value: this.arrestSettlementDecisionModel.decisionMakingUnitName}}, true);
            this.onInputDecisionName({target: {value: this.arrestSettlementDecisionModel.decisionName}}, true);
            break;
          case ComponentMode.COPPY:
            this.arrestSettlementDecisionForm.enable();
            this.arrestSettlementDecisionForm.patchValue({
              ...this.arrestSettlementDecisionModel
            });
            this.arrestSettlementDecisionForm.get('arresteeId').enable();
            this.onInputDecisionMakingUnit({target: {value: this.arrestSettlementDecisionModel.decisionMakingUnitName}}, true);
            this.onInputDecisionName({target: {value: this.arrestSettlementDecisionModel.decisionName}}, true);
            break;
          case ComponentMode.CREATE:
            this.arrestSettlementDecisionForm.enable();
            this.arrestSettlementDecisionForm.reset();
            this.selectedAgency = {type: null, name: null, idFieldName: null, nameField: null};
            this.arrestSettlementDecisionForm.patchValue({
              decisionDate: new Date(),
              typeDate: 'day',
              dayMonthYear: 0
            });
            this.onInputDecisionName({target: {value: ''}}, false);
            break;
        }
      } else {
        this.arrestSettlementDecisionForm.enable();
        this.arrestSettlementDecisionForm.patchValue({
          decisionDate: new Date(),
          effectStartDate: new Date(),
          effectEndDate: new Date()
        });
        this.onInputDecisionName({target: {value: ''}}, false);
      }
    }
  }

  commonSelect() {
    this.getDomainValueList({code: Constant.ARREST_DECISION_MAKING_AGENCY}, 'decisionAgencies');
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

  handleOK() {
    // this.loaderService.show();
    this.validForm();
    if (this.arrestSettlementDecisionForm.invalid) {
      return;
    }
    if (this.settlementExisted) {
      return;
    }
    this.showConfirmSave();
  }

  validForm(): void {
    Object.keys(this.arrestSettlementDecisionForm.controls).forEach(key => {
      this.arrestSettlementDecisionForm.get(key).markAsDirty();
      this.arrestSettlementDecisionForm.get(key).updateValueAndValidity();
    });
    if (this.arrestSettlementDecisionForm.get('decisionTemp').value) {
      const selected = this.arrestSettlementDecisionForm.get('decisionTemp').value;
      const text = this.arrestSettlementDecisionForm.get('decisionName').value;
      if (!(selected.name === text)) {
        this.arrestSettlementDecisionForm.get('decisionTemp').setErrors({notInList: true});
      } else {
        this.arrestSettlementDecisionForm.get('decisionTemp').setErrors(null);
      }
    } else {
      if (this.arrestSettlementDecisionForm.get('decisionName').value) {
        this.arrestSettlementDecisionForm.get('decisionTemp').setErrors({notInList: true});
      } else {
        this.arrestSettlementDecisionForm.get('decisionTemp').setErrors({required: true});
      }
    }

    if (this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').value) {
      const selected = this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').value;
      const text = this.arrestSettlementDecisionForm.get('decisionMakingUnitName').value;
      if (!(selected[this.selectedAgency.nameField] === text)) {
        this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').setErrors({notInList: true});
      } else {
        this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').setErrors(null);
      }
    } else {
      if (this.arrestSettlementDecisionForm.get('decisionMakingUnitName').value) {
        this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').setErrors({notInList: true});
      }
    }

    if (this.arrestSettlementDecisionForm.get('arresteeId').value) {
      const selected = this.arrestSettlementDecisionForm.get('arresteeId').value;
      let listId: number[] = [];
      this.listArresteeToChoose.forEach(arrestee => {
        listId = [...listId, arrestee.id];
      });
      if (!listId.includes(selected)) {
        this.arrestSettlementDecisionForm.get('arresteeId').setErrors({notInList: true});
      }
    } else {
      this.arrestSettlementDecisionForm.get('arresteeId').setErrors({required: true});
    }

    const decisionDate = this.arrestSettlementDecisionForm.get('decisionDate').value;
    const effectStartDate = this.arrestSettlementDecisionForm.get('effectStartDate').value;
    const effectEndDate = this.arrestSettlementDecisionForm.get('effectEndDate').value;
    const invalidDecisionDate = decisionDate && effectStartDate &&
      (DateUtils.compareDate(new Date(decisionDate), new Date(effectStartDate)) > 0);
    const invalidDate = effectStartDate && effectEndDate &&
      (DateUtils.compareDate(new Date(effectStartDate), new Date(effectEndDate)) > 0);
    this.arrestSettlementDecisionForm.get('effectStartDate').setErrors(invalidDecisionDate ? {invalidStartDate: true} : null);
    this.arrestSettlementDecisionForm.get('effectEndDate').setErrors(invalidDate ? {invalidEndDate: true} : null);

    this.validateDate();

    this.arrestSettlementDecisionForm.updateValueAndValidity();

  }

  saveData(): void {
    if (!['8', '9'].includes(this.arrestSettlementDecisionForm.get('decisionMakingAgency').value) && !this.arrestSettlementDecisionForm.get('decisionMakingUnitId').value){
      this.notificationService.warning(Constant.WARNING,'Thiếu dữ liệu bắt buộc');
      return;
    }
    this.isSpinning = true;
    const objToSubmit = this.arrestSettlementDecisionForm.value;
    for (const prop in objToSubmit) {
      if (objToSubmit.hasOwnProperty(prop) && objToSubmit[prop] && typeof objToSubmit[prop] === 'string') {
        objToSubmit[prop] = objToSubmit[prop]?.trim();
      }
    }

    const data: ArrestSettlementDecisionModel = this.arrestSettlementDecisionForm.value;
    data.status = GeneralModelStatus.ACTIVE;
    data.arresteeId = this.arrestSettlementDecisionForm.get('arresteeId').value;
    if (this.arrestSettlementDecisionModel && this.mode === ComponentMode.UPDATE) {
      data.createdAt = this.arrestSettlementDecisionModel.createdAt;
      data.createdBy = this.arrestSettlementDecisionModel.createdBy;
    }
    if (this.mode === ComponentMode.COPPY) {
      data.id = null;
    }
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'arrest-detention/saveArrestSettlementDecision', data)
      .toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          // this.onSave.emit(data);
          if (resJson.responseData) {
            this.arrestSettlementDecisionForm.get('id').setValue(resJson.responseData.id);
          }
          this.saveEmitter.emit(resJson.responseData);
          this.resetPage();
          if (this.mode === ComponentMode.UPDATE) {
            this.notification.showNotification(Constant.SUCCESS, 'Đã cập nhật quyết định giải quyết!');
          } else if (this.mode === ComponentMode.COPPY) {
            this.notification.showNotification(Constant.SUCCESS, 'Đã lưu quyết định giải quyết!');
          } else {
            this.notification.showNotification(Constant.SUCCESS, 'Đã lưu quyết định giải quyết!');
          }
        } else {
          // tslint:disable-next-line:max-line-length
          this.notification.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
        this.isSpinning = false;
      })
      .catch(err => {
        this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
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
            // this.onSave.emit(this.arrestSettlementDecisionForm.value);
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

  resetPage() {
    this.arrestSettlementDecisionForm.reset();
    this.isVisibleDialog = false;
    this.closeModal.emit('closeSettlementDecision');
  }

  handleCancel() {
    this.isVisibleDialog = false;
    this.closeModal.emit('closeSettlementDecision');
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  setDecisionValue(init?: boolean) {
    if (init) {
      const delay = setTimeout(() => {
        const option: NzAutocompleteOptionComponent = this.autoDecisionList.getOption({
          deciId: this.arrestSettlementDecisionModel.decisionId,
          name: this.arrestSettlementDecisionModel.decisionName
        });
        if (option) {
          this.arrestSettlementDecisionForm.get('decisionTemp').setValue(option.nzValue);
          // this.arrestSettlementDecisionForm.get('decisionId').setValue(option.nzValue['deciId']);
          // this.arrestSettlementDecisionForm.get('decisionName').setValue(option.nzValue['name']);
        } else {
          // this.arrestSettlementDecisionForm.get('decisionTemp').setValue(null);
          this.arrestSettlementDecisionForm.get('decisionId').setValue(null);
          this.arrestSettlementDecisionForm.get('decisionName').setValue(null);
        }
        clearTimeout(delay);
      }, 0);
    }
  }

  selectDecision(event: NzAutocompleteOptionComponent) {
    this.arrestSettlementDecisionForm.get('decisionId').setValue(event.nzValue.deciId);
    this.arrestSettlementDecisionForm.get('decisionName').setValue(event.nzValue.name);

  }

  onInputDecisionName(event: any, init?: boolean) {
    const value = event.target.value;
    this.arrestSettlementDecisionForm.get('decisionName').setValue(value);
    this.requestParam.dataRequest = {name: value, status: 'Y'};
    this.constantService.postRequest(this.constantService.MANAGE_URL + 'decision/getPage/',
      this.requestParam).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (resJson.responseData) {
            this.decisionListFromResponse = resJson.responseData.data;
            this.setDecisionValue(init);
          } else {
            this.decisionListFromResponse = [];
          }
        } else {
          this.decisionListFromResponse = [];
        }
      }).catch(err => {
      this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
    });
  }

  setDecisionMakingUnitValue(init?: boolean) {
    if (init && this.arrestSettlementDecisionModel) {
      const obj = {
        [this.selectedAgency.idFieldName]: this.arrestSettlementDecisionModel.decisionMakingUnitId,
        name: this.arrestSettlementDecisionModel.decisionMakingUnitName
      };
      const delay = setTimeout(() => {
        const option: NzAutocompleteOptionComponent = this.autoDecisionMakingUnitList.getOption(obj);
        if (option) {
          this.arrestSettlementDecisionForm.get('decisionMakingUnitTemp').setValue(option.nzValue);
          this.arrestSettlementDecisionForm.get('decisionMakingUnitId').setValue(option.nzValue[this.selectedAgency.idFieldName]);
          this.arrestSettlementDecisionForm.get('decisionMakingUnitName').setValue(option.nzValue[this.selectedAgency.nameField]);
        } else {
          this.arrestSettlementDecisionForm.get('decisionMakingUnitId').setValue(null);
          this.arrestSettlementDecisionForm.get('decisionMakingUnitName').setValue(null);
        }
        clearTimeout(delay);
      }, 0);
    }
  }

  selectDecisionMakingUnit(event: NzAutocompleteOptionComponent) {
    this.arrestSettlementDecisionForm.get('decisionMakingUnitId').setValue(event.nzValue[this.selectedAgency.idFieldName]);
    this.arrestSettlementDecisionForm.get('decisionMakingUnitName').setValue(event.nzValue[this.selectedAgency.nameField]);
  }

  onInputDecisionMakingUnit(event: any, init?: boolean) {
    const value = event.target.value;
    if (!this.selectedAgency) {
      return;
    }
    switch (this.selectedAgency.type) {
      case 1:
        this.requestParam.dataRequest = {name: value};
        this.getUnitData('police/getPage/', this.requestParam, init);
        break;
      case 2:
        this.requestParam.dataRequest = {armyName: value};
        this.getUnitData('army/getPage/', this.requestParam, init);
        break;
      case 3:
        this.requestParam.dataRequest = {customName: value};
        this.getUnitData('customs/getPage/', this.requestParam, init);
        break;
      case 4:
        this.requestParam.dataRequest = {rangName: value};
        this.getUnitData('ranger/getPage/', this.requestParam, init);
        break;
      case 5:
        this.requestParam.dataRequest = {borguaName: value};
        this.getUnitData('borderGuards/getPage/', this.requestParam, init);
        break;
      case 6:
        this.requestParam.dataRequest = {name: value};
        this.getUnitData('spc/getPage/', this.requestParam, init);
        break;
      case 7:
        this.requestParam.dataRequest = {name: value};
        this.getUnitData('spp/getPage/', this.requestParam, init);
        break;
      default:
        this.decisionUnitsFromResponse = [];
        if (!this.decisionMakingUnitSub.closed) {
          this.decisionMakingUnitSub.unsubscribe();
        }
    }
  }

  validateDate() {
    if (this.decisionList) {
      let checkList: ArrestSettlementDecisionModel[];
      const decisionId = this.arrestSettlementDecisionForm.get('decisionId').value;
      if (this.mode === ComponentMode.UPDATE) {
        checkList =
          this.decisionList.filter((e, index) =>
            e.decisionId === decisionId &&
            e.status === GeneralModelStatus.ACTIVE &&
            index !== this.listDecisionIndex);
      } else if (this.mode === ComponentMode.COPPY) {
        checkList =
          this.decisionList.filter(e =>
            e.decisionId === decisionId &&
            e.status === GeneralModelStatus.ACTIVE);
      } else if (this.mode === ComponentMode.CREATE) {
        checkList =
          this.decisionList.filter(e =>
            e.decisionId === decisionId &&
            e.status === GeneralModelStatus.ACTIVE);
      }

      const decisionNumber = this.arrestSettlementDecisionForm.get('decisionNumber').value;
      // tslint:disable-next-line:no-shadowed-variable
      const decisionDate: Date = this.arrestSettlementDecisionForm.get('decisionDate').value;
      if (decisionNumber) {
        if (checkList && checkList.length) {
          const duplicateDecisionNumber = checkList.find(e => e.decisionNumber === decisionNumber);
          const duplicateDecisionDate = checkList.find(e => DateUtils.compareDate(decisionDate, new Date(e.decisionDate)) === 0);
          if (duplicateDecisionNumber && duplicateDecisionDate) {
            this.settlementExisted = true;
            return;
          }
        }
      }
    }
    this.settlementExisted = false;
    // check date order
    let previousDecision: ArrestSettlementDecisionModel;
    let nextDecision: ArrestSettlementDecisionModel;
    if (this.mode === ComponentMode.UPDATE) {
      previousDecision = this.decisionList[this.listDecisionIndex - 1];
      nextDecision = this.decisionList[this.listDecisionIndex + 1];
    } else {
      previousDecision = this.decisionList[this.decisionList.length - 1];
      nextDecision = null;
    }
    const decisionDate: Date = new Date(this.arrestSettlementDecisionForm.get('decisionDate').value);
    if (previousDecision) {
      const previousDate = new Date(previousDecision.decisionDate);
      this.settlementLowerDateOrder = DateUtils.compareDate(previousDate, decisionDate) > 0;
    }
    if (nextDecision) {
      const nextDate = new Date(nextDecision.decisionDate);
      this.settlementHigherDateOrder = DateUtils.compareDate(nextDate, decisionDate) < 0;
    }

    if (this.mode === ComponentMode.CREATE) {
      if (this.decisionList.length > 0) {
        const decisionsForArrestee = this.decisionList.filter(e => {
          if (e.arresteeId === this.arrestSettlementDecisionForm.get('arresteeId').value) {
            return e;
          }
        });
        if (decisionsForArrestee.length > 0) {
          const maxDecisionDate = decisionsForArrestee.reduce(
            (prev, curr) => {
              return DateUtils.compareDate(new Date(prev.decisionDate), new Date(curr.decisionDate)) > 0 ? prev : curr;
            });
          if (maxDecisionDate && DateUtils.compareDate(new Date(decisionDate), new Date(maxDecisionDate.decisionDate)) < 0) {
            this.arrestSettlementDecisionForm.get('decisionDate').setErrors({lessThanOldestDate: true});
          }
        }
      }
    }
    if (this.mode === ComponentMode.COPPY) {
      if (this.decisionList.length > 0) {
        const decisionsForArrestee = this.decisionList.filter(e => {
          if (e.arresteeId === this.arrestSettlementDecisionForm.get('arresteeId').value) {
            return e;
          }
        });
        if (decisionsForArrestee.length > 0) {
          const maxDecisionDate = decisionsForArrestee.reduce(
            (prev, curr) => {
              return DateUtils.compareDate(new Date(prev.decisionDate), new Date(curr.decisionDate)) > 0 ? prev : curr;
            });
          if (maxDecisionDate && DateUtils.compareDate(new Date(decisionDate), new Date(maxDecisionDate.decisionDate)) < 0) {
            this.arrestSettlementDecisionForm.get('decisionDate').setErrors({lessThanOldestDate: true});
          }
        }
      }
    }
  }

  getUnitData(apiUrl: string, query: any, init?: boolean) {
    this.constantService.postRequest(this.constantService.MANAGE_URL + apiUrl, query)
      .toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (resJson.responseData) {
            if (resJson.responseData.data) {
              this.decisionUnitsFromResponse = resJson.responseData.data;
              this.setDecisionMakingUnitValue(init);
            } else {
              this.decisionUnitsFromResponse = null;
            }
          }
        } else {
          this.decisionUnitsFromResponse = null;
        }
      }).catch(err => {
      this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
    });
  }

  checkMaxlengCustom() {
    const content = this.arrestSettlementDecisionForm.get('reason').value;
    const recaptureDateErr = this.arrestSettlementDecisionForm.get('reason').errors;
    const textEncoder = new TextEncoder();
    const invalidArrestContent = textEncoder.encode(content).length > 3000;
    this.arrestSettlementDecisionForm.get('reason').setErrors(invalidArrestContent ? {
      ...recaptureDateErr,
      invalidMaxlength: true
    } : null);
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
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

  dayMonthYearOnChange() {
    if (this.arrestSettlementDecisionForm.get('effectStartDate').value && this.arrestSettlementDecisionForm.get('dayMonthYear').value !== ''
      && this.arrestSettlementDecisionForm.get('dayMonthYear').value !== 0) {
      this.arrestSettlementDecisionForm.get('effectEndDate').setValue(this.convertDayMonthYearToDate(this.arrestSettlementDecisionForm.get('typeDate').value));
    }
    // else {
    //   this.arrestSettlementDecisionForm.get('effectEndDate').setValue(null);
    // }
  }

  typeDateOnChange(value: any): void {
    if (this.arrestSettlementDecisionForm.get('effectStartDate').value && this.arrestSettlementDecisionForm.get('dayMonthYear').value !== ''
      && this.arrestSettlementDecisionForm.get('dayMonthYear').value !== 0) {
      this.arrestSettlementDecisionForm.get('effectEndDate').setValue(this.convertDayMonthYearToDate(value));
    }
    // else {
    //   this.arrestSettlementDecisionForm.get('effectEndDate').setValue(null);
    // }
  }

  effectStartDateOnChange() {
    if (this.arrestSettlementDecisionForm.get('effectStartDate').value && this.arrestSettlementDecisionForm.get('dayMonthYear').value !== ''
      && this.arrestSettlementDecisionForm.get('dayMonthYear').value !== 0) {
      this.arrestSettlementDecisionForm.get('effectEndDate').setValue(this.convertDayMonthYearToDate(this.arrestSettlementDecisionForm.get('typeDate').value));
    } else {
      this.arrestSettlementDecisionForm.get('effectEndDate').setValue(null);
    }
  }

  convertDayMonthYearToDate(value: any) {
    const date = new Date(this.arrestSettlementDecisionForm.get('effectStartDate').value);
    if (value === 'day') {
      date.setDate(date.getDate() + this.arrestSettlementDecisionForm.get('dayMonthYear').value);
    } else if (value === 'month') {
      date.setMonth(date.getMonth() + this.arrestSettlementDecisionForm.get('dayMonthYear').value);
    } else if (value === 'year') {
      date.setFullYear(date.getFullYear() + this.arrestSettlementDecisionForm.get('dayMonthYear').value);
    }
    return date;
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
      const rs = this.lstInpectors.find(s => s.FULLNAME === this.arrestSettlementDecisionForm.get('signer').value);
      if (rs) {
        this.categoriesService.getInspectorByinpcode(rs?.INSPCODE).subscribe(res => {
          this.inspectorOpions = [res];
          this.arrestSettlementDecisionForm.get('singerPosition').setValue(res.JOBTITLE);
        }, err => {
          console.log(err.error.text);
        });
      }
    }
  }
}
