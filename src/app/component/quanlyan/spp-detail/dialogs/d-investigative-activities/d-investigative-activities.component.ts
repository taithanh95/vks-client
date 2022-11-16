import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ComponentMode} from '../../../../../shared/constants/constant.class';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApParamModel} from '../../../../../model/ap-param.model';
import {NzAutocompleteComponent, NzAutocompleteOptionComponent, NzOptionSelectionChange} from 'ng-zorro-antd/auto-complete';
import {Subscription} from 'rxjs';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {CompareWith} from 'ng-zorro-antd/core/types';
import * as moment from 'moment';
import {StringService} from '../../../../../common/util/string.service';

@Component({
  selector: 'app-d-investigative-activities',
  templateUrl: './d-investigative-activities.component.html',
  styleUrls: ['./d-investigative-activities.component.scss']
})
export class DInvestigativeActivitiesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() isVisible: boolean;
  @Input() investigationActivity: any;
  @Input() procurators: any[];
  @Input() investigationActivityType: ApParamModel[] = [];
  @Input() denouncementProcessType: ApParamModel[] = [];
  @Output() submitForm: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @ViewChild('autoProcuratorList') autoProcuratorList: NzAutocompleteComponent;
  isCollapse = true;
  modeEnum = ComponentMode;
  investigationActivityForm: FormGroup = this.fb.group({
    invetype: [null, [Validators.required]],
    invetype_name: [null, [Validators.required]],
    has_inspector: [false],
    reason: [null, [Validators.maxLength(1000)]],
    invedate: [null],
    investor: [null, [Validators.maxLength(50)]],
    insp_fullname: [null, []],
    inspcode: [null],
    participatedProcuratorTemp: [null],
    identify: [null, [Validators.maxLength(2000)]],
    content_results: [null, [Validators.maxLength(4000)]],
    remark: [null, [Validators.maxLength(2000)]]
  });
  has_inspector = true;
  subscription: Subscription = new Subscription();


  procuratorsSuggestion: any[];

  constructor(
    private fb: FormBuilder,
    private notificationService: NzNotificationService, private stringService: StringService) {
  }

  compareProcurator: CompareWith = (o1, o2) => {
    if (o1 && o2) {
      return o1.inspCode === o2.inspCode;
    }
    return false;
  };

  ngOnInit(): void {
    this.subscription.add(this.investigationActivityForm.get('has_inspector')
      .valueChanges.subscribe(next => {
        this.has_inspector = next;
      }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisible && this.isVisible) {
      this.investigationActivityForm.reset();
      if (this.investigationActivity) {
        switch (this.mode) {
          case ComponentMode.VIEW:
            this.investigationActivityForm.disable();
            this.investigationActivityForm.patchValue({
              ...this.investigationActivity
            });
            this.onInputProcuratorName({target: {value: this.investigationActivity.insp_fullname}}, true);
            break;
          case ComponentMode.UPDATE:
            this.investigationActivityForm.enable();
            this.investigationActivityForm.patchValue({
              ...this.investigationActivity
            });
            this.onInputProcuratorName({target: {value: this.investigationActivity.insp_fullname}}, true);
            break;
          case ComponentMode.CREATE:
            this.investigationActivityForm.enable();
            this.investigationActivityForm.get('has_inspector').setValue(true);
            this.onInputProcuratorName({target: {value: ''}}, false);
            break;
        }
      } else {
        this.investigationActivityForm.enable();
        this.investigationActivityForm.get('has_inspector').setValue(true);
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
    Object.keys(this.investigationActivityForm.controls).forEach(key => {
      this.investigationActivityForm.get(key).markAsDirty();
      this.investigationActivityForm.get(key).updateValueAndValidity();
    });

    if (this.investigationActivityForm.get('participatedProcuratorTemp').value) {
      const selected = this.investigationActivityForm.get('participatedProcuratorTemp').value;
      const text = this.investigationActivityForm.get('insp_fullname').value;
      if (!selected.fullName || !text || !(selected.fullName.trim() === text.trim())) {
        this.investigationActivityForm.get('participatedProcuratorTemp').setErrors({notInList: true});
      } else {
        this.investigationActivityForm.get('participatedProcuratorTemp').setErrors(null);
      }
    } else {
      if (this.investigationActivityForm.get('insp_fullname').value) {
        this.investigationActivityForm.get('participatedProcuratorTemp').setErrors({notInList: true});
      } else {
        this.investigationActivityForm.get('participatedProcuratorTemp').setErrors(null);
      }
    }

    if (this.investigationActivityForm.get('has_inspector').value) {
      this.investigationActivityForm.get('reason').setValue(null);
      this.investigationActivityForm.get('reason').setValidators(null);
    } else {
      this.investigationActivityForm.get('reason').setValidators(Validators.maxLength(1000));
    }

    this.investigationActivityForm.updateValueAndValidity();
    if (this.investigationActivityForm.invalid) {
      // to do
    } else {
      if (!this.investigationActivityForm.get('insp_fullname').value) {
        this.investigationActivityForm.get('insp_fullname').setValue(null);
        this.investigationActivityForm.get('participatedProcuratorTemp').setValue(null);
        this.investigationActivityForm.get('inspcode').setValue(null);
      }
      const investigationActivity: any =
        {...this.investigationActivity, ...this.investigationActivityForm.value};
      for (const prop in investigationActivity) {
        if (investigationActivity.hasOwnProperty(prop) && investigationActivity[prop] &&
          typeof investigationActivity[prop] === 'string') {
          investigationActivity[prop] = investigationActivity[prop]?.trim();
        }
      }
      this.submitForm.emit({...investigationActivity, investor: this.stringService.capitalize(this.investigationActivityForm.get('investor').value)});
      this.isVisible = false;
    }
  }

  handleCancel() {
    this.closeModal.emit(false);
    this.isVisible = false;
  }

  onInputProcuratorName(event: any, init?: boolean) {
    const value = (event.target as HTMLInputElement).value;
    this.investigationActivityForm.get('insp_fullname').setValue(value);
    if (value != null) {
      this.procuratorsSuggestion = this.procurators
        .filter(e => e.fullName?.toLowerCase().includes(value.toLowerCase()) || false).slice(0, 10);
      this.setParticipatedProcuratorValue(init);
    }

  }

  setParticipatedProcuratorValue(init?: boolean) {
    if (init) {
      const obj = {
        inspCode: this.investigationActivity.inspcode,
        fullName: this.investigationActivity.insp_fullname
      };
      const option: NzAutocompleteOptionComponent = this.autoProcuratorList.getOption(obj);
      if (option) {
        this.investigationActivityForm.get('participatedProcuratorTemp').setValue(option.nzValue);
        this.investigationActivityForm.get('insp_fullname').setValue(option.nzValue.fullName);
        this.investigationActivityForm.get('inspcode').setValue(option.nzValue.inspCode);
      } else {
        this.investigationActivityForm.get('inspcode').setValue(null);
        this.investigationActivityForm.get('insp_fullname').setValue(null);
      }
    }
  }

  selectProcurator(event: NzAutocompleteOptionComponent) {
    this.investigationActivityForm.get('insp_fullname').setValue(event.nzValue.fullName);
    this.investigationActivityForm.get('inspcode').setValue(event.nzValue.inspCode);
  }
  selectInvestigationActivityType(value: any){
    this.investigationActivityForm.get('invetype_name').setValue(
      this.investigationActivityType.find(n =>n.paramValue===value)?.paramName);
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
