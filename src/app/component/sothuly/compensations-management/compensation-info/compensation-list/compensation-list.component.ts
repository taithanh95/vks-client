import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../shared/constants/constant.class';
import {CompensationDetail} from '../../model/compensation-detail';
import {NotificationService} from '../../../../../service/notification.service';

@Component({
  selector: 'app-compensation-list',
  templateUrl: './compensation-list.component.html',
  styleUrls: ['./compensation-list.component.scss']
})
export class CompensationListComponent implements OnInit, OnChanges, OnDestroy {
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() dataChange: EventEmitter<CompensationDetail[]> = new EventEmitter<CompensationDetail[]>();

  @Input() item: CompensationDetail;
  @Input() isVisible: boolean
  @Input() popupMode: ComponentMode = ComponentMode.CREATE;
  @Input() listOfData: CompensationDetail[] = [];
  @Input() compensationId: number;

  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;

  loading: boolean;
  pageSize: number[] = [5, 10, 15];
  isCollapse = true;
  popupModeEnum = ComponentMode;
  currentIndexOfItem: number;
  listOfDeletedData: CompensationDetail[] = [];

  constructor(
    private notificationService: NotificationService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisible && this.isVisible) {
      console.log('CompensationListComponent.ngOnChanges');
    }
  }

  ngOnInit(): void {
    console.log('CompensationListComponent.ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('CompensationListComponent.onDestroy');
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  handleDataDeleted(i: number) {
    console.log('CompensationListComponent.handleDataDeleted');
    const item = this.listOfData.splice(i, 1)[0];
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

  createOrUpdate(item: CompensationDetail) {
    console.log(item);
    if (this.popupMode === ComponentMode.CREATE) {
      this.listOfData = [...this.listOfData, item];
    } else if (this.popupMode === ComponentMode.UPDATE) {
      this.listOfData[this.currentIndexOfItem] = item;
      this.listOfData = [...this.listOfData];
    }
    this.dataChange.emit(this.listOfData);
    this.isVisible = false;
  }
}
