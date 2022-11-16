import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-code-edit',
  templateUrl: './code-edit.component.html',
  styleUrls: ['./code-edit.component.scss']
})
export class CodeEditComponent implements OnInit {
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
    if (!this.data.codename) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên bộ luật buộc phải nhập');
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
    this.generalService.insertOrUpdateCode(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật bộ luật thành công');
        this.handleCancel();
        this.reload.emit();
      } else {
        if (res === 'LstCode.error.exist'){
          this.notificationService.showNotification(Constant.ERROR, 'Tên bộ luật đã tồn tại');
        }
      }
      this.loading = false;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR,  error.error.text);
      this.loading = false;
    });
  }
}
