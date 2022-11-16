import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-penalty-edit',
  templateUrl: './penalty-edit.component.html',
  styleUrls: ['./penalty-edit.component.scss']
})
export class PenaltyEditComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  loading: boolean;
  isSubmited: boolean;

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      if (this.data.penaltyfor === 'Bo sung') {
        this.data.penaltyfor = 'N';
      } else if (this.data.penaltyfor === 'Khac') {
        this.data.penaltyfor = 'O';
      } else if (this.data.penaltyfor === 'Chinh') {
        this.data.penaltyfor = 'Y';
      }
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
    payload.action = 'U';
    this.generalService.insertOrUpdatePenalty(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật hình phạt thành công');
        this.handleCancel();
        this.reload.emit();
      } else {
        this.notificationService.showNotification(Constant.ERROR, res);
      }
      this.loading = false;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
      this.loading = false;
    });
  }
}
