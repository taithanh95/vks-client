import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-law-penalty-update',
  templateUrl: './law-penalty-update.component.html',
  styleUrls: ['./law-penalty-update.component.scss']
})
export class LawPenaltyUpdateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  lstPenalty: any[];
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
      this.getListPenalty();
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
    this.generalService.insertOrUpdateLawPenalty(payload).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật khung hình phạt thành công');
        this.handleCancel();
        this.reload.emit();
      } else {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi khi cập nhật khung hình phạt');
      }
      this.loading = false;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
      this.loading = false;
    });
  }

  onInputPenalty(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstPenalty = [];
    } else {
      this.generalService.getListPenaltyByQuery({
        query: value,
      }).subscribe(res => {
        this.lstPenalty = res;
      });
    }
  }

  private getListPenalty(): void {
    this.generalService.getListPenaltyByQuery({
      query: ' ',
    }).subscribe(res => {
      this.loading = false;
      this.lstPenalty = res;
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }
}
