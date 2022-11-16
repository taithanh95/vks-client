import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-law-group-create',
  templateUrl: './law-group-create.component.html',
  styleUrls: ['./law-group-create.component.scss']
})
export class LawGroupCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() lstLawGroup: any[];
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
    if (!this.data.groupname) {
      this.notificationService.showNotification(Constant.ERROR, 'Chương luật buộc phải nhập');
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
    this.generalService.insertOrUpdateLawGroup(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới chương luật thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else {
        if (res === 'lstLawgroup.error.exist'){
          this.notificationService.showNotification(Constant.ERROR, 'Tên chương luật đã tồn tại');
        }
      }
      this.loading = false;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR,  error.error.text);
      this.loading = false;
    });
  }
}

