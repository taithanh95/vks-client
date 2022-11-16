import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../../../../../service/categories.service';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-admdepartment-create',
  templateUrl: './admdepartment-create.component.html',
  styleUrls: ['./admdepartment-create.component.scss']
})
export class AdmdepartmentCreateComponent implements OnInit {
  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() reloadModal: EventEmitter<boolean> = new EventEmitter();

  isSubmited: boolean;

  sppid: string;

  titleName = 'Thêm mới';

  lstSpps: any[];

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private categoriesService: CategoriesService
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.doReset();
  }

  ngOnChanges() {
    if(this.isVisible) {
      this.titleName = this.data.isEdit ? 'Cập nhật' : 'Thêm mới';
      this.getLstVks(this.data.sppid);
    }
  }

  getLstVks(sppid) {
    this.categoriesService.getLstSpp(sppid).subscribe(res => {
      this.lstSpps = res;
      this.data.atxtSpp = this.lstSpps.find(spp => spp.SPPID === sppid);
    });
  }

  handleOk(){
    let valid = true;
    if (!this.data.atxtSpp) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Viện kiểm sát')
      valid = false;
    }
    if (!this.data.name) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Phòng ban')
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
      atxtSpp: this.data.atxtSpp ? this.data.atxtSpp?.SPPID : null,
      sppid : this.sppid,
      action: action
    }
    this.generalService.saveAdmDepertments(payload).subscribe(res => {
      if (res) {
        msg = this.generalService.jsonErrorQTHT[res];
        this.notificationService.showNotification(Constant.ERROR, msg ? msg : res);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, `${msg} thành công`);
        this.handleReload();
      }
    }, error => {
      const msg = this.generalService.jsonErrorQTHT[error.error.text];
      this.notificationService.showNotification(Constant.ERROR, msg ? msg : error.error.text);
    });
  }

  doReset() {
    this.data = {
      departid: '',
      name: '',
      isEdit: false
    }
    this.getLstVks(this.sppid);
  }

  handleReload(){this.reloadModal.emit(false), this.isVisible = false}

  handleCancel() {this.closeModal.emit(false), this.isVisible = false}

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpps = [];
    } else {
      this.categoriesService.getLstSpp(value).subscribe(res => {
        this.lstSpps = res;
      });
    }
  }
}
