import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {Constant} from '../../../../../shared/constants/constant.class';
@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss']
})
export class LocationEditComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  // data: any;
  sppid: any;
  lstLocation = [];
  /*LIST DƠN VỊ */
  lstSpp = [];

  loading: boolean;
  isSubmited: boolean;

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      this.getListLocation(this.data?.locaparent, this.data.localevel - 1);
    }
  }

  ngOnInit(): void {
    this.data = {};
  }

  resetData() {
    this.data = {}
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleOk() {
    this.isSubmited = true;
    this.loading = true;
    let valid = true;
    if (!this.data.name) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên địa chính buộc phải nhập');
      valid = false;
    }
    if (!this.data.remark) {
      this.notificationService.showNotification(Constant.ERROR, 'Ghi chú buộc phải nhập');
      valid = false;
    }
    if (!this.data.locaparent) {
      this.notificationService.showNotification(Constant.ERROR, 'Mã địa chính cấp cha buộc phải nhập');
      valid = false;
    }
    if (valid) {
      this.isSubmited = false;
      this.handleSubmit(this.data);
    } else {
      this.loading = false;
    }
  }

  handleSubmit(data) {
    const payload = {
      ...data,
      locaparent: data.locaparent ? data?.locaparent?.LOCAID : null,
    };
    this.generalService.updateLocation(payload).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật Địa chính thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else {
        this.handleErr(res);
        this.loading = false;
      }
    }, error => {
      this.handleErr(error.error.text);
      this.loading = false;
    });
  }

  handleErr(err: string){
    if (err === 'name_exit') {
      this.notificationService.showNotification(Constant.ERROR, 'Tên địa chính đã tồn tại');
    } else {
      const msgErr = this.generalService.jsonErrorDM[err];
      this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
    }
  }

  getListLocation(query,level): void {
    this.generalService.autocompleteLocation2(query,level).subscribe(res => {
      this.loading = false;
      this.lstLocation = res;
      // tslint:disable-next-line:no-shadowed-variable
      this.data.locaparent = this.lstLocation.find(res => res.locaid = query);
      this.data.locaparent = this.lstLocation[0];
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  onInputLocation(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstLocation = [];
    } else {
      this.generalService.autocompleteLocation(value).subscribe(res => {
        this.lstLocation = res;
      });
    }
  }
}
