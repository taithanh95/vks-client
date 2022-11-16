import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {DateChangeService} from "../../../../../service/date-change.service";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-law-edit',
  templateUrl: './law-edit.component.html',
  styleUrls: ['./law-edit.component.scss']
})
export class LawEditComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean;
  @Input() lstCode: any[];
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();

  lstLawGroup: any[];
  loading: boolean;
  isSubmited: boolean;

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private datechangeService: DateChangeService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isVisible){
      this.onInputLawGroup();
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
    if (!this.data.codeid) {
      this.notificationService.showNotification(Constant.ERROR, 'Bộ luật buộc phải nhập');
      valid = false;
    }
    if (!this.data.groupid) {
      this.notificationService.showNotification(Constant.ERROR, 'Chương luật buộc phải nhập');
      valid = false;
    }
    if (!this.data.lawdate) {
      this.notificationService.showNotification(Constant.ERROR, 'Ngày ban hành buộc phải nhập');
      valid = false;
    }
    if (!this.data.lawid) {
      this.notificationService.showNotification(Constant.ERROR, 'Điều luật buộc phải nhập');
      valid = false;
    }
    if (!this.data.priority) {
      this.notificationService.showNotification(Constant.ERROR, 'Độ ưu tiên buộc phải nhập');
      valid = false;
    }
    if (!this.data.setorder) {
      this.notificationService.showNotification(Constant.ERROR, 'Thứ tự buộc phải nhập');
      valid = false;
    }
    if (!this.data.lawname) {
      this.notificationService.showNotification(Constant.ERROR, 'Tội danh buộc phải nhập');
      valid = false;
    }
    if (!this.data.lawtype) {
      this.notificationService.showNotification(Constant.ERROR, 'Mức độ nghiêm trọng buộc phải nhập');
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
    this.generalService.updateLaw(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật điều luật thành công');
        this.handleCancel();
        this.reload.emit();
        this.resetData();
      } else {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi khi cập nhật điều luật');
      }
      this.loading = false;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR,  error.error.text);
      this.loading = false;
    });
  }

  onValueLawdate(event: any){
    this.data.lawdate = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onInputLawGroup(): void {
    this.generalService.getListLawGroup({code: this.data.codeid}).subscribe(res => {
      if (res) {
        this.lstLawGroup = res;
      } else {
        this.lstLawGroup = [];
      }
    });
  }
}

