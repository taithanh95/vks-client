import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../../../../../service/categories.service';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-occupation-create',
  templateUrl: './occupation-create.component.html',
  styleUrls: ['./occupation-create.component.scss']
})
export class OccupationCreateComponent implements OnInit {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() reloadModal: EventEmitter<boolean> = new EventEmitter();

  isSubmited: boolean;

  titleName = 'Thêm mới';

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.doReset();
  }

  ngOnChanges() {
    if(this.isVisible) {
      this.titleName = this.data.isEdit ? 'Cập nhật' : 'Thêm mới';
      this.isSubmited = false;
    }
  }

  handleOk(){
    let valid = true;
    this.isSubmited = true;
    if (!this.data.name) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên nghề nghiệp')
      valid = false;
    }
    if (valid) this.doSave();  
  }

  doSave() {
    let msg, action, msgErr;
    if (this.data.isEdit) {
      msg = 'Cập nhật';
      action = 'U';
      msgErr = 'Tên nghề nghiệp đã tồn tại trong CSDL';
    } else {
      msg = 'Thêm mới';
      action = 'I';
      msgErr = 'Mã hoặc tên nghề nghiệp đã tồn tại trong CSDL';
    }
    const payload = {
      ...this.data,
      action: action
    }
    this.categoriesService.insertOccupation(payload).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, msgErr);
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
      occuid: '',
      name: '',
      branchjob: '',
      remark: '',
      isEdit : false
    }
  }

  handleReload(){this.reloadModal.emit(false), this.isVisible = false}

  handleCancel() {this.closeModal.emit(false), this.isVisible = false}
}
