import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-conclusion-create',
  templateUrl: './conclusion-create.component.html',
  styleUrls: ['./conclusion-create.component.scss']
})
export class ConclusionCreateComponent implements OnInit {

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
    if (!this.data.concname) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên loại kháng nghị')
      valid = false;
    }
    if (!this.data.userfor) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Giai đoạn')
      valid = false;
    }
    if (!this.data.status) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tình trạng áp dụng')
      valid = false;
    }
    if (valid) this.doSave();  
  }

  doSave() {
    let msg, action;
    if (this.data.isEdit) {
      msg = 'Cập nhật';
      action = 'U';
    } else {
      msg = 'Thêm mới';
      action = 'I';
    }
    const payload = {
      ...this.data,
      action: action
    }
    this.generalService.saveLstConclusion(payload).subscribe(res => {
      if (res) {
        if (res === 'exist') {
          this.notificationService.showNotification(Constant.ERROR, 'Bạn không thể nhập trùng dữ liệu');
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, `${msg} thành công`);
          this.handleReload();
        }
      }
    }, error => {
      this.handleErr(error.error.text)
    });
  }

  handleErr(err: string){
    if (err === 'exist') {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn không thể nhập trùng dữ liệu');
    } else {
      const msgErr = this.generalService.jsonErrorDM[err];
      this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
    }
  }

  doReset() {
    this.data = {
      concid: '',
      concname: '',
      userfor: 'G1',
      status: 'Y',
      isEdit : false
    }
  }

  handleReload(){this.reloadModal.emit(false), this.isVisible = false}

  handleCancel() {this.closeModal.emit(false), this.isVisible = false}
}
