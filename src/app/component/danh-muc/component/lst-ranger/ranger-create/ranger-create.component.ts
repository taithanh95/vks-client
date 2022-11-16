import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {Constant} from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-ranger-create',
  templateUrl: './ranger-create.component.html',
  styleUrls: ['./ranger-create.component.scss']
})
export class RangerCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  // data: any;
  sppid: any;
  rangChildId: any;
  rangnamenew: any;
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
      this.rangnamenew = '';
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
    if (!this.rangnamenew) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên đơn vị kiểm lâm buộc phải nhập');
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
      name: this.rangnamenew,
      addr: this.data.addr.LOCAID,
      rangid: this.data.rangid,
      atxspp: data.sppid,
      sppid: null,
      newrangid: this.rangChildId
    };
    this.generalService.insertRanger(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới Đơn vị kiểm lâm thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else if (res === 'existname') {
        this.notificationService.showNotification(Constant.ERROR, 'Đã tồn tại tên đơn vị kiểm lâm này trong CSDL');
      } else if (res === 'existid') {
        this.notificationService.showNotification(Constant.ERROR, 'Đã tồn tại mã đơn vị kiểm lâm này trong CSDL');
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
    this.generalService.getidRanger({
      sppid: this.data.rangid,
      spplevel: this.data.ranglevel,
    }).subscribe(res => {
      this.loading = false;
      this.rangChildId = res;
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
      if ((parseInt(this.data.ranglevel) + 1) === 2) {
        this.rangnamenew = 'Chi cục kiểm lâm ' + this.data.addr.NAME;
      } else if ((parseInt(this.data.ranglevel) + 1) === 3) {
        this.rangnamenew = 'Hạt kiểm lâm ' + this.data.addr.NAME;
      }
    }
  }


}
