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
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit, OnDestroy {

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
    private stringService: StringService,
    private notificationService: NotificationService
  ) {
    this.selectedSpp = WebUtilities.getLoggedSpp();
    this.data = this.sppService.getCurrentSppCase();
  }
  ngOnDestroy(): void {
    this.sppService.setCurrentSppCase(null);
  }

  ngOnInit(): void {
    this.atxSpp = null;
    this.loading = false;
    this.isSubmited = false;
    if (this.data.isEdit) {
      this.getSppName(this.data.sppidt);
    }else{
      this.data.sppnamef = this.selectedSpp.name;
    }
    if (this.data.userfor) {
      this.getListTransfer();
    }
  }

  getSppName(value) {
    const paylod = {
      transid: this.data.transid,
      sppid: this.selectedSpp.sppid,
      casecode: this.data.casecode,
      query: value,
      userfor: this.data.userfor
    }
    this.categoriesService.getListSppSendName(paylod).subscribe(res => {
      this.lstSppid = res;
      this.atxSpp = this.lstSppid.find(e => e.SPPID === value);
    }, err => {
      alert('L???i d??? li???u');
    })
  }

  onInputSppName(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSppid = [];
    } else {
      if (value === ' ') value = '0';
      const paylod = {
        transid: this.data.transid,
        sppid: this.selectedSpp.sppid,
        casecode: this.data.casecode,
        query: value,
        userfor: this.data.userfor
      }
      this.categoriesService.getListSppSendName(paylod).subscribe(res => {
        this.lstSppid = res;
      }, err => {
        alert('L???i d??? li???u');
      })
    }
  }

  blurSppName(){
    if(this.atxSpp && !this.atxSpp.SPPID)
      this.atxSpp = null;
  }

  resetTransfer(){
    this.data.transid = null;
    this.getListTransfer();
  }

  getListTransfer(): void {
    const payload = {
      userforregis: this.data?.userfor_regis,
      userfor: this.data?.userfor,
      sppid: this.selectedSpp.sppid
    }
    this.categoriesService.getListTransfer(payload).subscribe(res => {
      this.lstTransfer = res;
      if(!this.lstTransfer.some(e => e.TRANSID === this.data.transid)){
        this.data.transid = null;
      }
    }, err => {
      alert('L???i d??? li???u');
    });
  }

  changeValueDate($event) {
    this.data.transdate = this.datechangeService.onDateValueChange($event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  handleOk() {
    this.isSubmited = true;
    this.loading = true;
    let valid = true;
    if (!this.data.userfor) {
      this.notificationService.showNotification(Constant.ERROR, 'B???t bu???c ph???i nh???p gi?? tr??? tr?????ng Giai ??o???n');
      valid = false;
    }
    if (!this.data.transid) {
      this.notificationService.showNotification(Constant.ERROR, 'B???t bu???c ph???i nh???p gi?? tr??? tr?????ng Tr?????ng h???p giao nh???n');
      valid = false;
    }
    if (this.data.transid && !this.atxSpp) {
      this.notificationService.showNotification(Constant.ERROR, 'B???t bu???c ph???i nh???p gi?? tr??? tr?????ng T??n VKS nh???n');
      valid = false;
    }
    if (!this.data.transdate) {
      this.notificationService.showNotification(Constant.ERROR, 'B???t bu???c ph???i nh???p gi?? tr??? tr?????ng Ng??y giao');
      valid = false;
    }
    if (!this.data.sender) {
      this.notificationService.showNotification(Constant.ERROR, 'B???t bu???c ph???i nh???p gi?? tr??? tr?????ng Ng?????i giao');
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
    payload.sppidt = this.atxSpp.SPPID;
    payload.sppidf = this.selectedSpp.sppid;
    payload.sender = this.stringService.capitalize(payload.sender);
    if (data.isEdit) {
      payload.action = 'U';
    } else {
      payload.action = 'I';
    }
    this.generalService.updateSppSend(payload).subscribe(res => {
      if (res) {
        const msg = this.generalService.readPropertiesJava(res);
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'C???p nh???t v??? ??n th??nh c??ng');
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
    this.router.navigate(['/admin/vu-an/search/chuyen-an']);
  }

  resetSppid(){
    this.atxSpp = null;
    this.lstSppid = [];
  }
}
