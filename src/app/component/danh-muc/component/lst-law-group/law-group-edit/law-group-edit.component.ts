import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-law-group-edit',
  templateUrl: './law-group-edit.component.html',
  styleUrls: ['./law-group-edit.component.scss']
})
export class LawGroupEditComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Input() lstLawGroup: any[];
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
    payload.action = 'U';
    this.generalService.insertOrUpdateLawGroup(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật chương luật thành công');
        this.handleCancel();
        this.reload.emit();
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
