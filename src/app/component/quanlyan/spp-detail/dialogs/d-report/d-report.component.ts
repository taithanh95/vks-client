import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CategoriesService} from "../../../../../service/categories.service";
import {NotificationService} from "../../../../../service/notification.service";
import {DateChangeService} from "../../../../../service/date-change.service";
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";
import {Constant} from "../../../../../shared/constants/constant.class";
import {GeneralService} from "../../../../../service/general-service";

@Component({
  selector: 'app-d-report',
  templateUrl: './d-report.component.html',
  styleUrls: ['./d-report.component.scss']
})
export class DReportComponent implements OnInit {
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() isVisibleDisable: boolean;
  @Input() data: any;
  @Input() sppCase: any;
  @Input() register: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  sppId: any;
  isSubmited: boolean;
  loading: boolean;
  /*DEMO*/
  inputValue?: any;

  constructor(
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private datechangeService: DateChangeService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
    if (!this.data) {
      // alert('vao day');
      this.data = {};
    }
  }

  ngOnInit(): void {
    this.isSubmited = false;
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.loading = false;
    }
    this.isSubmited = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleReset(): void {
    this.doReset();
  }

  doReset() {
    this.data = {};
    this.isSubmited = false;
    this.data.isEdit = false;
  }

  handleOk(): void {
    this.loading = true;
    this.isSubmited = true;
    let valid = true;
    if (!this.data.setnum) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Số báo cáo');
      valid = false;
    }
    if (!this.data.indate) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày báo cáo');
      valid = false;
    }
    if (!this.data.content) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Nội dung báo cáo');
      valid = false;
    }
    if (valid) {
      this.isVisible = false;
      this.closeModal.emit(false);
      this.data.userfor = this.userfor;
      this.submitForm.emit(this.data);
      this.submitReportAppeal(this.data);
    } else {
      this.loading = false;
    }
  }

  onValueIndate(event: any) {
    this.data.indate = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  private submitReportAppeal(data): void {
    console.log('sppcase', this.sppCase);
    console.log('data', data);
    const savedItem = {...data,
      option: 'I',
      casecode: this.sppCase.CASECODE,
      regicode: this.register.regicode
    };
    let actionText = 'Thêm mới';
    if (data.isEdit) {
      savedItem.option = 'U';
      actionText = 'Cập nhật';
    } else {
      savedItem.option = 'I';
    }
    this.generalService.saveReportAppeal(savedItem).subscribe(res => {
      this.loading = false;
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, res.result);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, actionText + ' thành công');
        this.submitForm.emit(this.data);
      }
    }, error => {
      if (error.error && error.error.text) {
        this.notificationService.showNotification(Constant.ERROR, error.error.text);
      } else {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
      }
    });
  }
}
