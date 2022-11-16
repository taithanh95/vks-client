import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-spc-create',
  templateUrl: './spc-create.component.html',
  styleUrls: ['./spc-create.component.scss']
})
export class SpcCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  // data: any;
  sppid: any;
  spcChildId: any;
  spcnamenew: any;
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
      this.spcnamenew = '';
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
    if (!this.spcnamenew) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên tòa án quan buộc phải nhập');
      valid = false;
    }
    if (!this.data.addr) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa chỉ buộc phải nhập');
      valid = false;
    } else if (!this.data.addr.LOCAID) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa chỉ buộc phải nhập');
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
      name: this.spcnamenew,
      addr: this.data.addr.LOCAID,
      spcid: this.data.spcid,
      newspcid: this.spcChildId
    };
    this.generalService.insertSPC(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới Tòa án quan thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else {
        if (res === 'existname')
        this.notificationService.showNotification(Constant.ERROR, 'Tên Tòa án đã tồn tại');
      }
      this.loading = false;
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      this.notificationService.showNotification(Constant.ERROR, msg);
      this.loading = false;
    });
  }

  getid(): void {
    this.generalService.getidSPC({
      spcid: this.data.spcid,
      spclevel: this.data.spclevel,
    }).subscribe(res => {
      this.loading = false;
      this.spcChildId = res;
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

  // onInputSpp(e: any): void {
  //   const value = (e.target as HTMLInputElement).value;
  //   if (!value || value.indexOf('@') >= 0) {
  //     this.lstSpp = [];
  //   } else {
  //     this.generalService.getListSppByQuery({
  //       query: value,
  //       sppid: this.sppid
  //     }).subscribe(res => {
  //       this.lstSpp = res;
  //     });
  //   }
  // }

  handleChange(): void {
    if (this.data.addr && this.data.addr instanceof Object) {
      if (this.data.addr.LOCALEVEL === '2') {
        this.spcnamenew = 'TAND ' + this.data.addr.NAME;
      } else if (this.data.addr.LOCALEVEL === '3') {
        this.spcnamenew = 'TAND Tỉnh ' + this.data.addr.NAME;
      }
    }
  }
}
