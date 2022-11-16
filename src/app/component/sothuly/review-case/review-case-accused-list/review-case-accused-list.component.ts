import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../shared/constants/constant.class';
import {ReviewCaseAccusedModel} from '../model/review-case-model';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {DateService} from "../../../../common/util/date.service";

@Component({
  selector: 'app-review-case-accused-list',
  templateUrl: './review-case-accused-list.component.html',
  styleUrls: ['./review-case-accused-list.component.scss']
})
export class ReviewCaseAccusedListComponent implements OnChanges {

  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  deletedPersonList: ReviewCaseAccusedModel[] = [];
  @Input() visiblePersonList: ReviewCaseAccusedModel[] = [];
  @Input() fullAccusedList: ReviewCaseAccusedModel[] = [];
  loading: boolean;
  isDialogVisible: boolean;
  isVisibleDetail: boolean;
  indexForEdit: number;
  denouncedPersonForEdit: ReviewCaseAccusedModel;

  isCollapse = true;
  pageSize: number[] = [5, 10, 15];

  constructor(private notificationService: NzNotificationService,
              private dateService: DateService) {
  }

  getActualPersonList(): ReviewCaseAccusedModel[] {
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

  addOrEditPerson(reviewCaseAccusedModel: ReviewCaseAccusedModel) {
    // Check duplicate
    for (const {index, acc} of this.visiblePersonList.map((acc, index) => ({index, acc}))) {
      if (((this.mode === ComponentMode.UPDATE && index !== this.indexForEdit) || this.mode === ComponentMode.CREATE)
         && reviewCaseAccusedModel.accuCode === acc.accuCode
        && reviewCaseAccusedModel.stage === acc.stage
        && reviewCaseAccusedModel.judgmentCode === acc.judgmentCode) {
        let aDate = '';
        let bDate = '';
        if (reviewCaseAccusedModel.dJudgmentDate) {
          aDate = this.dateService.dateToString(reviewCaseAccusedModel.dJudgmentDate, this.dateService.VN_DATE_FORMAT)
        }
        if (acc.dJudgmentDate) {
          bDate = this.dateService.dateToString(acc.dJudgmentDate, this.dateService.VN_DATE_FORMAT)
        }
        let aNum = '';
        let bNum = '';
        if (reviewCaseAccusedModel.judgmentNum) {
          aNum = reviewCaseAccusedModel.judgmentNum;
        }
        if (reviewCaseAccusedModel.judgmentNum) {
          bNum = acc.judgmentNum;
        }

        if (aNum === bNum && aDate === bDate) {
          this.notificationService.error('', 'Bản án của bị cáo đã có, đề nghị kiểm tra lại');
          this.isDialogVisible = false;
          return;
        }
      }
    }
    if (this.mode === ComponentMode.CREATE) {
      reviewCaseAccusedModel.status = GeneralModelStatus.ACTIVE;
      this.visiblePersonList = [...this.visiblePersonList, reviewCaseAccusedModel];
    } else if (this.mode === ComponentMode.UPDATE) {
      this.visiblePersonList[this.indexForEdit] = reviewCaseAccusedModel;
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
