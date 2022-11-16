import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {GeneralService} from '../../../../service/general-service';
import {SppService} from '../../../../service/spp-service';
import {SppCase} from '../../../../model/sppcase.class';
import {WebUtilities} from '../../../../shared/utils/qla-utils.class';
import {Constant} from '../../../../shared/constants/constant.class';
import {NotificationService} from '../../../../service/notification.service';
import {ResponseBody} from "../../../so-thu-ly/model/response-body";
import {ConstantService} from "../../../../service/constant.service";

@Component({
  selector: 'app-f-case',
  templateUrl: './f-case.component.html',
  styleUrls: ['./f-case.component.scss']
})
export class FCaseComponent implements OnInit, OnChanges {
  @Input() sppCase: any;
  @Input() userfor: any;
  @Output() reload: EventEmitter<any> = new EventEmitter();
  sppCaseClone: any;
  isCollapse: boolean;
  isShowPopup: boolean;
  isVisibleAdd: boolean;
  userInfo: any;
  insertLoading: boolean;
  arrIdDenounce: string[];
  arrIdDenounceUpdate: string[];
  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
  constructor(
    private sppService: SppService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private constantService: ConstantService
    ) {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
  }

  ngOnInit(): void {
    /*alert(`L\u01b0u \u00fd: C\u1ea5p qu\u1eadn/huy\u1ec7n ch\u1ec9 c\u00f3 th\u1ea9m quy\u1ec1n v\u1edbi v\u1ee5 \u00e1n \u00edt nghi\u00eam tr\u1ecdng, nghi\u00eam tr\u1ecdng, r\u1ea5t nghi\u00eam tr\u1ecdng`);*/
    this.isCollapse = true;
    if (this.sppCase) {
      this.sppCase.isEdit = true;
      this.sppCase = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(this.sppService.getCurrentSppCase());
    }
    else {
      this.sppCase = {};
      this.sppCase.isedit = false;
      this.showModalAdd();
    }
  }
  ngOnChanges(): void {
    if (this.sppCase) {
      this.sppCase.isedit = true;
      this.sppCase = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(this.sppService.getCurrentSppCase());
    }
  }
  redirectFormAdd(){
    this.sppService.setCurrentSppCase(null);
    // location.href = '/#/admin/quanlyan/cap-nhat-thong-tin/' + 1;
    window.location.reload();
  }
  showModalAdd(): void {
    this.isVisibleAdd = true;
    this.sppCase.isedit = false;
    this.sppCase = {};

    // location.href = '/admin/quanlyan/cap-nhat-thong-tin/' + 1;
  }

