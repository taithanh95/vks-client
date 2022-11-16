  import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
  import {SettlementDecisionModel} from '../../../../../../model/settlement-decision.model';
  import {GeneralModelStatus, ComponentMode} from '../../../../../../shared/constants/constant.class';
  import {ApParamModel} from '../../../../../../model/ap-param.model';
  
  @Component({
    selector: 'app-f-settlement-decision-list',
    templateUrl: './f-settlement-decision-list.component.html',
    styleUrls: ['./f-settlement-decision-list.component.scss']
  })
  export class FSettlementDecisionListComponent implements OnChanges {
    modeEnum = ComponentMode;
    @Input() mode: ComponentMode = ComponentMode.VIEW_FROM_PARENT;
    deletedDecisionList: SettlementDecisionModel[] = [];
    @Input() decisionAgencies: ApParamModel[];
    @Input() visibleDecisionList: SettlementDecisionModel[] = [];
    loading: boolean;
    isDialogVisible: boolean;
    indexForEdit: number;
    settlementDecisionForEdit: SettlementDecisionModel;
    isCollapse = true;
    pageSize: number[] = [5, 10, 15];
  
    constructor() {
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes.visibleDecisionList && this.visibleDecisionList) {
        this.visibleDecisionList = [...this.visibleDecisionList];
        this.deletedDecisionList = [];
      }
    }
    
    cancelDelete() {
  
    }
  
    openDetailDialog(mode: ComponentMode, index?: number) {
      this.mode = mode;
          if (index !== undefined && index !== null) {
            this.indexForEdit = index;
            this.settlementDecisionForEdit = this.visibleDecisionList[this.indexForEdit];
            this.isDialogVisible = true;
          };
    }
  
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
  