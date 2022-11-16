import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-statisticc-create',
  templateUrl: './statisticc-create.component.html',
  styleUrls: ['./statisticc-create.component.scss']
})
export class StatisticcCreateComponent implements OnInit {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() reloadModal: EventEmitter<boolean> = new EventEmitter();

  sppid: string;

  isSubmited: boolean;

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
    let valid = true;
    this.isSubmited = true;
    if (!this.data.statname) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên chỉ tiêu')
      valid = false;
    }

    if (!this.data.status) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tình trạng áp dụng')
      valid = false;
    }
    const checkVal = this.checkVal();
    if (valid && checkVal) this.doSave();  
  }

  checkVal() {
    if (!this.data.valmax && this.data.valmax !== 0) {
      this.data.valmin = null;
    } else if (this.data.valmax && this.data.valmin
              && +this.data.valmax < +this.data.valmin) {
      this.notificationService.showNotification(Constant.ERROR, 'Giá trị nhỏ nhất < Giá trị lớn nhất')
      return false;
    }
    return true;
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
    this.generalService.saveLstStatisticc(payload).subscribe(res => {
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
      status : 'N',
      valmax : 0,
      valmin : 0,
      isEdit : false
    }
  }

  handleReload(){this.reloadModal.emit(false), this.isVisible = false}

  handleCancel() {this.closeModal.emit(false), this.isVisible = false}
}