  showEditForm() {
    this.isVisibleAdd = true;
    this.sppCase = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(this.sppCase);
    this.sppCase.isedit = true;
  }
  submitFormInsert(data) {
    if (data.crimdate) {
      data.cday = '' + data.crimdate.getDate();
    }
    data.kham_nghiem_hien_truong = '' + data.kham_nghiem_hien_truong;
    data.nhan_dang = '' + data.nhan_dang;
    data.kham_nghiem_tu_thi = '' + data.kham_nghiem_tu_thi;
    data.kham_xet = '' + data.kham_xet;
    data.nhan_biet_giong_noi = '' + data.nhan_biet_giong_noi;
    data.thuc_nghiem_dieu_tra = '' + data.thuc_nghiem_dieu_tra;
    data.doi_chat = '' + data.doi_chat;
    data.kham_nghiem_hien_truong_ko = '' + data.kham_nghiem_hien_truong_ko;
    data.nhan_dang_ko = '' + data.nhan_dang_ko;
    data.kham_nghiem_tu_thi_ko = '' + data.kham_nghiem_tu_thi_ko;
    data.kham_xet_ko = '' + data.kham_xet_ko;
    data.nhan_biet_giong_noi_ko = '' + data.nhan_biet_giong_noi_ko;
    data.thuc_nghiem_dieu_tra_ko = '' + data.thuc_nghiem_dieu_tra_ko;
    data.doi_chat_ko = '' + data.doi_chat_ko;
    data.tt_hoi_cung = '' + data.tt_hoi_cung;
    data.tt_lk_nbd_ds = '' + data.tt_lk_nbd_ds;
    data.tg_hoi_cung = '' + data.tg_hoi_cung;
    data.tt_lk_bb_tg = '' + data.tt_lk_bb_tg;
    data.tt_lk_nlc = '' + data.tt_lk_nlc;
    data.tt_lk_nbh = '' + data.tt_lk_nbh;
    data.tg_lk = '' + data.tg_lk;
    if (!data.crimtime || data.crimtime === '') {
      data.crimtime = '00:00';
    }
    data.sppid = WebUtilities.getLoggedSppId();
    data.atxLaw = { lawcode: data.atxLaw.lawcode, lawid: data.atxlaw?.lawid };
    // tslint:disable-next-line:max-line-length
    const inputItem = { isTachvu: true, sppId: WebUtilities.getLoggedSppId(), sppcase: data, userId: this.userInfo.userid, withWarn: true  };
    this.generalService.addBanAn(inputItem).subscribe(res => {
      this.insertLoading = false;
      this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới vụ án thành công');
      if(data.denouncementid){
        this.arrIdDenounce = data.denouncementid.split(',');
        this.arrIdDenounce.forEach(e => {
          this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/insertCase/', {
            id: e,
            casecode: res,
            casename: data.casename
          })
            .toPromise().then(resp => resp.json())
            .then((resp: ResponseBody) => {
              if (resp.responseCode === '0000') {

              } else {
                this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
              }
            });
        })
      }
      this.reloadSppCase(res);
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      if (msg) {
        this.reloadSppCase(data.casecode);
        this.notificationService.showNotification(Constant.WARNING, msg);
      }
      else {
        this.notificationService.showNotification(Constant.ERROR, error.error.text);
      }
    });
  }
  reloadSppCase(casecode){
    this.generalService.getSppByCode(casecode).subscribe(resSpp => {
      this.sppService.setCurrentSppCase(resSpp[0]);
      this.sppCase = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(resSpp[0]);
      this.reload.emit(resSpp[0]);
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }
  submitForm(data)
  {
    if (data.casecode){
      this.submitFormUpdate(data);
    }
    else{
      this.submitFormInsert(data);
    }
  }
  submitFormUpdate(data): void {
    data.kham_nghiem_hien_truong = '' + data.kham_nghiem_hien_truong;
    data.nhan_dang = '' + data.nhan_dang;
    data.kham_nghiem_tu_thi = '' + data.kham_nghiem_tu_thi;
    data.kham_xet = '' + data.kham_xet;
    data.nhan_biet_giong_noi = '' + data.nhan_biet_giong_noi;
    data.thuc_nghiem_dieu_tra = '' + data.thuc_nghiem_dieu_tra;
    data.doi_chat = '' + data.doi_chat;
    data.kham_nghiem_hien_truong_ko = '' + data.kham_nghiem_hien_truong_ko;
    data.nhan_dang_ko = '' + data.nhan_dang_ko;
    data.kham_nghiem_tu_thi_ko = '' + data.kham_nghiem_tu_thi_ko;
    data.kham_xet_ko = '' + data.kham_xet_ko;
    data.nhan_biet_giong_noi_ko = '' + data.nhan_biet_giong_noi_ko;
    data.thuc_nghiem_dieu_tra_ko = '' + data.thuc_nghiem_dieu_tra_ko;
    data.doi_chat_ko = '' + data.doi_chat_ko;
    data.tt_hoi_cung = '' + data.tt_hoi_cung;
    data.tt_lk_nbd_ds = '' + data.tt_lk_nbd_ds;
    data.tg_hoi_cung = '' + data.tg_hoi_cung;
    data.tt_lk_bb_tg = '' + data.tt_lk_bb_tg;
    data.tt_lk_nlc = '' + data.tt_lk_nlc;
    data.tt_lk_nbh = '' + data.tt_lk_nbh;
    data.tg_lk = '' + data.tg_lk;
    data.atxLaw = { lawcode: data.atxLaw.lawcode, lawid: data.atxlaw?.lawid };
    if (!data.crimtime || data.crimtime === '') {
      data.crimtime = '00:00';
    }
    const inputItem = { sppId: WebUtilities.getLoggedSppId(), sppcase: data, userId: this.userInfo.userid, withWarn: true  };
    this.generalService.updateBanAn(inputItem).subscribe(res => {
      this.insertLoading = false;
      this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật vụ án thành công');
      this.reloadSppCase(data.casecode);
      if(data.denouncementid){
        this.arrIdDenounce = data.denouncementid.split(',');
        this.arrIdDenounceUpdate = this.arrIdDenounce;
        // const sameArray = this.arrIdDenounce.length === this.arrIdDenounceUpdate.length && this.arrIdDenounce.every((value, index) => value === this.arrIdDenounceUpdate[index]);
        // console.log('sameArray; ', sameArray);
        this.arrIdDenounce.forEach(e => {
          this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/insertCase/', {
            id: e,
            casecode: data.casecode,
            casename: data.casename
          })
            .toPromise().then(resp => resp.json())
            .then((resp: ResponseBody) => {
              if (resp.responseCode === '0000') {

              } else {
                this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
              }
            });
        })
      } else {
        this.arrIdDenounce.forEach(e => {
          this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/insertCase/', {
            id: e,
            casecode: '',
            casename: ''
          })
            .toPromise().then(resp => resp.json())
            .then((resp: ResponseBody) => {
              if (resp.responseCode === '0000') {

              } else {
                this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
              }
            });
        })
      }
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      if (msg) {
        this.reloadSppCase(data.casecode);
        this.notificationService.showNotification(Constant.WARNING, msg);
      }
      else {
        this.notificationService.showNotification(Constant.ERROR, error.error.text);
      }
    });
  }

  closeModalUpdate(data): void {
    this.isVisibleAdd = false;
  }
  toCaseType(caseType){
    switch (caseType) {
      case 'L0':
        return 'Chưa xác định';
        break;
      case 'L1':
        return 'Ít nghiêm trọng';
        break;
      case 'L2':
        return 'Nghiêm trọng';
        break;
      case 'L3':
        return 'Rất nghiêm trọng';
        break;
      case 'L4':
        return 'Đặc biệt nghiêm trọng';
        break;
    }
  }

  confirm() {
    this.redirectFormAdd();
  }
}
