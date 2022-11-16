import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {InvestigationActivityModel} from '../../../../../../model/investigation-activity.model';
import {GeneralModelStatus, ComponentMode} from '../../../../../../shared/constants/constant.class';
import {ApParamModel} from '../../../../../../model/ap-param.model';

@Component({
  selector: 'app-f-investigation-activity-list',
  templateUrl: './f-investigation-activity-list.component.html',
  styleUrls: ['./f-investigation-activity-list.component.scss']
})
export class FInvestigationActivityListComponent implements OnChanges {
  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.VIEW_FROM_PARENT;
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

  cancelDelete() {

  }

  openDetailDialog(mode: ComponentMode, index?: number) {
    this.mode = mode;
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.investigationActivityForEdit = this.visibleActivityList[this.indexForEdit];
          this.isDialogVisible = true;
        };
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

}
