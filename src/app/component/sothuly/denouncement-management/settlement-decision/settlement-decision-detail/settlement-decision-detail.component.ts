import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SettlementDecisionModel} from '../../../../../model/settlement-decision.model';
import {CategoriesService} from '../../../../../service/categories.service';
import {Subscription} from 'rxjs';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../shared/constants/constant.class';
import {ApParamModel} from '../../../../../model/ap-param.model';
import {ApParamService} from '../../../../../service/apparam.service';
import {DateUtils} from '../../../../../shared/utils/date-utils.class';
import {DatePipe} from '@angular/common';
import {ParsePipe} from 'ngx-moment';
import * as moment from 'moment';
import {NzAutocompleteComponent, NzAutocompleteOptionComponent} from 'ng-zorro-antd/auto-complete';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {CompareWith} from 'ng-zorro-antd/core/types';
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";
import {DateService} from '../../../../../common/util/date.service';
import {CustomValidator} from '../../../../../shared/custom-validator/custom-validator.class';

@Component({
  selector: 'app-settlement-decision-detail',
  templateUrl: './settlement-decision-detail.component.html',
  styleUrls: ['./settlement-decision-detail.component.scss']
})
export class SettlementDecisionDetailComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('autoDecisionList') autoDecisionList: NzAutocompleteComponent;

  @ViewChild('autoDecisionMakingUnitList') autoDecisionMakingUnitList: NzAutocompleteComponent;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() isVisibleDialog: boolean;
  @Input() settlementDecisionIndex: number;
  @Input() settlementDecision: SettlementDecisionModel;
  @Input() settlementDecisionListToCheck: SettlementDecisionModel[];
  @Output() saveEmitter: EventEmitter<SettlementDecisionModel> = new EventEmitter<SettlementDecisionModel>();
  @Output() cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() decisionAgencies: ApParamModel[] = [];
  isCollapse = true;
  modeEnum = ComponentMode;

  lstInpectors: any[]
  inspectorOpions: any[]
  sppId: any;

  settlementDecisionForm: FormGroup = this.fb.group({
    decisionNumber: [null, [Validators.maxLength(20)]],
    decisionDate: [null, [Validators.required]],
    decisionId: [null, [Validators.required]],
    decisionName: [null],
    decisionTemp: [null, [Validators.required]],
    decisionMakingAgency: [null, [Validators.required]],
    decisionMakingUnitId: [null, [Validators.required]],
    decisionMakingUnit: [null, [Validators.required]],
    decisionMakingUnitTemp: [null, [Validators.required]],
    effectStartDate: [null, [Validators.required]],
    effectEndDate: [null],
    description: [null, [Validators.maxLength(1000)]],
    signer: [null, [Validators.maxLength(200)]],
    position: [null, [Validators.maxLength(200)]],
    requestVks: false,
    assessment: [null]
  });

  selectedAgency: { type: number, name: string, idFieldName: string };

  decisionUnits: any[] = [];
  decisionList: any[] = [];
  decisionNameSubscription: Subscription = new Subscription();
  decisionMakingAgentSub: Subscription = new Subscription();
  decisionMakingUnitSub: Subscription = new Subscription();
  settlementExisted: boolean;
  settlementLowerDateOrder: boolean;
  settlementHigherDateOrder: boolean;
  isConfirmLoading = false;

  constructor(
    private fb: FormBuilder, private apParamService: ApParamService,
              private categoriesService: CategoriesService,
              private datePipe: DatePipe,
              private parsePipe: ParsePipe,
              private notificationService: NzNotificationService,
              private dateService: DateService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.decisionNameSubscription.add(
      this.categoriesService.getListDecision_ForTBTG({search: '', page: 0, size: 10}).subscribe(next => {
        this.decisionList = next ? next.datas : [];
      }, error => {
        console.error(error);
      })
    );
    this.decisionMakingAgentSub = this.settlementDecisionForm.get('decisionMakingAgency').valueChanges
      .subscribe(next => {
        const val = this.settlementDecisionForm.get('decisionMakingUnit').value || '';
        switch (next) {
          case '1':
            this.selectedAgency = {name: next, type: 1, idFieldName: 'invesCode'};
            this.onInputDecisionMakingUnit({target: {value: val}}, true);
            break;
          case '2':
            this.selectedAgency = {name: next, type: 2, idFieldName: 'policeId'};
            this.onInputDecisionMakingUnit({target: {value: val}}, true);
            break;
          case '3':
            this.selectedAgency = {name: next, type: 3, idFieldName: 'sppId'};
            this.onInputDecisionMakingUnit({target: {value: val}}, true);
            break;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisibleDialog) {
      this.settlementDecisionForm.reset();
    }
    if (changes.isVisibleDialog && this.isVisibleDialog) {
      this.settlementDecisionForm.reset();
      this.settlementExisted = false;
      if (this.settlementDecision) {
        switch (this.mode) {
          case ComponentMode.VIEW:
          case ComponentMode.VIEW_FROM_PARENT:
            this.settlementDecisionForm.disable();
            this.settlementDecisionForm.patchValue({
              ...this.settlementDecision
            });
            this.settlementDecisionForm.get('decisionMakingUnitTemp').setValue(this.settlementDecision.decisionMakingUnit);
            this.onInputDecisionMakingUnit({target: {value: this.settlementDecision.decisionMakingUnit}}, true);
            this.onInputDecisionName({target: {value: this.settlementDecision.decisionName}}, true);
            break;
          case ComponentMode.UPDATE:
            this.settlementDecisionForm.enable();
            this.settlementDecisionForm.patchValue({
              ...this.settlementDecision
            });
            this.settlementDecisionForm.get('decisionMakingUnitTemp').setValue(this.settlementDecision.decisionMakingUnit);
            this.onInputDecisionMakingUnit({target: {value: this.settlementDecision.decisionMakingUnit}}, true);
            this.onInputDecisionName({target: {value: this.settlementDecision.decisionName}}, true);
            break;
          case ComponentMode.CREATE:
            this.settlementDecisionForm.enable();
            this.onInputDecisionName({target: {value: ''}}, false);
            break;
        }
      } else {
        this.settlementDecisionForm.enable();
        this.settlementDecisionForm.patchValue({
          decisionDate: new Date(),
          effectStartDate: new Date()
        });
        this.onInputDecisionName({target: {value: ''}}, false);
      }
    }
  }

  ngOnDestroy(): void {
    this.decisionNameSubscription.unsubscribe();
    this.decisionMakingUnitSub.unsubscribe();
    this.decisionMakingAgentSub.unsubscribe();
  }

  compareDecision: CompareWith = (o1: any, o2: any) => {
    const id1 = o1 ? o1.deciid : null;
    const id2 = o2 ? o2.deciid : null;
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

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }


  handleOk() {
    this.isConfirmLoading = true;
    Object.keys(this.settlementDecisionForm.controls).forEach(key => {
      this.settlementDecisionForm.get(key).markAsDirty();
      this.settlementDecisionForm.get(key).updateValueAndValidity();
    });

    if (this.settlementDecisionForm.get('decisionTemp').value) {
      const selected = this.settlementDecisionForm.get('decisionTemp').value;
      const text = this.settlementDecisionForm.get('decisionName').value;
      if (!(selected.deciname === text)) {
        this.settlementDecisionForm.get('decisionTemp').setErrors({notInList: true});
      } else {
        this.settlementDecisionForm.get('decisionTemp').setErrors(null);
      }
      // if(selected.deciid === '10101'){
      //   this.settlementDecisionForm.get('effectEndDate').setErrors({invalidEndDate: true});
      // } else {
      //   this.settlementDecisionForm.get('effectEndDate').setErrors(null);
      // }
    } else {
      if (this.settlementDecisionForm.get('decisionName').value) {
        this.settlementDecisionForm.get('decisionTemp').setErrors({notInList: true});
      } else {
        this.settlementDecisionForm.get('decisionTemp').setErrors({required: true});
      }
    }

    if (this.settlementDecisionForm.get('decisionMakingUnitTemp').value) {
      const selected = this.settlementDecisionForm.get('decisionMakingUnitTemp').value;
      const text = this.settlementDecisionForm.get('decisionMakingUnit').value;
      if (!(selected.name === text)) {
        this.settlementDecisionForm.get('decisionMakingUnitTemp').setErrors({notInList: true});
      } else {
        this.settlementDecisionForm.get('decisionMakingUnitTemp').setErrors(null);
      }
    } else {
      if (this.settlementDecisionForm.get('decisionMakingUnit').value) {
        this.settlementDecisionForm.get('decisionMakingUnitTemp').setErrors({notInList: true});
      } else {
        this.settlementDecisionForm.get('decisionMakingUnitTemp').setErrors({required: true});
      }
    }

    const effectStartDate = this.settlementDecisionForm.get('effectStartDate').value;
    const effectEndDate = this.settlementDecisionForm.get('effectEndDate').value;
    const invalidDate = effectStartDate && effectEndDate &&
      (DateUtils.compareDate(new Date(effectStartDate), new Date(effectEndDate)) > 0);
    this.settlementDecisionForm.get('effectEndDate').setErrors(invalidDate ? {invalidEndDate: true} : null);

    this.validateDate();
    this.settlementDecisionForm.updateValueAndValidity();
    if (this.settlementDecisionForm.invalid || this.settlementExisted || this.settlementLowerDateOrder) {
      // to do
      this.isConfirmLoading = false;
    } else {
      // setTimeout(() => {
      if (!this.settlementDecisionForm.get('decisionMakingUnit').value) {
        this.settlementDecisionForm.get('decisionMakingUnit').setValue(null);
        this.settlementDecisionForm.get('decisionMakingUnitTemp').setValue(null);
        this.settlementDecisionForm.get('decisionMakingUnitId').setValue(null);
      }
      if (!this.settlementDecisionForm.get('decisionName').value) {
        this.settlementDecisionForm.get('decisionName').setValue(null);
        this.settlementDecisionForm.get('decisionTemp').setValue(null);
        this.settlementDecisionForm.get('decisionId').setValue(null);
      }
      const settlementDecision: SettlementDecisionModel = {...this.settlementDecision, ...this.settlementDecisionForm.value};
      for (const prop in settlementDecision) {
        if (settlementDecision.hasOwnProperty(prop) && settlementDecision[prop] && typeof settlementDecision[prop] === 'string') {
          settlementDecision[prop] = settlementDecision[prop]?.trim();
        }
      }
      this.saveEmitter.emit(settlementDecision);
      this.isConfirmLoading = false;
      this.isVisibleDialog = false;
      // }, 500);
    }
  }

  handleCancel() {
    this.cancelEmitter.emit();
  }

  setDecisionValue(init?: boolean) {
    if (init) {
      const delay = setTimeout(() => {
        const option: NzAutocompleteOptionComponent = this.autoDecisionList.getOption({
          deciid: this.settlementDecision.decisionId,
          deciname: this.settlementDecision.decisionName
        });
        if (option) {
          this.settlementDecisionForm.get('decisionTemp').setValue(option.nzValue);
        } else {
          this.settlementDecisionForm.get('decisionId').setValue(null);
          this.settlementDecisionForm.get('decisionName').setValue(null);
        }
        clearTimeout(delay);
      }, 0);
    }
  }

  setDecisionMakingUnitValue(init?: boolean) {
    if (init && this.settlementDecision) {
      const obj = {
        [this.selectedAgency.idFieldName]: this.settlementDecision.decisionMakingUnitId,
        name: this.settlementDecision.decisionMakingUnit
      };
      const delay = setTimeout(() => {
        const option: NzAutocompleteOptionComponent = this.autoDecisionMakingUnitList.getOption(obj);
        if (option) {
          this.settlementDecisionForm.get('decisionMakingUnitTemp').setValue(option.nzValue);
          this.settlementDecisionForm.get('decisionMakingUnitId').setValue(option.nzValue[this.selectedAgency.idFieldName]);
          this.settlementDecisionForm.get('decisionMakingUnit').setValue(option.nzValue.name);
        } else {
          this.settlementDecisionForm.get('decisionMakingUnitId').setValue(null);
          this.settlementDecisionForm.get('decisionMakingUnit').setValue(null);
        }
        clearTimeout(delay);
      }, 0);
    }
  }

  onInputDecisionMakingUnit(event: any, init?: boolean) {
    const value = (event.target as HTMLInputElement).value;
    this.settlementDecisionForm.get('decisionMakingUnit').setValue(value);
    if (!this.selectedAgency) {
      return;
    }
    switch (this.selectedAgency.type) {
      case 1:
        this.decisionMakingUnitSub = this.categoriesService.getListInvestigativeAgency({name: value}).subscribe(next => {
          this.decisionUnits = next ? next.responseData?.data : [];
          this.setDecisionMakingUnitValue(init);
        }, error => {
          console.error(error);
        });
        break;
      case 2:
        this.decisionMakingUnitSub = this.categoriesService.getPoliceSelect({name: value}).subscribe(next => {
          this.decisionUnits = next ? next.datas : [];
          this.setDecisionMakingUnitValue(init);
        }, error => {
          console.error(error);
        });
        break;
      case 3:
        this.decisionMakingUnitSub = this.categoriesService.getSppSelect({name: value}).subscribe(next => {
          this.decisionUnits = next ? next.datas : [];
          this.setDecisionMakingUnitValue(init);
        }, error => {
          console.error(error);
        });
        break;
      default:
        if (!this.decisionMakingUnitSub.closed) {
          this.decisionMakingUnitSub.unsubscribe();
        }
    }
  }

  onInputDecisionName(event: any, init?: boolean) {
    const deciid = ['0101', '0102', '10108', '10102', '10109', '10101', '10103', '10104', '10105'];
    const value = (event.target as HTMLInputElement).value;
    this.settlementDecisionForm.get('decisionName').setValue(value);
    this.decisionNameSubscription.add(
      this.categoriesService.getListDecision_ForTBTG({search: value, page: 0, size: 100}).subscribe(next => {
        const decisionList = next ? next.datas : [];
        this.setDecisionValue(init);
        this.decisionList = decisionList.filter(obj => deciid.includes(obj.deciid));
      }, error => {
        console.error(error);
      })
    );
  }

  selectDecision(event: NzAutocompleteOptionComponent) {
    this.settlementDecisionForm.get('decisionId').setValue(event.nzValue.deciid);
    this.settlementDecisionForm.get('decisionName').setValue(event.nzValue.deciname);
  }

  selectDecisionMakingUnit(event: NzAutocompleteOptionComponent) {
    this.settlementDecisionForm.get('decisionMakingUnitId').setValue(event.nzValue[this.selectedAgency.idFieldName]);
    this.settlementDecisionForm.get('decisionMakingUnit').setValue(event.nzValue.name);
  }

  stringToDate(date: Date | string): Date {
    return this.parsePipe.transform(date, 'DD/MM/YYYY').toDate();
  }

  dateToString(date: Date | string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  validateDate() {
    if (this.settlementDecisionListToCheck) {
      let checkList: SettlementDecisionModel[];
      const decisionId = this.settlementDecisionForm.get('decisionId').value;
      if (this.mode === ComponentMode.UPDATE) {
        checkList =
          this.settlementDecisionListToCheck.filter((e, index) =>
            e.decisionId === decisionId &&
            e.status === GeneralModelStatus.ACTIVE &&
            index !== this.settlementDecisionIndex);
      } else if (this.mode === ComponentMode.CREATE) {
        checkList =
          this.settlementDecisionListToCheck.filter(e =>
            e.decisionId === decisionId &&
            e.status === GeneralModelStatus.ACTIVE);
      }

      const decisionNumber = this.settlementDecisionForm.get('decisionNumber').value;
      // const decisionDate: Date = this.settlementDecisionForm.get('decisionDate').value;
      if (checkList && checkList.length) {
        const duplicateDecisionNumber = checkList.find(e => e.decisionNumber === decisionNumber);
        const duplicateDecisionDate = checkList.find(e =>
          DateUtils.compareDate(new Date(this.settlementDecisionForm.get('decisionDate').value), new Date(e.decisionDate)) === 0);
        if (duplicateDecisionNumber && duplicateDecisionDate) {
          this.settlementExisted = true;
          return;
        }
      }
    }
    this.settlementExisted = false;
    // check date order
    let previousDecision: SettlementDecisionModel;
    let nextDecision: SettlementDecisionModel;
    if (this.mode === ComponentMode.UPDATE) {
      previousDecision = this.settlementDecisionListToCheck[this.settlementDecisionIndex - 1];
      nextDecision = this.settlementDecisionListToCheck[this.settlementDecisionIndex + 1];
    } else {
      previousDecision = this.settlementDecisionListToCheck[this.settlementDecisionListToCheck.length - 1];
      nextDecision = null;
    }
    const decisionDate: Date = new Date(this.settlementDecisionForm.get('decisionDate').value);
    if (previousDecision) {
      const previousDate = this.stringToDate(previousDecision.decisionDate);
      this.settlementLowerDateOrder = DateUtils.compareDate(previousDate, decisionDate) > 0;
    }
    if (nextDecision) {
      const nextDate = this.stringToDate(nextDecision.decisionDate);
      this.settlementHigherDateOrder = DateUtils.compareDate(nextDate, decisionDate) < 0;
    }
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

  decisionMakingAgencyChange($event: any) {
    this.settlementDecisionForm.get('decisionMakingUnit').setValue(null);
    this.settlementDecisionForm.get('decisionMakingUnitTemp').setValue(null);
    this.settlementDecisionForm.get('decisionMakingUnitId').setValue(null);
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
      const rs = this.lstInpectors.find(s => s.FULLNAME === this.settlementDecisionForm.get('signer').value);
      if (rs) {
        this.categoriesService.getInspectorByinpcode(rs?.INSPCODE).subscribe(res => {
          this.inspectorOpions = [res];
          this.settlementDecisionForm.get('position').setValue(res.JOBTITLE);
        }, err => {
          console.log(err.error.text);
        });
      }
    }
  }
}
