import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {NotificationService} from '../../../../../service/notification.service';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../shared/constants/constant.class';

export interface CompensationDamage {
  id?: number;
  compensationId?: number;
  damagesName?: string;
  damagesBirthday?: Date | string;
  damagesAddress?: string;
  status?: number
}

@Component({
  selector: 'app-compensation-damages-list',
  templateUrl: './compensation-damages-list.component.html',
  styleUrls: ['./compensation-damages-list.component.scss']
})
export class CompensationDamagesListComponent implements OnInit {
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() dataChange: EventEmitter<CompensationDamage[]> = new EventEmitter<CompensationDamage[]>();

  @Input() item: CompensationDamage;
  @Input() isVisible: boolean
  @Input() popupMode: ComponentMode = ComponentMode.CREATE;
  @Input() listOfData: CompensationDamage[] = [];
  @Input() compensationId: number;

  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;

  loading: boolean;
  pageSize: number[] = [5, 10, 15];
  isCollapse = true;
  popupModeEnum = ComponentMode;
  currentIndexOfItem: number;
  listOfDeletedData: CompensationDamage[] = [];

  constructor(
    private notificationService: NotificationService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisible && this.isVisible) {
      console.log('CompensationDamagesListComponent.ngOnChanges');
    }
  }

  ngOnInit(): void {
    console.log('CompensationDamagesListComponent.ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('CompensationDamagesListComponent.onDestroy');
  }

  toggleCollapse = () => this.isCollapse = !this.isCollapse;

  handleDataDeleted(i: number) {
    console.log('CompensationDamagesListComponent.handleDataDeleted');
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

  createOrUpdate(item: CompensationDamage) {
    console.log(item + 'CompensationDamagesListComponent');
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