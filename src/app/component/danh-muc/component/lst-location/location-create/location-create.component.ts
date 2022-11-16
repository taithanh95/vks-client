import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {Constant} from '../../../../../shared/constants/constant.class';
@Component({
  selector: 'app-location-create',
  templateUrl: './location-create.component.html',
  styleUrls: ['./location-create.component.scss']
})
export class LocationCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  // data: any;
  sppid: any;
  locationChildId: any;
  locationnamenew: any;
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
      this.locationnamenew = '';
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
    if (!this.locationnamenew) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên địa chính buộc phải nhập');
      valid = false;
    }
    if (!this.data.remark) {
      this.notificationService.showNotification(Constant.ERROR, 'Ghi chú buộc phải nhập');
      valid = false;
    }
    if (!this.locationChildId) {
      this.notificationService.showNotification(Constant.ERROR, 'Mã địa chính buộc phải nhập');
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
      name: this.locationnamenew,
      newlocaid: this.locationChildId,
      locaid: this.data.locaid
    };
    this.generalService.insertLocation(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới Địa chính thành công');
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
    } else if (err === 'existid') {
      this.notificationService.showNotification(Constant.ERROR, 'Mã địa chính đã tồn tại');
    } else {
      const msgErr = this.generalService.jsonErrorDM[err];
      this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
    }
  }

  getid(): void {
    this.generalService.getIdLocation({
      locaid: this.data.locaid,
      localevel: this.data.localevel,
    }).subscribe(res => {
      this.loading = false;
      this.locationChildId = res;
    });
  }
}
