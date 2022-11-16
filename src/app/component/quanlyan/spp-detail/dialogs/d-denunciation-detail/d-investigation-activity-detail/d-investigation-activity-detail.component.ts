  import {
    Component,
    EventEmitter, Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges, ViewChild
  } from '@angular/core';
  import {FormBuilder, FormGroup} from '@angular/forms';
  import {InvestigationActivityModel} from '../../../../../../model/investigation-activity.model';
  import {Subscription} from 'rxjs';
  import {ComponentMode} from '../../../../../../shared/constants/constant.class';
  import {ApParamModel} from '../../../../../../model/ap-param.model';
  import {NzAutocompleteComponent, NzAutocompleteOptionComponent} from 'ng-zorro-antd/auto-complete';
  import {CompareWith} from 'ng-zorro-antd/core/types';
  
  @Component({
    selector: 'app-d-investigation-activity-detail',
    templateUrl: './d-investigation-activity-detail.component.html',
    styleUrls: ['./d-investigation-activity-detail.component.scss']
  })
  export class DInvestigationActivityDetailComponent implements OnInit, OnChanges, OnDestroy {
    @Input() mode: ComponentMode = ComponentMode.CREATE;
    @Input() isVisibleDialog: boolean;
    @Input() investigationActivity: InvestigationActivityModel;
    @Input() investigationActivityType: ApParamModel[] = [];
    @Input() denouncementProcessType: ApParamModel[] = [];
    @Input() procurators: any[];
    @Output() cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
    @ViewChild('autoProcuratorList') autoProcuratorList: NzAutocompleteComponent;
    isCollapse = true;
    modeEnum = ComponentMode;
    investigationActivityForm: FormGroup = this.fb.group({
      investigationActivityType: [null],
      procuracyParticipated: [false],
      reasonForNotParticipating: [null],
      executionDate: [null],
      investigator: [null],
      participatedProcurator: [null, []],
      participatedProcuratorId: [null],
      participatedProcuratorTemp: [null],
      assessment: [null],
      result: [null],
      note: [null]
    });
    procuracyParticipated = true;
    subscription: Subscription = new Subscription();
  
    procuratorsSuggestion: any[];
    isConfirmLoading = false;
  
    constructor(
      private fb: FormBuilder) {
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
              this.investigationActivityForm.disable();
              this.investigationActivityForm.patchValue({
                ...this.investigationActivity
              });
              this.onInputProcuratorName({target: {value: this.investigationActivity.participatedProcurator}}, true);
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
  
    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
  }
  