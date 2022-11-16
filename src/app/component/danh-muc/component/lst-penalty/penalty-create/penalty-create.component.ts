import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-penalty-create',
  templateUrl: './penalty-create.component.html',
  styleUrls: ['./penalty-create.component.scss']
})
export class PenaltyCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  data: any;

  loading: boolean;
  isSubmited: boolean;

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) {
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
    if (!this.data.penaltyname) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên hình phạt buộc phải nhập');
      valid = false;
    }
    if (!this.data.penaltyfor) {
      this.notificationService.showNotification(Constant.ERROR, 'Loại hình phạt buộc phải nhập');
      valid = false;
    }
    if (!this.data.status) {
      this.notificationService.showNotification(Constant.ERROR, 'Trạng thái buộc phải nhập');
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
    this.generalService.insertOrUpdatePenalty(payload).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới hình phạt thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else {
        this.notificationService.showNotification(Constant.ERROR, res);
      }
      this.loading = false;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR,  error.error.text);
      this.loading = false;
    });
  }
}
