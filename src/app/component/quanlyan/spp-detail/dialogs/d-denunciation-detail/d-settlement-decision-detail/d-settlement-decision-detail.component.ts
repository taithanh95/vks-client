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
  import {FormBuilder, FormGroup} from '@angular/forms';
  import {SettlementDecisionModel} from '../../../../../../model/settlement-decision.model';
  import {CategoriesService} from '../../../../../../service/categories.service';
  import {Subscription} from 'rxjs';
  import {ComponentMode} from '../../../../../../shared/constants/constant.class';
  import {ApParamModel} from '../../../../../../model/ap-param.model';
  import {ApParamService} from '../../../../../../service/apparam.service';
  import {ParsePipe} from 'ngx-moment';
  import {NzAutocompleteComponent, NzAutocompleteOptionComponent} from 'ng-zorro-antd/auto-complete';
  import {CompareWith} from 'ng-zorro-antd/core/types';
  
  @Component({
    selector: 'app-d-settlement-decision-detail',
    templateUrl: './d-settlement-decision-detail.component.html',
    styleUrls: ['./d-settlement-decision-detail.component.scss']
  })
  export class DSettlementDecisionDetailComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('autoDecisionList') autoDecisionList: NzAutocompleteComponent;
  
    @ViewChild('autoDecisionMakingUnitList') autoDecisionMakingUnitList: NzAutocompleteComponent;
    @Input() mode: ComponentMode = ComponentMode.CREATE;
    @Input() isVisibleDialog: boolean;
    @Input() settlementDecisionIndex: number;
    @Input() settlementDecision: SettlementDecisionModel;
    @Input() settlementDecisionListToCheck: SettlementDecisionModel[];
    @Output() cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
    @Input() decisionAgencies: ApParamModel[] = [];
    isCollapse = true;
    modeEnum = ComponentMode;
    settlementDecisionForm: FormGroup = this.fb.group({
      decisionNumber: [null],
      decisionDate: [null],
      decisionId: [null],
      decisionName: [null],
      decisionTemp: [null],
      decisionMakingAgency: [null],
      decisionMakingUnitId: [null],
      decisionMakingUnit: [null],
      decisionMakingUnitTemp: [null],
      effectStartDate: [null],
      effectEndDate: [null],
      description: [null],
      signer: [null],
      position: [null]
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
  
    constructor(private fb: FormBuilder, private apParamService: ApParamService,
                private categoriesService: CategoriesService,
                private parsePipe: ParsePipe) {
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
              this.selectedAgency = {name: next, type: 1, idFieldName: 'polid'};
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
              this.settlementDecisionForm.disable();
              this.settlementDecisionForm.patchValue({
                ...this.settlementDecision
              });
              this.settlementDecisionForm.get('decisionMakingUnitTemp').setValue(this.settlementDecision.decisionMakingUnit);
              this.onInputDecisionMakingUnit({target: {value: this.settlementDecision.decisionMakingUnit}}, true);
              this.onInputDecisionName({target: {value: this.settlementDecision.decisionName}}, true);
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
          this.decisionMakingUnitSub = this.categoriesService.getPolSelect({name: value}).subscribe(next => {
            this.decisionUnits = next ? next.datas : [];
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
      const value = (event.target as HTMLInputElement).value;
      this.settlementDecisionForm.get('decisionName').setValue(value);
      this.decisionNameSubscription.add(
        this.categoriesService.getListDecision_ForTBTG({search: value, page: 0, size: 10}).subscribe(next => {
          this.decisionList = next ? next.datas : [];
          this.setDecisionValue(init);
        }, error => {
          console.error(error);
        })
      );
    }
  
    stringToDate(date: Date | string): Date {
      return this.parsePipe.transform(date, 'DD/MM/YYYY').toDate();
    }
  
  }
  