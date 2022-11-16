import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../shared/constants/constant.class';
import {ViolationLegislationDocument} from '../../model/violation-legislation-document';
import {NotificationService} from '../../../../../service/notification.service';

@Component({
  selector: 'app-violation-legislation-document-list',
  templateUrl: './violation-legislation-document-list.component.html',
  styleUrls: ['./violation-legislation-document-list.component.scss']
})
export class ViolationLegislationDocumentListComponent implements OnInit {
  @Input() popupMode: ComponentMode = ComponentMode.CREATE;
  @Input() listOfData: ViolationLegislationDocument[] = [];
  @Input() item: ViolationLegislationDocument;
  @Output() dataChange: EventEmitter<ViolationLegislationDocument[]> = new EventEmitter<ViolationLegislationDocument[]>();
  @Input() violationId: number;

  listOfDeletedData: ViolationLegislationDocument[] = [];
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

  createOrUpdate(item: ViolationLegislationDocument) {
    if (this.popupMode === ComponentMode.CREATE) {
      this.listOfData = [...this.listOfData, item];
    } else if (this.popupMode === ComponentMode.UPDATE) {
      this.listOfData[this.currentIndexOfItem] = item;
      this.listOfData = [...this.listOfData];
    }
    this.dataChange.emit(this.listOfData);
    this.isVisible = false;
  }

  getListOfData(): ViolationLegislationDocument[] {
    return [...this.listOfData, ...this.listOfDeletedData];
  }

  handleDataDeleted(index: number) {
    const item = this.listOfData.splice(index, 1)[0];
    this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công!');
    this.listOfData = [...this.listOfData];
    if (item && item.id) {
      item.status = GeneralModelStatus.INACTIVE;
      this.listOfDeletedData.push(item);
    }
  }

  onOpenModal(mode: ComponentMode, index?: number) {
    this.popupMode = mode;
    switch (this.popupMode) {
      case ComponentMode.VIEW:
      case ComponentMode.VIEW_FROM_PARENT:
      case ComponentMode.UPDATE:
        if (index !== undefined && index !== null) {
          this.currentIndexOfItem = index;
          this.item = this.listOfData[index];
          this.isVisible = true;
        }
        break;
      case ComponentMode.CREATE:
        this.isVisible = true;
        this.item = null;
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
