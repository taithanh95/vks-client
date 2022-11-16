import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../../../../../service/categories.service';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-reason-create',
  templateUrl: './reason-create.component.html',
  styleUrls: ['./reason-create.component.scss']
})
export class ReasonCreateComponent implements OnInit {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() reloadModal: EventEmitter<boolean> = new EventEmitter();

  isSubmited: boolean;

  lstDeci: any[];

  titleName = 'Thêm mới';

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private categoriesService: CategoriesService
  ) {
  }

  ngOnInit(): void {
    this.doReset();
  }

  ngOnChanges() {
    if(this.isVisible) {
      this.isSubmited = false;
      this.lstDeci = [];
      if (this.data.isEdit) {
        this.titleName = 'Cập nhật';
        this.getDecision(this.data?.deciid)
      } else {
        this.titleName = 'Thêm mới';
      }
    }
  }

  handleOk(){
    let valid = true;
    this.isSubmited = true;
    if (!this.data.deciid || !this.data.deciid.deciid  ) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Quyết định')
      valid = false;
    }
    if (!this.data.reasonname) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên lý do ')
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
      deciid: this.data.deciid?.deciid,
      action: action
    }
    this.generalService.saveLstReason(payload).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, res);
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
      reasonid: '',
      reasonname: '',
      deciid: '',
      isEdit : false
    }
  }

  getDecision(deciid) {
    this.categoriesService.getDecisionByDeciId(deciid).subscribe(res => {
      if (res) {
        const data = WebUtilities.toLowercaseFields(res);
        this.data.deciid = data;
        this.lstDeci = [data];
      }
    }, error => console.log(error))
  }

  onInputDeci(e) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstDeci = [];
    } else {
      this.categoriesService.getDeciAutocomplete(value).subscribe(res => {
        this.lstDeci = res;
      });
    }
  }

  handleReload(){this.reloadModal.emit(false), this.isVisible = false}

  handleCancel() {this.closeModal.emit(false), this.isVisible = false}
}
