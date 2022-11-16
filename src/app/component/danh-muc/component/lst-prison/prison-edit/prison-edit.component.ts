import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-prison-edit',
  templateUrl: './prison-edit.component.html',
  styleUrls: ['./prison-edit.component.scss']
})
export class PrisonEditComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  sppid: any;
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

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      this.getListSpp();
    }
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
    let payload = {
      ...data,
      sppid:this.data.sppid.SPPID};
    payload.action = 'U';
    this.generalService.insertOrUpdatePrison(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật trại giam thành công');
        this.handleCancel();
        this.reload.emit();
      } else {
        if (res === 'LstPrison.error.exist'){
          this.notificationService.showNotification(Constant.ERROR, 'Tên trại giam đã tồn tại');
        }
      }
      this.loading = false;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR,  error.error.text);
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

  getListSpp(): void {
    console.log('this.data: ',this.data);
    this.generalService.getListSppByQuery({
      query: this.data?.sppid,
      sppid: this.sppid
    }).subscribe(res => {
      this.loading = false;
      this.lstSpp = res;
      this.data.sppid = this.lstSpp.find(spp => spp.SPPID === this.data?.sppid);
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }
}
