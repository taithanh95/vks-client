import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-prison-create',
  templateUrl: './prison-create.component.html',
  styleUrls: ['./prison-create.component.scss']
})
export class PrisonCreateComponent implements OnInit {
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


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
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
      this.notificationService.showNotification(Constant.ERROR, 'Tên cơ quan công an buộc phải nhập');
      valid = false;
    }
    if (!this.data.addr) {
      this.notificationService.showNotification(Constant.ERROR, 'Địa điểm buộc phải nhập');
      valid = false;
    }
    if (!this.data.sppid) {
      this.notificationService.showNotification(Constant.ERROR, 'Viện kiểm sát buộc phải nhập');
      valid = false;
    }
    if (!this.data.ptype) {
      this.notificationService.showNotification(Constant.ERROR, 'Loại trại giam buộc phải nhập');
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
    let payload = {...data,
    sppid:this.data.sppid.SPPID};
    payload.action = 'I';
    this.generalService.insertOrUpdatePrison(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới Trại giam thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else if (res === 'error' ) {
        this.notificationService.showNotification(Constant.ERROR, 'Đã tồn tại tên trại giam này trong CSDL');
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

}
