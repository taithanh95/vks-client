import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../shared/constants/constant.class';
import {ApParamModel} from '../../../../../model/ap-param.model';
import {ArrestSettlementDecisionModel} from '../../../../../model/arrest-settlement-decision.model';
import {ArresteeModel} from '../../../../../model/arrestee.model';
import {NotificationService} from '../../../../../service/notification.service';
import {NzTableComponent} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-settlement-decision-list',
  templateUrl: './settlement-decision-list.component.html',
  styleUrls: ['./settlement-decision-list.component.scss']
})
export class SettlementDecisionListComponent implements OnInit, OnChanges {
  customTableModel: {
    id: number,
    decisionId: number,
    arresteeId: number,
    arresteeName: string,
    decisionName: string,
    decisionNumber: string,
    decisionDate: Date
  };
  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() decisionAgencies: ApParamModel[];
  visibleDecisionList: ArrestSettlementDecisionModel[] = [];
  arresteeId: number;
  @Input() visibleArresteeList: ArresteeModel[];
  deletedDecisionList: ArrestSettlementDecisionModel[] = [];
  loading: boolean;
  @Input() isDialogVisible: boolean;
  indexForEdit: number;
  isCollapse = true;
  pageSize: number[] = [5, 10, 15];
  settlementDecisionForEdit: ArrestSettlementDecisionModel;
  @ViewChild('basicTable') basicTable: NzTableComponent;

  constructor(private notification: NotificationService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visibleDecisionList'] && this.visibleDecisionList) {
      this.visibleDecisionList = [...this.visibleDecisionList];
      this.deletedDecisionList = [];
    }
    if (changes.visibleArresteeList && this.visibleArresteeList) {
      this.visibleArresteeList = [...this.visibleArresteeList];
      this.visibleDecisionList = [];
      this.deletedDecisionList = [];
      for (let arrestee of this.visibleArresteeList) {
        this.visibleDecisionList = [...this.visibleDecisionList, ...arrestee.settlementDecisions];
      }
    }
    this.visibleDecisionList.sort((a, b) =>
      new Date(b.decisionDate).getTime() - new Date(a.decisionDate).getTime());
  }

  getActualDecisionList(): ArrestSettlementDecisionModel[] {
    return [...this.visibleDecisionList, ...this.deletedDecisionList];
  }


  deleteDecision(index: number) {
    index = index + (this.basicTable.nzPageIndex - 1) * this.basicTable.nzPageSize;
    const deleteItem = this.visibleDecisionList.splice(index, 1)[0];
    this.visibleDecisionList = [...this.visibleDecisionList];
    this.notification.showNotification(Constant.SUCCESS, 'Xóa thành công');
    if (deleteItem && deleteItem.id) {
      deleteItem.status = GeneralModelStatus.INACTIVE;
      this.deletedDecisionList.push(deleteItem);
    }
  }

  cancelDelete() {

  }

  adOrUpdateDecision(arrestSettlementDecisionModel: ArrestSettlementDecisionModel) {
    if (this.mode === ComponentMode.CREATE) {
      arrestSettlementDecisionModel.status = GeneralModelStatus.ACTIVE;
      if (this.visibleDecisionList) {
        this.visibleDecisionList = [...this.visibleDecisionList, arrestSettlementDecisionModel];
      }
    } else if (this.mode === ComponentMode.COPPY) {
      arrestSettlementDecisionModel.status = GeneralModelStatus.ACTIVE;
      if (this.visibleDecisionList) {
        this.visibleDecisionList = [...this.visibleDecisionList, arrestSettlementDecisionModel];
      }
    } else if (this.mode === ComponentMode.UPDATE) {
      this.visibleDecisionList[this.indexForEdit] = arrestSettlementDecisionModel;
      this.visibleDecisionList = [...this.visibleDecisionList];
    }
    this.visibleDecisionList.sort((a, b) =>
      new Date(b.decisionDate).getTime() - new Date(a.decisionDate).getTime());
    this.isDialogVisible = false;
  }

  openDetailDialog(mode: ComponentMode, index?: number) {
    index = index + (this.basicTable.nzPageIndex - 1) * this.basicTable.nzPageSize;
    this.mode = mode;
    switch (this.mode) {
      case ComponentMode.VIEW:
      case ComponentMode.VIEW_FROM_PARENT:
      case ComponentMode.UPDATE:
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.settlementDecisionForEdit = this.visibleDecisionList[this.indexForEdit];
          this.visibleArresteeList = [...this.visibleArresteeList];
          this.isDialogVisible = true;
        }
        break;
      case ComponentMode.COPPY:
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.settlementDecisionForEdit = this.visibleDecisionList[this.indexForEdit];
          this.visibleArresteeList = [...this.visibleArresteeList];
          this.isDialogVisible = true;
        }
        break;
      case ComponentMode.CREATE:
        this.isDialogVisible = true;
        this.settlementDecisionForEdit = null;
        this.visibleArresteeList = [...this.visibleArresteeList];
    }
  }

  getArresteeName(arresteeId: number): string {
    const arrestee = this.visibleArresteeList.find(e => e.id === arresteeId);
    let arresteeName = null;
    if (arrestee != null) {
      arresteeName = arrestee.fullName;
    }
    return arresteeName;
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  ngOnInit(): void {

  }

}
