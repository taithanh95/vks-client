import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {InvestigationActivityModel} from '../../../../../model/investigation-activity.model';
import {GeneralModelStatus, ComponentMode} from '../../../../../shared/constants/constant.class';
import {ApParamModel} from '../../../../../model/ap-param.model';

@Component({
  selector: 'app-investigation-activity-list',
  templateUrl: './investigation-activity-list.component.html',
  styleUrls: ['./investigation-activity-list.component.scss']
})
export class InvestigationActivityListComponent implements OnChanges {
  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  deletedActivityList: InvestigationActivityModel[] = [];
  @Input() procurators: any[];
  @Input() investigationActivityType: ApParamModel[] = [];
  @Input() denouncementProcessType: ApParamModel[] = [];
  @Input() visibleActivityList: InvestigationActivityModel[] = [];
  loading: boolean;
  isDialogVisible: boolean;
  indexForEdit: number;
  investigationActivityForEdit: InvestigationActivityModel;
  isCollapse = true;
  pageSize: number[] = [5, 10, 15];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visibleActivityList && this.visibleActivityList) {
      this.visibleActivityList = [...this.visibleActivityList];
      this.deletedActivityList = [];
    }
  }

  getActualActivityList(): InvestigationActivityModel[] {
    return [...this.visibleActivityList, ...this.deletedActivityList];
  }

  deleteActivity(index: number) {
    const deletedItem = this.visibleActivityList.splice(index, 1)[0];
    this.visibleActivityList = [...this.visibleActivityList];
    if (deletedItem && deletedItem.id) {
      deletedItem.status = GeneralModelStatus.INACTIVE;
      this.deletedActivityList.push(deletedItem);
    }
  }

  cancelDelete() {

  }

  addOrEditActivity(investigationActivity: InvestigationActivityModel) {
    if (this.mode === ComponentMode.CREATE) {
      investigationActivity.status = GeneralModelStatus.ACTIVE;
      this.visibleActivityList = [...this.visibleActivityList, investigationActivity];
    } else if (this.mode === ComponentMode.UPDATE) {
      this.visibleActivityList[this.indexForEdit] = investigationActivity;
      this.visibleActivityList = [...this.visibleActivityList];
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
          this.investigationActivityForEdit = this.visibleActivityList[this.indexForEdit];
          this.isDialogVisible = true;
        }
        break;
      case ComponentMode.CREATE:
        this.isDialogVisible = true;
        this.investigationActivityForEdit = null;
    }
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

}
