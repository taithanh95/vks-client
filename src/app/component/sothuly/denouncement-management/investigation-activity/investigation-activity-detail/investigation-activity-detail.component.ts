import {
  Component,
  EventEmitter, Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InvestigationActivityModel} from '../../../../../model/investigation-activity.model';
import {Subscription} from 'rxjs';
import {ComponentMode} from '../../../../../shared/constants/constant.class';
import {ApParamModel} from '../../../../../model/ap-param.model';
import * as moment from 'moment';
import {NzAutocompleteComponent, NzAutocompleteOptionComponent} from 'ng-zorro-antd/auto-complete';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {CompareWith} from 'ng-zorro-antd/core/types';
import {StringService} from "../../../../../common/util/string.service";

@Component({
  selector: 'app-investigation-activity-detail',
  templateUrl: './investigation-activity-detail.component.html',
  styleUrls: ['./investigation-activity-detail.component.scss']
})
export class InvestigationActivityDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() isVisibleDialog: boolean;
  @Input() investigationActivity: InvestigationActivityModel;
  @Input() investigationActivityType: ApParamModel[] = [];
  @Input() denouncementProcessType: ApParamModel[] = [];
  @Input() procurators: any[];
  @Output() saveEmitter: EventEmitter<InvestigationActivityModel> = new EventEmitter<InvestigationActivityModel>();
  @Output() cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('autoProcuratorList') autoProcuratorList: NzAutocompleteComponent;
  isCollapse = true;
  modeEnum = ComponentMode;
  investigationActivityForm: FormGroup = this.fb.group({
    investigationActivityType: [null, [Validators.required]],
    procuracyParticipated: [false],
    reasonForNotParticipating: [null, [Validators.maxLength(200)]],
    executionDate: [null],
    investigator: [null, [Validators.maxLength(200)]],
    participatedProcurator: [null, []],
    participatedProcuratorId: [null],
    participatedProcuratorTemp: [null],
    assessment: [null, [Validators.maxLength(500)]],
    result: [null, [Validators.maxLength(2000)]],
    // processType: [null, [Validators.required]],
    note: [null, [Validators.maxLength(1000)]]
  });
  procuracyParticipated = true;
  subscription: Subscription = new Subscription();

  procuratorsSuggestion: any[];
  isConfirmLoading = false;

  constructor(
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private stringService: StringService
  ) {
  }

  compareProcurator: CompareWith = (o1, o2) => {
    if (o1 && o2) {
      return o1.inspCode === o2.inspCode;
    }
    return false;
  };

  ngOnInit(): void {
    this.subscription.add(this.investigationActivityForm.get('procuracyParticipated')
      .valueChanges.subscribe(next => {
        this.procuracyParticipated = next;
      }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisibleDialog && this.isVisibleDialog) {
      this.investigationActivityForm.reset();
      if (this.investigationActivity) {
        switch (this.mode) {
          case ComponentMode.VIEW:
          case ComponentMode.VIEW_FROM_PARENT:
            this.investigationActivityForm.disable();
            this.investigationActivityForm.patchValue({
              ...this.investigationActivity
            });
            this.onInputProcuratorName({target: {value: this.investigationActivity.participatedProcurator}}, true);
            break;
          case ComponentMode.UPDATE:
            this.investigationActivityForm.enable();
            this.investigationActivityForm.patchValue({
              ...this.investigationActivity
            });
            this.onInputProcuratorName({target: {value: this.investigationActivity.participatedProcurator}}, true);
            break;
          case ComponentMode.CREATE:
            this.investigationActivityForm.enable();
            this.investigationActivityForm.get('procuracyParticipated').setValue(true);
            this.onInputProcuratorName({target: {value: ''}}, false);
            break;
        }
      } else {
        this.investigationActivityForm.enable();
        this.investigationActivityForm.get('procuracyParticipated').setValue(true);
        this.onInputProcuratorName({target: {value: ''}}, false);
      }
    }
    if (changes.procurators && this.procurators) {
      this.procuratorsSuggestion = this.procurators.slice(0, 9);
    }
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  handleOk() {
    this.isConfirmLoading = true;
    Object.keys(this.investigationActivityForm.controls).forEach(key => {
      this.investigationActivityForm.get(key).markAsDirty();
      this.investigationActivityForm.get(key).updateValueAndValidity();
    });

    if (this.investigationActivityForm.get('participatedProcuratorTemp').value) {
      const selected = this.investigationActivityForm.get('participatedProcuratorTemp').value;
      const text = this.investigationActivityForm.get('participatedProcurator').value;
      if (!selected.fullName || !text || !(selected.fullName.trim() === text.trim())) {
        this.investigationActivityForm.get('participatedProcuratorTemp').setErrors({notInList: true});
      } else {
        this.investigationActivityForm.get('participatedProcuratorTemp').setErrors(null);
      }
    } else {
      if (this.investigationActivityForm.get('participatedProcurator').value) {
        this.investigationActivityForm.get('participatedProcuratorTemp').setErrors({notInList: true});
      } else {
        this.investigationActivityForm.get('participatedProcuratorTemp').setErrors(null);
      }
    }

    if (this.investigationActivityForm.get('procuracyParticipated').value) {
      this.investigationActivityForm.get('reasonForNotParticipating').setValue(null);
      this.investigationActivityForm.get('reasonForNotParticipating').setValidators(null);
    } else {
      this.investigationActivityForm.get('reasonForNotParticipating').setValidators(Validators.maxLength(200));
    }
    this.investigationActivityForm.get('investigator').setValue(this.stringService.capitalize(this.investigationActivityForm.get('investigator').value));
    this.investigationActivityForm.updateValueAndValidity();
    if (this.investigationActivityForm.invalid) {
      // to do
      this.isConfirmLoading = false;
    } else {
      setTimeout(() => {
        if (!this.investigationActivityForm.get('participatedProcurator').value) {
          this.investigationActivityForm.get('participatedProcurator').setValue(null);
          this.investigationActivityForm.get('participatedProcuratorTemp').setValue(null);
          this.investigationActivityForm.get('participatedProcuratorId').setValue(null);
        }
        const investigationActivity: InvestigationActivityModel =
          {...this.investigationActivity, ...this.investigationActivityForm.value};
        for (const prop in investigationActivity) {
          if (investigationActivity.hasOwnProperty(prop) && investigationActivity[prop] &&
            typeof investigationActivity[prop] === 'string') {
            investigationActivity[prop] = investigationActivity[prop]?.trim();
          }
        }
        this.saveEmitter.emit(investigationActivity);
        this.isConfirmLoading = false;
        this.isVisibleDialog = false;
      }, 500);
    }
  }

  handleCancel() {
    this.cancelEmitter.emit();
  }

  onInputProcuratorName(event: any, init?: boolean) {
    const value = (event.target as HTMLInputElement).value;
    this.investigationActivityForm.get('participatedProcurator').setValue(value);
    if (value != null) {
      this.procuratorsSuggestion = this.procurators
        .filter(e => e.fullName?.toLowerCase().includes(value.toLowerCase()) || false).slice(0, 10);
      this.setParticipatedProcuratorValue(init);
    }

  }

  setParticipatedProcuratorValue(init?: boolean) {
    if (init) {
      const obj = {
        inspCode: this.investigationActivity.participatedProcuratorId,
        fullName: this.investigationActivity.participatedProcurator
      };
      const option: NzAutocompleteOptionComponent = this.autoProcuratorList.getOption(obj);
      if (option) {
        this.investigationActivityForm.get('participatedProcuratorTemp').setValue(option.nzValue);
        this.investigationActivityForm.get('participatedProcurator').setValue(option.nzValue.fullName);
        this.investigationActivityForm.get('participatedProcuratorId').setValue(option.nzValue.inspCode);
      } else {
        this.investigationActivityForm.get('participatedProcuratorId').setValue(null);
        this.investigationActivityForm.get('participatedProcurator').setValue(null);
      }
    }
  }

  selectProcurator(event: NzAutocompleteOptionComponent) {
    this.investigationActivityForm.get('participatedProcurator').setValue(event.nzValue.fullName);
    this.investigationActivityForm.get('participatedProcuratorId').setValue(event.nzValue.inspCode);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

}
