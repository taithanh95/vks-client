import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-decitype-create',
  templateUrl: './decitype-create.component.html',
  styleUrls: ['./decitype-create.component.scss']
})
export class DecitypeCreateComponent implements OnInit {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() reloadModal: EventEmitter<boolean> = new EventEmitter();

  isSubmited: boolean;

  titleName = 'Thêm mới';

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) {
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
    if (!this.data.decitypeid) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Mã loại quyết định')
      valid = false;
    }
    if (!this.data.name) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên loại quyết định')
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
    this.generalService.saveLstDecitype(payload).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, 'Mã loại quyết định đã tồn tại trong CSDL');
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, `${msg} thành công`);
        this.handleReload();
      }
    }, error => {
      this.handleErr(error.error.text)
    });
  }

  handleErr(err: string){
    const msgErr = this.generalService.jsonErrorDM[err];
    this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
  }

  doReset() {
    this.data = {
      decitypeid: '',
      name: '',
      isEdit : false
    }
  }

  handleReload(){this.reloadModal.emit(false), this.isVisible = false}

  handleCancel() {this.closeModal.emit(false), this.isVisible = false}
}
