import {
  Component,
  EventEmitter,
  Input,
  OnChanges, Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VerificationInvestigationModel} from '../../../../../model/verification-investigation.model';
import {ComponentMode} from '../../../../../shared/constants/constant.class';
import {NzAutocompleteComponent, NzAutocompleteOptionComponent} from 'ng-zorro-antd/auto-complete';
import {CompareWith} from 'ng-zorro-antd/core/types';
import * as moment from 'moment';
import {NzNotificationService} from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-verification-investigation-detail',
  templateUrl: './verification-investigation-detail.component.html',
  styleUrls: ['./verification-investigation-detail.component.scss']
})
export class VerificationInvestigationDetailComponent implements OnChanges {
  @ViewChild('autoProcuratorList') autoProcuratorList: NzAutocompleteComponent;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() isVisibleDialog: boolean;
  @Input() model: VerificationInvestigationModel = {
    contentRequest: '',
    createDate: null,
    createUser: '',
    id: 0,
    note: '',
    procuratorsRequest: '',
    procuratorsRequestId: '',
    result: '',
    status: null,
    type: null,
    updateDate: null,
    updateUser: '',
    verificationDate: null,
    verificationInvestigationCode: ''
  };
  @Output() saveEmitter: EventEmitter<VerificationInvestigationModel> = new EventEmitter<VerificationInvestigationModel>();
  @Output() cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
  isCollapse = true;
  modeEnum = ComponentMode;
  form: FormGroup = this.fb.group({
    verificationInvestigationCode: [null, [Validators.maxLength(10)]],
    verificationDate: [null, [Validators.required]],
    procuratorsRequestId: [null],
    procuratorsRequest: [null],
    procuratorsRequestTemp: [null],
    contentRequest: [null, [Validators.required, Validators.maxLength(2000)]],
    result: [null, [Validators.maxLength(2000)]],
    note: [null, [Validators.maxLength(2000)]],
    type: [null, [Validators.required]]
  });
  @Input() procurators: any[] = [];
  procuratorsSuggestion: any[] = [];
  typeOfVerification = [
    '',
    'Yêu cầu khởi tố vụ án',
    'Yêu cầu tiếp nhận, kiểm tra, xác minh, ra QĐ giải quyết nguồn tin về tội phạm',
    'Yêu cầu cung cấp tài liệu để kiểm sát việc giải quyết nguồn tin về tội phạm',
    'Yêu cầu chuyển nguồn tin về tội phạm',
    'Quyết định hủy bỏ khởi tố',
    'Yêu cầu khác'
  ];
  isConfirmLoading = false;

  constructor(private fb: FormBuilder,
              private notificationService: NzNotificationService) {
  }

  compareProcurator: CompareWith = (o1, o2) => {
    if (o1 && o2) {
      return o1.inspCode === o2.inspCode;
    }
    return false;
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisibleDialog && this.isVisibleDialog) {
      this.form.reset();
      if (this.model) {
        switch (this.mode) {
          case ComponentMode.VIEW:
          case ComponentMode.VIEW_FROM_PARENT:
            this.form.disable();
            this.form.patchValue({
              ...this.model
            });
            this.onInputProcuratorName({target: {value: this.model.procuratorsRequest}}, true);
            break;
          case ComponentMode.UPDATE:
            this.form.enable();
            this.form.patchValue({
              ...this.model
            });
            this.onInputProcuratorName({target: {value: this.model.procuratorsRequest}}, true);
            break;
          case ComponentMode.CREATE:
            this.form.enable();
            this.onInputProcuratorName({target: {value: ''}}, false);
            break;
        }
      }
    } else {
      this.form.enable();
      this.onInputProcuratorName({target: {value: ''}}, false);
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
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key).markAsDirty();
      this.form.get(key).updateValueAndValidity();
    });

    if (this.form.get('procuratorsRequestTemp').value) {
      const selected = this.form.get('procuratorsRequestTemp').value;
      const text = this.form.get('procuratorsRequest').value;
      if (!selected.fullName || !text && !(selected.fullName.trim() === text.trim())) {
        this.form.get('procuratorsRequestTemp').setErrors({notInList: true});
      } else {
        this.form.get('procuratorsRequestTemp').setErrors(null);
      }
    } else {
      if (this.form.get('procuratorsRequest').value) {
        this.form.get('procuratorsRequestTemp').setErrors({notInList: true});
      } else {
        this.form.get('procuratorsRequestTemp').setErrors(null);
      }
    }

    if (this.form.invalid) {
      // to do
      this.isConfirmLoading = false;
    } else {
      setTimeout(() => {
        if (!this.form.get('procuratorsRequest').value) {
          this.form.get('procuratorsRequest').setValue(null);
          this.form.get('procuratorsRequestTemp').setValue(null);
          this.form.get('procuratorsRequestId').setValue(null);
        }
        const verificationInvestigation: VerificationInvestigationModel =
          {...this.model, ...this.form.value};
        for (const prop in verificationInvestigation) {
          if (verificationInvestigation.hasOwnProperty(prop) && verificationInvestigation[prop] &&
            typeof verificationInvestigation[prop] === 'string') {
            verificationInvestigation[prop] = verificationInvestigation[prop]?.trim();
          }
        }
        this.saveEmitter.emit(verificationInvestigation);
        this.isConfirmLoading = false;
        this.isVisibleDialog = false;
      }, 500);
    }
  }

  handleCancel() {
    this.cancelEmitter.emit();
  }

  setProcuratorRequestValue(init?: boolean) {
    if (init) {
      const obj = {
        inspCode: this.model.procuratorsRequestId,
        fullName: this.model.procuratorsRequest
      };
      const delay = setTimeout(() => {
        const option: NzAutocompleteOptionComponent = this.autoProcuratorList.getOption(obj);
        if (option) {
          this.form.get('procuratorsRequestTemp').setValue(option.nzValue);
          this.form.get('procuratorsRequestId').setValue(option.nzValue.inspCode);
          this.form.get('procuratorsRequest').setValue(option.nzValue.fullName);
        } else {
          this.form.get('procuratorsRequestId').setValue(null);
          this.form.get('procuratorsRequest').setValue(null);
        }
        clearTimeout(delay);
      }, 0);
    }
  }

  onInputProcuratorName(event: any, init?: boolean) {
    const value = (event.target as HTMLInputElement).value;
    this.form.get('procuratorsRequest').setValue(value);
    if (value != null) {
      this.procuratorsSuggestion = this.procurators
        .filter(e => e.fullName?.toLowerCase().includes(value.toLowerCase()) || false).slice(0, 10);
      this.setProcuratorRequestValue(init);
    }
  }

  selectProcurator(event: NzAutocompleteOptionComponent) {
    this.form.get('procuratorsRequest').setValue(event.nzValue.fullName);
    this.form.get('procuratorsRequestId').setValue(event.nzValue.inspCode);
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
