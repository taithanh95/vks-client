import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-customs-create',
  templateUrl: './customs-create.component.html',
  styleUrls: ['./customs-create.component.scss']
})
export class CustomsCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  // data: any;
  sppid: any;
  customChildId: any;
  customsnamenew: any;
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


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      this.customsnamenew = '';
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
    if (!this.customsnamenew) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên đơn vị hải quan buộc phải nhập');
      valid = false;
    }
    if (!this.data.addr) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa chỉ buộc phải nhập');
      valid = false;
    }
    if (!this.data.sppid) {
      this.notificationService.showNotification(Constant.ERROR, 'Viện kiểm sát cùng cấp buộc phải nhập');
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
      name: this.customsnamenew,
      addr: this.data.addr.LOCAID,
      customid: this.data.customid,
      atxspp: data.sppid,
      sppid: null,
      newcustomid: this.customChildId
    };
    this.generalService.insertCustoms(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới Đơn vị hải quan thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else {
        const msg = this.generalService.jsonErrorDM[res];
        this.notificationService.showNotification(Constant.ERROR, msg);
      }
      this.loading = false;
    }, error => {
      this.handleErr(error.error.text);
      this.loading = false;
    });
  }

  handleErr(err: string){
    if (err === 'existname') {
      this.notificationService.showNotification(Constant.ERROR, 'Đã tồn tại tên đơn vị hải quan này trong CSDL');
    } else if (err === 'existid') {
      this.notificationService.showNotification(Constant.ERROR, 'Đã tồn tại mã đơn vị hải quan này trong CSDL');
    } else {
      const msgErr = this.generalService.jsonErrorDM[err];
      this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
    }
  }

  getid(): void {
    this.generalService.getid({
      sppid: this.data.customid,
      spplevel: this.data.customlevel,
    }).subscribe(res => {
      this.loading = false;
      this.customChildId = res;
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

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpp = [];
    } else {
      this.generalService.getListSppByQuery({
        query: value,
        sppid: this.sppid
      }).subscribe(res => {
        this.lstSpp = res;
      });
    }
  }

  handleChange(): void {
    if (this.data.addr && this.data.addr instanceof Object) {
      if (this.data.addr.LOCALEVEL === '2') {
          this.customsnamenew = 'Cục Hải quan ' + this.data.addr.NAME;
      } else if (this.data.addr.LOCALEVEL === '3') {
        this.customsnamenew = 'Chi cục Hải quan ' + this.data.addr.NAME;
      }
    }
    console.log('this.customsname: ', this.customsnamenew);
  }
}
