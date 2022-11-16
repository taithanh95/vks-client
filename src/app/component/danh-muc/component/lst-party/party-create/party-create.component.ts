import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-party-create',
  templateUrl: './party-create.component.html',
  styleUrls: ['./party-create.component.scss']
})
export class PartyCreateComponent implements OnInit {
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
    if (!this.data.partyname) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên chức vụ buộc phải nhập');
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
    this.generalService.insertOrUpdateParty(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới chức vụ Đảng thành công');
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
