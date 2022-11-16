import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-appeal-create',
  templateUrl: './appeal-create.component.html',
  styleUrls: ['./appeal-create.component.scss']
})
export class AppealCreateComponent implements OnInit {

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
    if (!this.data.appealname) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên loại kháng cáo')
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
    this.generalService.saveLstAppeal(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, `${msg} thành công`);
        this.handleReload();
      } else {
        this.handleErr(res)
      }
    }, error => {
      this.handleErr(error.error.text)
    });
  }

  handleErr(err: string){
    if (err === 'ERROR') {
      this.notificationService.showNotification(Constant.ERROR, 'Tên loại kháng cáo đã tồn tại');
    } else {
      const msgErr = this.generalService.jsonErrorDM[err];
      this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
    }
  }

  doReset() {
    this.data = {
      appealid: '',
      appealname: '',
      setunit: 'DAY',
      settime: 0,
      isEdit : false
    }
  }

  handleReload(){this.reloadModal.emit(false), this.isVisible = false}

  handleCancel() {this.closeModal.emit(false), this.isVisible = false}
}
