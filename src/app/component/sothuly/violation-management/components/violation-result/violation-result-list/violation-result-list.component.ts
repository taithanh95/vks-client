import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../../shared/constants/constant.class';
import {ViolationLegislationDocument} from '../../../model/violation-legislation-document';
import {NotificationService} from '../../../../../../service/notification.service';
import {ViolationLaw} from '../../../model/violation-law';
import {ViolationResult} from '../../../model/violation-result';

@Component({
  selector: 'app-violation-result-list',
  templateUrl: './violation-result-list.component.html',
  styleUrls: ['./violation-result-list.component.scss']
})
export class ViolationResultListComponent implements OnInit {

  @Input() popupMode: ComponentMode = ComponentMode.CREATE;
  @Input() violationLaw: ViolationLaw;
  @Input() violationResults: ViolationResult[] = [];
  @Output() dataChange: EventEmitter<ViolationResult[]> = new EventEmitter<ViolationResult[]>();
  violationResult: ViolationResult = null;

  listOfDeletedData: ViolationResult[] = [];
  popupModeEnum = ComponentMode;
  isCollapse = true;
  loading: boolean;
  pageSize: number[] = [5, 10, 15];
  isVisible: boolean;
  currentIndexOfItem: number;

  constructor(
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  createOrUpdate(data: ViolationResult) {
    if (this.popupMode === ComponentMode.CREATE) {
      this.violationResults = [...this.violationResults, data];
    } else if (this.popupMode === ComponentMode.UPDATE) {
      this.violationResults[this.currentIndexOfItem] = {...data};
      this.violationResults = [...this.violationResults];
    }
    this.dataChange.emit(this.violationResults);
    this.isVisible = false;
  }

  getListOfData(): ViolationResult[] {
    return [...this.violationResults, ...this.listOfDeletedData];
  }

  handleDataDeleted(index: number) {
    const data = this.violationResults.splice(index, 1)[0];
    if (data && data.id) {
      data.status = GeneralModelStatus.INACTIVE;
      this.listOfDeletedData.push(data);
    }
    this.violationResults = [...this.violationResults];
    this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công!');
  }

  onOpenModal(mode: ComponentMode, index?: number) {
    this.popupMode = mode;
    switch (this.popupMode) {
      case ComponentMode.VIEW:
      case ComponentMode.VIEW_FROM_PARENT:
      case ComponentMode.UPDATE:
        if (index !== undefined && index !== null) {
          this.currentIndexOfItem = index;
          this.violationResult = this.violationResults[index];
          this.isVisible = true;
        }
        break;
      case ComponentMode.CREATE:
        this.isVisible = true;
        this.violationResult = null;
        break;
    }
  }

  onCloseModal($event: boolean) {
    this.isVisible = $event;
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

}
