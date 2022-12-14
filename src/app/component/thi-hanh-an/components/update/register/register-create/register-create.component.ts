import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationService} from "../../../../../../service/notification.service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {Constant} from "../../../../../../shared/constants/constant.class";
import {SppRegister} from "../../../../../../model/spp-register";
import {WebUtilities} from "../../../../../../shared/utils/qla-utils.class";
import {GeneralService} from "../../../../../../service/general-service";
import * as moment from 'moment';

@Component({
  selector: 'app-register-create',
  templateUrl: './register-create.component.html',
  styleUrls: ['./register-create.component.scss']
})
export class RegisterCreateComponent implements OnInit {
  @Input() sppCase: any;
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() isVisibleDisable: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Output() reloadRegister: EventEmitter<any> = new EventEmitter();

  isSubmited: boolean;
  loading: boolean;

  /** INFO USE */
  sppid: any;
  userInfo: any;

  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private datechangeService: DateChangeService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.sppid = WebUtilities.getLoggedSppId();
    if (!this.data) {
      // alert('vao day');
      this.data = new SppRegister();
    }
  }

  ngOnInit(): void {
    this.isSubmited = false;
  }

  ngOnChanges(): void {
    this.isSubmited = false;
    if (this.isVisible) {
      this.loading = false;
      if (this.data) {
        this.data.unspecial = this.data.unspecial === true ? 'Y' : 'N';
        this.data.userforname = this.toUseforName(this.data?.userfor);
      }
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleOk(): void {
    this.loading = true;
    this.isSubmited = true;
    let valid = true;

    if (!this.data.setnum) {
      this.notificationService.showNotification(Constant.ERROR, 'B???n ph???i nh???p gi?? tr??? cho tr?????ng Th??? l?? s???');
      valid = false;
    }
    if (!this.data.indate) {
      this.notificationService.showNotification(Constant.ERROR, 'B???n ph???i nh???p gi?? tr??? cho tr?????ng Ng??y th??? l??');
      valid = false;
    }
    if (this.sppCase.indate_ba && this.data.indate &&
      moment(new Date(this.sppCase.indate_ba)).isAfter(new Date(this.data.indate))) {
      this.notificationService.showNotification(Constant.ERROR, 'Ng??y th??? l?? ph???i sau ng??y ra b???n ??n');
      valid = false;
    }
    if (!this.data.fromdate) {
      this.notificationService.showNotification(Constant.ERROR, 'B???n ph???i nh???p gi?? tr??? cho tr?????ng Th???i h???n th??? l?? t??? ng??y');
      valid = false;
    }

    if (!this.data.todate) {
      this.notificationService.showNotification(Constant.ERROR, 'B???n ph???i nh???p gi?? tr??? cho tr?????ng Th???i h???n th??? l?? ?????n ng??y');
      valid = false;
    }

    if (valid) {
      this.data.userfor = this.userfor;
      this.submitRegister(this.data);
    } else {
      this.loading = false;
    }
  }

  onValueIndate(event: any) {
    this.data.indate = this.datechangeService.onDateValueChange(event);
  }

  onValueSpcindate(event: any) {
    this.data.spcindate = this.datechangeService.onDateValueChange(event);
  }

  onValueFromdate(event: any) {
    this.data.fromdate = this.datechangeService.onDateValueChange(event);
  }

  onValueTodate(event: any) {
    this.data.todate = this.datechangeService.onDateValueChange(event);
  }

  valiDate() {
    if (this.data.indate) {
      this.data.fromdate = this.data.indate;
    }
    if (this.data.todate) {
      const indate = new Date(this.data.indate);
      const todate = new Date(this.data.todate);
      const dayCount = WebUtilities.calculateDiff(todate, indate);
      if (dayCount < 0) {
        this.data.todate = null;
        this.notificationService.showNotification(Constant.ERROR, 'Th???i h???n th??? l?? ?????n ng??y ph???i l???n h??n ho???c b???ng Ng??y th??? l??');
      }
    }
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  toUseforName(useFor): any {
    switch (useFor) {
      case 'G1':
        return 'Ki???m s??t ??i???u tra';
      case 'G2':
        return 'Ki???m s??t GQA - Truy t???';
      case 'G3':
        return 'Ki???m s??t XX s?? th???m';
      case 'G4':
        return 'Ki???m s??t XX ph??c th???m';
      case 'G5':
        return 'Ki???m s??t XX G??T, TT';
      case 'G6':
        return 'Ki???m s??t XX thi h??nh ??n';
    }
    return '';
  }

  submitRegister(data): void {
    data.userforname = this.generalService.toUserForName(this.userfor);
    const savedItem = {
      sppCase: this.sppCase,
      sppId: this.sppid,
      sppRegister: data,
      userId: this.userInfo.userid
    };

    let actionText = 'Th??m m???i';
    if (data.regicode) {
      actionText = 'C???p nh???t';
    }
    this.generalService.saveRegisterG6(savedItem).subscribe(res => {
      if (res.responseCode === '0000') {
        const msg = this.generalService.readPropertiesJava(res.responseMessage);
        if (msg) {
          this.notificationService.showNotification(Constant.ERROR, msg);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, `${actionText} th??? l?? th??nh c??ng`);
          this.reloadRegister.emit(res.responseMessage);
          if (!data.regicode) {
            this.data.regicode = res.responseMessage;
          } else {
            this.isVisible = false;
            this.closeModal.emit(false);
          }
        }
        this.loading = false;
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, res.responseMessage);
      }
    }, error => {
      this.loading = false;
      this.notificationService.showNotification(Constant.SUCCESS, error.error.text);
    });
  }
}
