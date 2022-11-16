import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../shared/constants/constant.class';
import {ArresteeModel} from '../../../../../model/arrestee.model';
import {ApParamModel} from '../../../../../model/ap-param.model';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {ConstantService} from '../../../../../service/constant.service';
import {NotificationService} from '../../../../../service/notification.service';
import {NzTableComponent} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-arrestee-list',
  templateUrl: './arrestee-list.component.html',
  styleUrls: ['./arrestee-list.component.scss']
})
export class ArresteeListComponent implements OnInit, OnChanges {
  modeEnum = ComponentMode;
  isDialogVisible: boolean;
  @ViewChild('basicTable') basicTable: NzTableComponent;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() update: any;
  @Input() arrestDetentionInfoId: number;
  arresteeModelForEdit: ArresteeModel;
  @Input() visibleArresteeList: ArresteeModel[] = [];
  @Input() arrestTypes: ApParamModel[] = [];
  @Output() onChangeArresteeList: EventEmitter<string> = new EventEmitter<string>();
  modeDetail: ComponentMode;
  deletedArresteeList: ArresteeModel[] = [];
  indexForEdit: number;
  isCollapse = true;
  loading: boolean;
  pageSize: number[] = [5, 10, 15];

  constructor(
    private notificationService: NzNotificationService,
    private constantService: ConstantService,
    private notification: NotificationService) {
  }

  ngOnInit(): void {
    this.visibleArresteeList = [];
  }

  addOrEditArrestee(arresteeModel: ArresteeModel) {
    if (this.modeDetail === ComponentMode.CREATE) {
      arresteeModel.status = GeneralModelStatus.ACTIVE;
      this.visibleArresteeList = [...this.visibleArresteeList, arresteeModel];
    } else if (this.modeDetail === ComponentMode.UPDATE) {
      this.visibleArresteeList[this.indexForEdit] = arresteeModel;
      this.visibleArresteeList = [...this.visibleArresteeList];
    } else if (this.modeDetail === ComponentMode.COPPY) {
      arresteeModel.status = GeneralModelStatus.ACTIVE;
      this.visibleArresteeList = [...this.visibleArresteeList, arresteeModel];
    }
    this.onChangeArresteeList.emit('changeList');
    this.isDialogVisible = false;
  }

  cancelDelete() {

  }

  deleteArrestee(index: number) {
    index = index + (this.basicTable.nzPageIndex - 1) * this.basicTable.nzPageSize;
    const deletedItem = this.visibleArresteeList.splice(index, 1)[0];
    this.visibleArresteeList = [...this.visibleArresteeList];
    if (deletedItem && deletedItem.id) {
      deletedItem.status = GeneralModelStatus.INACTIVE;
      // xoa tren databsae
      if (this.update === ComponentMode.UPDATE) {
        this.constantService.postRequest(this.constantService.SOTHULY_URL + 'arrest-detention/saveArrestee', deletedItem)
          .toPromise()
          .then(res => res.json())
          .then(resJson => {
            if (resJson.responseCode === '0000') {
              this.deletedArresteeList.push(deletedItem);
              this.onChangeArresteeList.emit('changeList');
              this.notification.showNotification(Constant.SUCCESS, 'Xóa thành công!');
            } else {
              this.notification.showNotification('Lỗi', 'Xóa không thành công');
            }
          })
          .catch(err => {
            this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
          });
      }
    } else {

      this.deletedArresteeList.push(deletedItem);

    }
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  openDetailDialog(mode: ComponentMode, index?: number) {
    index = index + (this.basicTable.nzPageIndex - 1) * this.basicTable.nzPageSize;
    this.modeDetail = mode;
    switch (this.modeDetail) {
      case ComponentMode.VIEW:
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.arresteeModelForEdit = this.visibleArresteeList[this.indexForEdit];
          this.isDialogVisible = true;
        }
        break;
      case ComponentMode.VIEW_FROM_PARENT:
      case ComponentMode.UPDATE:
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.arresteeModelForEdit = this.visibleArresteeList[this.indexForEdit];
          this.isDialogVisible = true;
        }
        break;
      case ComponentMode.COPPY:
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.arresteeModelForEdit = this.visibleArresteeList[this.indexForEdit];
          this.isDialogVisible = true;
        }
        break;
      case ComponentMode.CREATE:
        this.arresteeModelForEdit = null;
        this.isDialogVisible = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['visibleArresteeList'] && this.visibleArresteeList) {
      this.visibleArresteeList = [...this.visibleArresteeList];
      this.deletedArresteeList = [];
    }
  }

  getActualArresteeList(): ArresteeModel[] {
    return [...this.visibleArresteeList];
  }
}
