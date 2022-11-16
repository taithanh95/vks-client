import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DateService} from 'src/app/common/util/date.service';
import {GeneralService} from 'src/app/service/general-service';
import {WebUtilities} from 'src/app/shared/utils/qla-utils.class';
import {CategoriesService} from '../../../../service/categories.service';
import {DateChangeService} from '../../../../service/date-change.service';
import {NotificationService} from '../../../../service/notification.service';
import {Constant} from '../../../../shared/constants/constant.class';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnChanges {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Input() isVisibleEdit: boolean;
  @Input() isVisibleDis: boolean;
  @Input() isEdit: boolean;
  @Input() actionTHA: string;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  /* Handle Loads*/
  loading: boolean;

  /* Valid */
  isSubmited: boolean;

  /* Option */
  lstSppidf: any[];
  lstSppidt: any[];

  constructor(
    private datechangeService: DateChangeService,
    private notificationService: NotificationService,
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private dateService: DateService
  ) { }

  ngOnChanges(): void {
    if (this.data) {
      this.getLstVKS();
    }
  }

  ngOnInit(): void {
    this.loading = false;
    this.isSubmited = false;
  }

  handleOk(): void {
    this.isSubmited = true;
    this.loading = true;
    let valid = true;

    if (!this.data.atxsppidt) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị Trường VKS nhận');
      valid = false;
    }

    if (!this.data.transdate) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhậm giá trị Trường Ngày ủy thác');
      valid = false;
    }

    if (!this.data.sender) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhậ giá trị Trường Người chuyển')
      valid = false;
    }

    if (this.isVisibleEdit && !this.data.acceptdate) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị Trường Ngày nhận');
      valid = false;
    }

    if (this.isVisibleEdit  && !this.data.receipter) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị Trường Người nhận');
      valid = false;
    }
    if (valid) {
      this.loading = false;
      this.isSubmited = false;
      this.submitFormDetail(this.data);
    } else {
      this.loading = false;
    }
  }

  handleCancel(): void {
    this.closeModal.emit(false);
    this.isVisible = false;
  }

  onValueDate($item, $event): void {
    this.data[$item] = this.datechangeService.onDateValueChange($event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onInputSppidf(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSppidt = [];
    } else {
      this.categoriesService.getListVKS(value).subscribe(res => {
        this.lstSppidt = res;
      });
    }
  }

  getLstVKS(): void {
    // list VKS nhận
    this.categoriesService.getListVKS(this.data.sppidt).subscribe(res => {
      this.lstSppidt = res;
      this.data.atxsppidt = this.lstSppidt.find(e => e.sppid === this.data.sppidt);
    });

    // list VKS ủy thác
    this.categoriesService.getListVKS(this.data.sppidf).subscribe(res => {
      this.lstSppidf = res;
      this.data.atxsppidf = this.lstSppidf.find(e => e.sppid === this.data.sppidf);
    });
  }

  submitFormDetail(data): void {
    const indate = this.indateChange();
    if (!indate) {
      return;
    }
    if (data) {
      const payload = { ...data, sppidt: data.atxsppidt.sppid, sppidf: data.atxsppidf.sppid }
      this.generalService.updateEnforcement(payload).subscribe(res => {
        this.loading = false;
        if (res) {
          this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới không thành công');
          return;
        }

        if (data.action === 'I') {
          this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới thông tin thành công');
          this.data.action = 'U';
        } else if (data.action === 'U') {
          this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật thông tin thành công');
          this.isVisible = false;
          this.closeModal.emit(false);
        } else if (data.action === 'NA') {
          if (data.result === 'Y') {
            this.notificationService.showNotification(Constant.SUCCESS, 'Nhận ủy thác thành công');
          } else {
            this.notificationService.showNotification(Constant.SUCCESS, 'Từ chối nhận ủy thác');
          }
          this.data.action = 'UN';
        } else if (data.action === 'UN') {
          this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật thông tin thành công');
          this.isVisible = false;
          this.closeModal.emit(false);
        }

      }, () => {
        this.loading = false;
        this.notificationService.showNotification(Constant.ERROR, 'Thêm mới không thành công')
      }
      )
    }
  }

  indateChange(): boolean {
    let valid = true;
    if (this.data.transdate) {
      const transdate = new Date(this.data.transdate);
      if (this.data.decidate) {
        const decidate = new Date(this.data.decidate);
        const count = WebUtilities.calculateDiff(decidate,transdate);
        if (count > 0 ) {
          this.notificationService.showNotification(Constant.ERROR,'Ngày ủy thác phải lớn hơn hoặc bằng ngày ra quyết định');
          valid = false;
        }
      }
      if (this.data.acceptdate) {
        const accpetdate = new Date(this.data.acceptdate);
        const count = WebUtilities.calculateDiff(transdate,accpetdate);
        if (count > 0) {
          if (this.data.result && this.data.result === 'N') {
            this.notificationService.showNotification(Constant.ERROR,'Ngày từ chối ủy thác phải lớn hơn hoặc bằng ngày ủy thác');
          } else {
            this.notificationService.showNotification(Constant.ERROR,'Ngày nhận ủy thác phải lớn hơn hoặc bằng ngày ủy thác')
          }
          valid = false;
        }
      }
      if (this.data.acceptreject) {
        const reject = new Date(this.data.acceptreject);
        const count = WebUtilities.calculateDiff(reject,transdate);
        if (count > 0) {
          const dateMsg = this.dateService.convertDateToStringByPattern(reject,'dd/MM/yyyy');
          this.notificationService.showNotification(Constant.ERROR,`Ngày ủy thác phải lớn hơn hoặc bằng ngày từ chối ủy thác :${dateMsg}`)
          valid = false
        }
      }
    }

    if (this.data.acceptdate && this.data.indatedtl) {
      const accept = new Date(this.data.acceptdate);
      const indatedtl = new Date(this.data.indatedtl);
      const count = WebUtilities.calculateDiff(accept,indatedtl);
      if (count > 0) {
        const dateMsg = this.dateService.convertDateToStringByPattern(indatedtl,'dd/MM/yyyy');
        this.notificationService.showNotification(Constant.ERROR,`Vụ án đã có thụ lý thi hành án, ngày nhận ủy thác phải nhỏ hoặc bằng ngày thụ lý thi hành án : ${dateMsg}`)
        valid = false
      }
    }
    return valid;
  }
}
