import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {Constant} from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-police-create',
  templateUrl: './police-create.component.html',
  styleUrls: ['./police-create.component.scss']
})
export class PoliceCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  // data: any;
  sppid: any;
  policeChildId: any;
  policenamenew: any;
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
      this.policenamenew = '';
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
    if (!this.policenamenew) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên cơ quan công an buộc phải nhập');
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
      name: this.policenamenew,
      addr: this.data.addr.LOCAID,
      policeid: this.data.policeId,
      atxspp: data.sppid,
      sppid: null,
      newpoliceid: this.policeChildId
    };
    this.generalService.insertPolice(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới Cơ quan công an thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else if (res === 'existname'){
        this.notificationService.showNotification(Constant.ERROR, 'Đã tồn tại tên cơ quan công an này trong CSDL');
      } else if (res === 'existid'){
        this.notificationService.showNotification(Constant.ERROR, 'Đã tồn tại mã cơ quan công an này trong CSDL');
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
    this.generalService.getidPolice({
      sppid: this.data.policeId,
      spplevel: this.data.policeLevel,
    }).subscribe(res => {
      this.loading = false;
      this.policeChildId = res;
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
      if ((parseInt(this.data.policeLevel) + 1) === 2) {
        this.policenamenew = 'CA ' + this.data.addr.NAME;
      } else if ((parseInt(this.data.policeLevel) + 1) === 3) {
        this.policenamenew = 'CA ' + this.data.addr.NAME;
      }
    }
  }

}
