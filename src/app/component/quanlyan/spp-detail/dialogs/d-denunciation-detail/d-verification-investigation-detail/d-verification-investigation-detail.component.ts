  import {
    Component,
    EventEmitter,
    Input,
    OnChanges, Output,
    SimpleChanges, ViewChild
  } from '@angular/core';
  import {FormBuilder, FormGroup, Validators} from '@angular/forms';
  import {ComponentMode} from '../../../../../../shared/constants/constant.class';
  import {NzAutocompleteComponent, NzAutocompleteOptionComponent} from 'ng-zorro-antd/auto-complete';
  import {CompareWith} from 'ng-zorro-antd/core/types';
  import { VerificationInvestigationModel } from '../../../../../../model/verification-investigation.model';
  
  @Component({
    selector: 'app-d-verification-investigation-detail',
    templateUrl: './d-verification-investigation-detail.component.html',
    styleUrls: ['./d-verification-investigation-detail.component.scss']
  })
  export class DVerificationInvestigationDetailComponent implements OnChanges {
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
    @Output() cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
    isCollapse = true;
    modeEnum = ComponentMode;
    form: FormGroup = this.fb.group({
      verificationInvestigationCode: [null],
      verificationDate: [null],
      procuratorsRequestId: [null],
      procuratorsRequest: [null],
      procuratorsRequestTemp: [null],
      contentRequest: [null],
      result: [null],
      note: [null],
      type: [null]
    });
    @Input() procurators: any[] = [];
    procuratorsSuggestion: any[] = [];
    typeOfVerification = [
      '',
      'Yêu cầu khởi tố vụ án',
      'Yêu cầu tiếp nhận, kiểm tra, xác minh, ra QĐ giải quyết nguồn tin về tội phạm',
      'Yêu cầu cung cấp tài liệu để kiểm sát việc giải quyết nguồn tin về tội phạm',
      'Yêu câu chuyển nguồn tin về tội phạm'
    ];
    isConfirmLoading = false;
  
    constructor(private fb: FormBuilder) {
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
              this.form.disable();
              this.form.patchValue({
                ...this.model
              });
              this.onInputProcuratorName({target: {value: this.model.procuratorsRequest}}, true);
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
}
  