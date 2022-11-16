import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-spp-create',
  templateUrl: './spp-create.component.html',
  styleUrls: ['./spp-create.component.scss']
})
export class SppCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  // data: any;
  sppid: any;
  sppChildId: any;
  sppnamenew: any;
  lstLocation = [];
  /*LIST DƠN VỊ */
  lstSpc = [];

  loading: boolean;
  isSubmited: boolean;

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      this.sppnamenew = '';
      this.getid();
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
    if (!this.sppnamenew) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên đơn vị hải quan buộc phải nhập');
      valid = false;
    }

    if (!this.data.addr) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa chỉ buộc phải nhập');
      valid = false;
    } else if (!this.data.addr.LOCAID) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa chỉ buộc phải nhập');
      valid = false;
    }

    if (!this.data.spcid) {
      this.notificationService.showNotification(Constant.ERROR, 'Tòa án cùng cấp buộc phải nhập');
      valid = false;
    } else if (!this.data.spcid.SPCID) {
      this.notificationService.showNotification(Constant.ERROR, 'Tòa án cùng cấp buộc phải nhập');
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
    let payload = {
      ...data,
      name: this.sppnamenew,
      addr: this.data.addr.LOCAID,
      sppId: this.data.sppId,
      atxtspc: data.spcid,
      spcid: null,
      newsppid: this.sppChildId
    };
    this.generalService.insertSPP(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới Viện kiểm sát thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else if (res === 'existname') {
        this.notificationService.showNotification(Constant.ERROR, 'Đã tồn tại tên viện kiểm sát này trong CSDL');
      } else if(res === 'existid'){
        this.notificationService.showNotification(Constant.ERROR, 'Đã tồn tại mã viện kiểm sát này trong CSDL');
      } else {
        const msg = this.generalService.jsonErrorDM[res];
        this.notificationService.showNotification(Constant.ERROR, msg);
      }
      this.loading = false;
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      this.notificationService.showNotification(Constant.ERROR, msg);
      this.loading = false;
    });
  }

  getid(): void {
    this.generalService.getidSPP({
      sppid: this.data.sppId,
      spplevel: this.data.sppLevel,
    }).subscribe(res => {
      this.loading = false;
      this.sppChildId = res;
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

  onInputSpc(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpc = [];
    } else {
      this.generalService.getListSpcByQuery({
        query: value
      }).subscribe(res => {
        this.lstSpc = res;
      });
    }
  }

  handleChange(): void {
    if (this.data.addr && this.data.addr instanceof Object) {
      if (this.data.addr.LOCALEVEL === '2') {
        if (this.data.addr.NAME.includes('TP')) {
          this.sppnamenew = 'VKS nhân dân ' + this.data.addr.NAME;
        } else {
          this.sppnamenew = 'VKS nhân dân Tỉnh ' + this.data.addr.NAME;
        }
      } else if (this.data.addr.LOCALEVEL === '3') {
        this.sppnamenew = 'VKS nhân dân ' + this.data.addr.NAME;
      }
    }
  }
}
