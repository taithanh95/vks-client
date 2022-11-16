import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-borderguards-create',
  templateUrl: './borderguards-create.component.html',
  styleUrls: ['./borderguards-create.component.scss']
})
export class BorderguardsCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  // data: any;
  sppid: any;
  newsppid: any;
  borguanamenew: any;
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
      this.borguanamenew = '';
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
    if (!this.newsppid) {
      this.notificationService.showNotification(Constant.ERROR, 'Mã đơn vị biên phòng buộc phải nhập');
      valid = false;
    }
    if (!this.borguanamenew) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên đơn vị biên phòng buộc phải nhập');
      valid = false;
    }
    if (!this.data.locaid) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa chỉ buộc phải nhập');
      valid = false;
    }

    if (!this.data.sppid) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên VKS buộc phải nhập');
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
      sppid: null,
      addr: data.locaid ? data?.locaid?.LOCAID : null,
      locaid: data.locaid ? data?.locaid?.NAME : null,
      newborguaid: this.newsppid,
      atxspp: this.data.sppid,
      name: this.borguanamenew,
      borguaid: this.data.borguaid,
    };
    this.generalService.insertBorguards(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới Đơn vị biên phòng thành công');
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
    if (err === 'existname') {
      this.notificationService.showNotification(Constant.ERROR, 'Đã tồn tại tên đơn vị biên phòng này trong CSDL');
    } else if (err === 'existid') {
      this.notificationService.showNotification(Constant.ERROR, 'Mã đơn vị biên phòng đã tồn tại');
    } else {
      const msgErr = this.generalService.jsonErrorDM[err];
      this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
    }
  }

  getid(): void {
    this.generalService.getId({
      sppid: this.data.borguaid,
      spplevel: this.data.borgualevel,
    }).subscribe(res => {
      this.loading = false;
      this.newsppid = res;
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
    if (this.data.locaid && this.data.locaid instanceof Object) {
      if ((parseInt(this.data.borgualevel) + 1) === 2) {
        this.borguanamenew = 'Biên phòng ' + this.data.locaid.NAME;
      } else if ((parseInt(this.data.borgualevel) + 1) === 3) {
        this.borguanamenew = 'Đồn biên phòng ' + this.data.locaid.NAME;
      }
    }
    console.log('this.borguaname: ', this.borguanamenew);
  }
}
