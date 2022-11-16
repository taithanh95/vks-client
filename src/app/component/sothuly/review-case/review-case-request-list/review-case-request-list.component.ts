import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../shared/constants/constant.class';
import {ReviewCaseAccusedModel, ReviewCaseRequestModel} from '../model/review-case-model';
import {DateService} from "../../../../common/util/date.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-review-case-request-list',
  templateUrl: './review-case-request-list.component.html',
  styleUrls: ['./review-case-request-list.component.scss']
})
export class ReviewCaseRequestListComponent implements OnChanges {

  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  deletedPersonList: ReviewCaseRequestModel[] = [];
  @Input() visiblePersonList: ReviewCaseRequestModel[] = [];
  @Input() fullAccusedList: ReviewCaseAccusedModel[] = [];
  loading: boolean;
  isDialogVisible: boolean;
  indexForEdit: number;
  denouncedPersonForEdit: ReviewCaseRequestModel;

  isCollapse = true;
  pageSize: number[] = [5, 10, 15];

  constructor(private notificationService: NzNotificationService,
              private dateService: DateService) {
  }

  getActualPersonList(): ReviewCaseRequestModel[] {
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
    if (changes['visiblePersonList'] && this.visiblePersonList) {
      this.visiblePersonList = [...this.visiblePersonList];
      this.deletedPersonList = [];
    }
  }

  cancelDelete() {

  }

  emptyList() {
    this.visiblePersonList = [];
  }

  addOrEditPerson(denouncedPersonModel: ReviewCaseRequestModel) {
    // Check duplicate
    for (const {index, acc} of this.visiblePersonList.map((acc, index) => ({index, acc}))) {
      if (((this.mode === ComponentMode.UPDATE && index !== this.indexForEdit) || this.mode === ComponentMode.CREATE)
        && denouncedPersonModel.accusedCode === acc.accusedCode
        && denouncedPersonModel.requestNum === acc.requestNum) {
        const aDate = this.dateService.dateToString(denouncedPersonModel.dRequestDate, this.dateService.VN_DATE_FORMAT);
        const bDate = this.dateService.dateToString(acc.dRequestDate, this.dateService.VN_DATE_FORMAT);
        if (aDate === bDate) {
          this.notificationService.error('', 'Yêu cầu, kiến nghị, đề nghị của bị cáo đã có, đề nghị kiểm tra lại');
          this.isDialogVisible = false;
          return;
        }
      }
    }
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

  getAccusedNameFromCode(code: string) {
    if (!this.fullAccusedList) {
      return code;
    }
    for (const acc of this.fullAccusedList) {
      if (acc.accuCode === code) {
        return acc.fullName;
      }
    }
    return code;
  }

}
