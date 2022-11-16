import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CategoriesService} from '../../../../../service/categories.service';
import {DateChangeService} from '../../../../../service/date-change.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {SppService} from '../../../../../service/spp-service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {StringService} from "../../../../../common/util/string.service";

@Component({
  selector: 'app-update-reveice',
  templateUrl: './update-reveice.component.html',
  styleUrls: ['./update-reveice.component.scss']
})
export class UpdateReveiceComponent implements OnInit, OnDestroy {

  isSubmited: boolean;
  data: any;
  selectedSpp: any;
  loading: any;
  atxSpp: any;
  /* OPTION */
  lstTransfer: any[];
  lstSppid: any[];

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private datechangeService: DateChangeService,
    private sppService: SppService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private stringService: StringService
  ) {
    this.selectedSpp = WebUtilities.getLoggedSpp();
    this.data = this.sppService.getCurrentSppCase();
    this.data.acceptdate = this.data.transdate;
  }
  ngOnDestroy(): void {
    this.sppService.setCurrentSppCase(null);
  }

  ngOnInit(): void {
    this.atxSpp = null;
    this.loading = false;
    this.isSubmited = false;
    if (this.data.transid) {
      this.getListTransfer();
    }
  }

  getListTransfer(): void {
    this.categoriesService.getTransferByTransId(this.data.transid).subscribe(res => {
      this.lstTransfer = res;
    }, err => {
      alert('Lỗi dữ liệu');
    });
  }

  changeValueDate($item,$event) {
    this.data[$item] = this.datechangeService.onDateValueChange($event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  handleOk() {
    this.isSubmited = true;
    this.loading = true;
    let valid = true;
    if (!this.data.acceptdate) {
      this.notificationService.showNotification(Constant.ERROR, 'Bắt buộc phải nhập giá trị trường Ngày nhận');
      valid = false;
    }
    if (!this.data.receipter) {
      this.notificationService.showNotification(Constant.ERROR, 'Bắt buộc phải nhập giá trị trường Người nhận');
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
    const payload = {...data,action: 'U', receipter: this.stringService.capitalize(data.receipter)};
    this.generalService.updateSppReveice(payload).subscribe(res => {
      if (res) {
        const msg = this.generalService.readPropertiesJava(res);
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật vụ án thành công');
        this.handleCancel();
      }
      this.loading = false;
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      this.notificationService.showNotification(Constant.ERROR, msg);
      this.loading = false;
    });
  }

  handleCancel() {
    this.router.navigate(['/admin/vu-an/search/nhan-an']);
  }
 
  checkDate() {
    if (this.data.acceptdate && this.data.transdate) {
      const transdate = new Date(this.data.transdate);
      const accept = new Date(this.data.acceptdate);
      const count = WebUtilities.calculateDiff(transdate, accept);
      if (count > 0) {
        this.notificationService.showNotification(Constant.ERROR,'Ngày nhận phải sau ngày giao');
        this.data.acceptdate = null;
      }
    }
  }

}
