import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DenouncedPersonModel} from '../../../../../../model/denounced-person.model';
import {GeneralModelStatus, ComponentMode} from '../../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-f-denounced-person-list',
  templateUrl: './f-denounced-person-list.component.html',
  styleUrls: ['./f-denounced-person-list.component.scss']
})
export class FDenouncedPersonListComponent implements OnChanges {
  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.VIEW_FROM_PARENT;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visiblePersonList && this.visiblePersonList) {
      this.visiblePersonList = [...this.visiblePersonList];
      this.deletedPersonList = [];
    }
  }

  cancelDelete() {

  }

  openDetailDialog(mode: ComponentMode, index?: number) {
    this.mode = mode;
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.denouncedPersonForEdit = this.visiblePersonList[this.indexForEdit];
          this.isDialogVisible = true;
        };
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
}
