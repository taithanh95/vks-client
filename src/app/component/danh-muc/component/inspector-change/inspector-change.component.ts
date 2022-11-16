import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../service/general-service";
import {NotificationService} from "../../../../service/notification.service";
import {Constant} from "../../../../shared/constants/constant.class";

@Component({
  selector: 'app-inspector-change',
  templateUrl: './inspector-change.component.html',
  styleUrls: ['./inspector-change.component.scss']
})
export class InspectorChangeComponent implements OnInit {
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
      this.lstSppIsDepart = [];
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
    if (!this.data.ks && !this.data.dt && !this.data.ld && !this.data.kh) {
      this.notificationService.showNotification(Constant.ERROR, 'Vị trí công tác buộc phải nhập');
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
    console.log('handleSubmit: ', data);
    let payload = {
      ...data,
      sppid: data.sppidchange
    };
    this.generalService.changeInspector(payload).subscribe(res => {
      if (res) {
        const msg = this.generalService.readPropertiesJava(res);
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Điều chuyển người xử lý thành công');
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

  onInputSPP(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSppIsDepart = [];
    } else {
      if (value === ' ') {
        value = '0';
      }
      this.generalService.getListSppAutoComplete(value, this.data?.SPPID).subscribe(res => {
        this.lstSppIsDepart = res;
      });
    }
  }
}
