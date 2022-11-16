import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DisciplineViolationModel} from '../../../../../model/discipline-violation.model';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../shared/constants/constant.class';
import {NotificationService} from '../../../../../service/notification.service';
import {NzTableComponent} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-discipline-violation-list',
  templateUrl: './discipline-violation-list.component.html',
  styleUrls: ['./discipline-violation-list.component.scss']
})
export class DisciplineViolationListComponent implements OnInit, OnChanges {

  @Input() visibleViolationList: DisciplineViolationModel[];
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() arresteeId: number;
  isVisibleDialog: boolean;
  @ViewChild('basicTable') basicTable: NzTableComponent;
  isCollapse = true;
  pageSize: number[] = [5, 10, 15];
  indexForEdit: number;
  modeDisciplineViolation: ComponentMode;
  modeEnum = ComponentMode;
  loading: boolean;
  disciplineViolationForEdit: DisciplineViolationModel;
  deletedViolationList: DisciplineViolationModel[] = [];


  constructor(private notification: NotificationService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visibleViolationList && this.visibleViolationList) {
      this.visibleViolationList = [...this.visibleViolationList];
      this.deletedViolationList = [];
    }
  }

  ngOnInit(): void {
    this.visibleViolationList = [];
    this.deletedViolationList = [];
  }

  getActualViolationList(): DisciplineViolationModel[] {
    return [...this.visibleViolationList, ...this.deletedViolationList];
  }

  deleteViolation(index: number) {
    index = index + (this.basicTable.nzPageIndex - 1) * this.basicTable.nzPageSize;
    const deleteItem = this.visibleViolationList.splice(index, 1)[0];
    this.visibleViolationList = [...this.visibleViolationList];
    this.notification.showNotification(Constant.SUCCESS, 'Xóa thành công!');
    if (deleteItem && deleteItem.id) {
      deleteItem.status = GeneralModelStatus.INACTIVE;
      this.deletedViolationList.push(deleteItem);
    }
  }

  cancelDelete() {

  }

  addOrUpdateViolation(disciplineViolationModel: DisciplineViolationModel) {
    if (this.modeDisciplineViolation === ComponentMode.CREATE) {
      disciplineViolationModel.status = GeneralModelStatus.ACTIVE;
      this.visibleViolationList = [...this.visibleViolationList, disciplineViolationModel];
    } else if (this.modeDisciplineViolation === ComponentMode.UPDATE) {
      this.visibleViolationList[this.indexForEdit] = disciplineViolationModel;
      this.visibleViolationList = [...this.visibleViolationList];
    }
    this.isVisibleDialog = false;
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  openDetailDialog(mode: ComponentMode, index?: number) {
    index = index + (this.basicTable.nzPageIndex - 1) * this.basicTable.nzPageSize;
    this.modeDisciplineViolation = mode;
    switch (this.modeDisciplineViolation) {
      case ComponentMode.VIEW:
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.disciplineViolationForEdit = this.visibleViolationList[this.indexForEdit];
          this.isVisibleDialog = true;
        }
        break;
      case ComponentMode.VIEW_FROM_PARENT:
      case ComponentMode.UPDATE:
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.disciplineViolationForEdit = this.visibleViolationList[this.indexForEdit];
          this.isVisibleDialog = true;
        }
        break;
      case ComponentMode.CREATE:
        this.isVisibleDialog = true;
        this.disciplineViolationForEdit = null;
    }
  }

}
