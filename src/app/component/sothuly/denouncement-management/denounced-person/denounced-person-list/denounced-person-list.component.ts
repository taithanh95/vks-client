import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DenouncedPersonModel} from '../../../../../model/denounced-person.model';
import {GeneralModelStatus, ComponentMode} from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-denounced-person-list',
  templateUrl: './denounced-person-list.component.html',
  styleUrls: ['./denounced-person-list.component.scss']
})
export class DenouncedPersonListComponent implements OnChanges {
  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  deletedPersonList: DenouncedPersonModel[] = [];
  @Input() visiblePersonList: DenouncedPersonModel[] = [];
  loading: boolean;
  isDialogVisible: boolean;
  indexForEdit: number;
  denouncedPersonForEdit: DenouncedPersonModel;

  isCollapse = true;
  pageSize: number[] = [5, 10, 15];
  constructor(
  ) { }

  getActualPersonList(): DenouncedPersonModel[] {
    return [...this.visiblePersonList, ...this.deletedPersonList];
  }

  deletePerson(index: number) {
    const deletedItem = this.visiblePersonList.splice(index, 1)[0];
    this.visiblePersonList = [...this.visiblePersonList];
    if (deletedItem && deletedItem.id) {
      deletedItem.status = GeneralModelStatus.INACTIVE;
      this.deletedPersonList.push(deletedItem);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visiblePersonList && this.visiblePersonList) {
      this.visiblePersonList = [...this.visiblePersonList];
      this.deletedPersonList = [];
    }
  }

  cancelDelete() {

  }

  addOrEditPerson(denouncedPersonModel: DenouncedPersonModel) {
    if (this.mode === ComponentMode.CREATE) {
      denouncedPersonModel.status = GeneralModelStatus.ACTIVE;
      this.visiblePersonList = [...this.visiblePersonList, denouncedPersonModel];
    } else if (this.mode === ComponentMode.UPDATE) {
      this.visiblePersonList[this.indexForEdit] = denouncedPersonModel;
      this.visiblePersonList = [...this.visiblePersonList];
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
          this.denouncedPersonForEdit = this.visiblePersonList[this.indexForEdit];
          this.isDialogVisible = true;
        }
        break;
      case ComponentMode.CREATE:
        this.denouncedPersonForEdit = null;
        this.isDialogVisible = true;
    }
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
}
