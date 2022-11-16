import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {delay} from 'rxjs/operators';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss']
})
export class CreateReportComponent implements OnInit, OnChanges {

  @Input() data: any; 
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() reload:EventEmitter<boolean> = new EventEmitter();
  loading = false;
  isSubmited = false;
  parentname: string;
  childrenname: string;
  
  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) { }

  ngOnChanges(): void {
    if (this.isVisible && this.data) {
      if (this.data.isEdit) {
        this.parentname = 'Tên chỉ tiêu hiện tại';
        this.childrenname = 'Tên chỉ tiêu mới';
      } else {
        this.parentname = 'Tên chỉ tiêu cha';
        this.childrenname = 'Tên chỉ tiêu con';
      }
    }
  }

  ngOnInit(): void {
    this.data = {};
  }

  handleOk() {
    this.isSubmited = true;
    if (!this.data.name) {
      this.notificationService.showNotification(Constant.ERROR, `Phải nhập Trường ${this.childrenname}`);
    } else {
      this.isSubmited = false;
      this.onSubmit(this.data);
    }
  }

  onSubmit(data) {
    this.generalService.saveReport(data).pipe(delay(500)).subscribe(res => {
      const msg = data.isEdit ? 'Cập nhật' : 'Thêm mới'
      this.notificationService.showNotification(Constant.SUCCESS, `${msg} dữ liệu thành công`);
      this.loading = false;
      this.reload.emit(false);
      this.handleCancel();
    }, () => {
      this.loading = false;
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
    });
  }

  handleCancel() {
    this.isVisible = false;
    this.closeModal.emit(false);
  } 
}
