import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-statistica-create',
  templateUrl: './statistica-create.component.html',
  styleUrls: ['./statistica-create.component.scss']
})
export class StatisticaCreateComponent implements OnInit {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() reloadModal: EventEmitter<boolean> = new EventEmitter();

  sppid: string;

  titleName = 'Thêm mới';

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.doReset();
  }

  ngOnChanges() {
    if(this.isVisible) {
      this.titleName = this.data.isEdit ? 'Cập nhật' : 'Thêm mới';
    }
  }

  handleOk(){
    if (!this.data.statname) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên chỉ tiêu')
      return;
    }
    this.doSave();    
  }

  doSave() {
    let msg, action, msgErr;
    if (this.data.isEdit) {
      msg = 'Cập nhật';
      action = 'U';
      msgErr = 'Chỉ tiêu này đã được sử dụng trong bị can. Vui lòng kiểm tra lại.'
    } else {
      msg = 'Thêm mới';
      action = 'I';
      msgErr = 'Mã hoặc tên chỉ tiêu đã tồn tại trong CSDL'
    }
    const payload = {
      ...this.data,
      sppid : this.sppid,
      action: action
    }
    this.generalService.saveLstStatistica(payload).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, msgErr);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, `${msg} thành công`);
        this.handleReload();
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  doReset() {
    this.data = {
      statid : '',
      statname : '',
      status : 'Y',
      children : 'Y',
      adult :'Y',
      isEdit : false
    }
  }

  handleReload(){this.reloadModal.emit(false), this.isVisible = false}

  handleCancel() {this.closeModal.emit(false), this.isVisible = false}
}
