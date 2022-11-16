import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../service/general-service";
import {NotificationService} from "../../../../service/notification.service";
import {Constant} from "../../../../shared/constants/constant.class";

@Component({
  selector: 'app-inspector-edit',
  templateUrl: './inspector-edit.component.html',
  styleUrls: ['./inspector-edit.component.scss']
})
export class InspectorEditComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  /*LIST DƠN VỊ */
  lstSpp = [];
  lstSppIsDepart = [];

  loading: boolean;
  isSubmited: boolean;

  constructor(private generalService: GeneralService,
              private notificationService: NotificationService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      this.getListSpp();
      this.onInputSppIsDepart();
      if (this.data.POSITION) {
        const lstPosition = this.data.POSITION.split(',');
        lstPosition.forEach(data => {
          if (data === 'KS') {
            this.data.ks = true;
          } else if (data === 'DT') {
            this.data.dt = true;
          } else if (data === 'LD') {
            this.data.ld = true;
          } else if (data === 'KH') {
            this.data.kh = true;
          } else this.data.POSITION = null;
        });
      }
    }
  }

  ngOnInit(): void {

  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleOk() {
    this.isSubmited = true;
    this.loading = true;
    let valid = true;
    if (!this.data.FULLNAME) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên người xử lý buộc phải nhập');
      valid = false;
    }
    if (!this.data.ks && !this.data.dt && !this.data.ld && !this.data.kh ) {
      this.notificationService.showNotification(Constant.ERROR, 'Vị trí công tác buộc phải nhập');
      valid = false;
    }
    if (!this.data.STATUS) {
      this.notificationService.showNotification(Constant.ERROR, 'Trạng thái làm việc buộc phải nhập');
      valid = false;
    }
    if (!this.data.SPPID) {
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
    let payload = data;
    payload.action = 'U';
    this.generalService.insertOrUpdateInspector(payload).subscribe(res => {
      if (res) {
        const msg = this.generalService.readPropertiesJava(res);
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật người xử lý thành công');
        this.handleCancel();
        this.reload.emit();
      }
      this.loading = false;
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      this.notificationService.showNotification(Constant.ERROR, msg);
      this.loading = false;
    });
  }

  changStatus() {
  }

  getListSpp(): void {
    this.generalService.getListSpp({
      sppid: this.data?.SPPID
    }).subscribe(res => {
      this.loading = false;
      this.lstSpp = res;
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  onInputSppIsDepart(): void {
    this.generalService.getListSppIsDepart(
      {
        sppid: this.data?.SPPID
      }
    ).subscribe(res => {
      this.loading = false;
      this.lstSppIsDepart = res;
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }
}
