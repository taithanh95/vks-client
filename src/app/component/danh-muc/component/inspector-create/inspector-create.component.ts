import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../service/general-service";
import {NotificationService} from "../../../../service/notification.service";
import {Constant} from "../../../../shared/constants/constant.class";
import {WebUtilities} from "../../../../shared/utils/qla-utils.class";
import {StringService} from '../../../../common/util/string.service';

@Component({
  selector: 'app-inspector-create',
  templateUrl: './inspector-create.component.html',
  styleUrls: ['./inspector-create.component.scss']
})
export class InspectorCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  data: any;
  sppId: any;
  /*LIST DƠN VỊ */
  lstSpp = [];
  lstSppIsDepart = [];

  loading: boolean;
  isSubmited: boolean;

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private stringService: StringService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      this.data.STATUS = 'Y';
      this.getListSpp();
      this.onInputSppIsDepart();
    }
  }

  ngOnInit(): void {
    this.data = {}
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
    if (!this.data.FULLNAME) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên người xử lý buộc phải nhập');
      valid = false;
    }
    if (!this.data.ks && !this.data.dt && !this.data.ld && !this.data.kh) {
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
    payload.action = 'I';
    this.generalService.insertOrUpdateInspector({...payload, fullname: this.stringService.capitalize(data.FULLNAME)}).subscribe(res => {
      if (res) {
        const msg = this.generalService.readPropertiesJava(res);
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới người xử lý thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
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
      sppid: this.sppId
    }).subscribe(res => {
      this.loading = false;
      this.lstSpp = res;
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  onInputSppIsDepart(): void {
    this.generalService.getListSppIsDepart({
      sppid: this.data?.SPPID
    }).subscribe(res => {
      this.loading = false;
      this.lstSppIsDepart = res;
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }
}
