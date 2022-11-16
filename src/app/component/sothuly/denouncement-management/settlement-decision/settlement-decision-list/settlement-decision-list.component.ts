import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SettlementDecisionModel} from '../../../../../model/settlement-decision.model';
import {GeneralModelStatus, ComponentMode} from '../../../../../shared/constants/constant.class';
import {ApParamModel} from '../../../../../model/ap-param.model';

@Component({
  selector: 'app-settlement-decision-list',
  templateUrl: './settlement-decision-list.component.html',
  styleUrls: ['./settlement-decision-list.component.scss']
})
export class SettlementDecisionListComponent implements OnChanges {
  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
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

  getActualDecisionList(): SettlementDecisionModel[] {
    return [...this.visibleDecisionList, ...this.deletedDecisionList];
  }

  deleteDecision(index: number) {
    const deletedItem = this.visibleDecisionList.splice(index, 1)[0];
    this.visibleDecisionList = [...this.visibleDecisionList];
    if (deletedItem && deletedItem.id) {
      deletedItem.status = GeneralModelStatus.INACTIVE;
      this.deletedDecisionList.push(deletedItem);
    }
  }

  cancelDelete() {

  }

  addOrEditDecision(settlementDecision: SettlementDecisionModel) {
    if (this.mode === ComponentMode.CREATE) {
      settlementDecision.status = GeneralModelStatus.ACTIVE;
      this.visibleDecisionList = [...this.visibleDecisionList, settlementDecision];
    } else if (this.mode === ComponentMode.UPDATE) {
      this.visibleDecisionList[this.indexForEdit] = settlementDecision;
      this.visibleDecisionList = [...this.visibleDecisionList];
    }
    this.isDialogVisible = false;
  }

  openDetailDialog(mode: ComponentMode, index?: number) {
    this.mode = mode;
    switch (this.mode) {
      case ComponentMode.VIEW:
      case ComponentMode.VIEW_FROM_PARENT:
      case ComponentMode.UPDATE:
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.settlementDecisionForEdit = this.visibleDecisionList[this.indexForEdit];
          this.isDialogVisible = true;
        }
        break;
      case ComponentMode.CREATE:
        this.isDialogVisible = true;
        this.settlementDecisionForEdit = null;
    }
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
}
