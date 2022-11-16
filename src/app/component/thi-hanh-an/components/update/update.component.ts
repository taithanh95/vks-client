import {Component, OnDestroy, OnInit} from '@angular/core';
import {SppService} from "../../../../service/spp-service";
import {GeneralService} from "../../../../service/general-service";
import {Router} from "@angular/router";
import {NotificationService} from "../../../../service/notification.service";
import {CookieService} from "ngx-cookie-service";
import {Constant} from "../../../../shared/constants/constant.class";
import {WebUtilities} from "../../../../shared/utils/qla-utils.class";
import {ResponseBody} from "../../../so-thu-ly/model/response-body";
import {ConstantService} from "../../../../service/constant.service";

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit, OnDestroy {

  /*DIALOGS*/
  isShowPopupRegister: boolean; // Thụ lý
  isShowPopupRegisterDisable: boolean; // Thụ lý
  isShowPopupRegins: boolean; // Kiểm sát viên
  isShowPopupReginsDisable: boolean; // Kiểm sát viên
  isShowPopupPenalty: boolean; // Kiểm sát viên
  isShowPopupPenaltyDisable: boolean; // Kiểm sát viên
  isShowPopupDecision: boolean; // Quyết định
  isShowPopupDecisionDisable: boolean; // Quyết định
  isShowPopupDecisionJudicial: boolean; // Quyết định
  isShowPopupDecisionJudicialDisable: boolean; // Quyết định

  /** INFO USE */
  sppid: any;
  userfor = 'G6';
  userInfo: any;
  sppCase: any;

  /* ISVISIBLE FIELD */
  arrCollapse: any[];

  /** SELECTED DATA */
  selectedRegister: any;
  selectedRegins?: any;
  selectedPenalty?: any;
  selectedDecision?: any;
  selectedDecisionJudicial?: any;

  /* LIST */
  lstRegister?: any[];
  lstRegins?: any[];
  lstPenalty?: any[];
  lstDecisionAccu?: any[];
  lstDecisionJudicial?: any[];

  /** IS VALUE */
  isRegiSelected = false;
  registerable = false;
  isDeciJudicialable = false;
  isDecisisionable = true;
  isPenaltiesable = true;

  constructor(
    private sppService: SppService,
    private generalService: GeneralService,
    private constantService: ConstantService,
    private router: Router,
    private notificationService: NotificationService,
    private cookieService: CookieService
  ) {
    this.selectedRegister = sppService.getCurrentSppRegister();
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.sppid = WebUtilities.getLoggedSppId();
    if (this.selectedRegister) {
      this.sppCase = {
        casecode: this.selectedRegister?.casecode,
        casetype: this.selectedRegister?.casetype,
        casetypename: this.selectedRegister?.casetypename,
        casename: this.selectedRegister?.casename,
        crimdate: this.selectedRegister?.crimdate,
        remark_name: this.selectedRegister?.remark_name,
        setnum_ba: this.selectedRegister?.setnum_ba,
        indate_ba: this.selectedRegister?.indate_ba,
        rname: this.selectedRegister?.rname,
        fullname: this.selectedRegister?.fullname,
        accucode: this.selectedRegister?.accucode,
        crimdate_from: this.selectedRegister?.crimdate_from,
        crimdate_to: this.selectedRegister?.crimdate_from,
        legalper: this.selectedRegister?.legalper
      }
    }
  }

  ngOnDestroy(): void {
    this.sppService.setCurrentSppRegister(null);
  }

  ngOnInit(): void {
    if (localStorage.getItem(Constant.USER_INFO) === null
      || localStorage.getItem(Constant.USERID) !== this.cookieService.get(Constant.USERNAME)) {
      localStorage.clear();
      this.router.navigate(['login'], {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
    }
    this.lstRegister = [];
    this.lstRegins = [];
    this.lstPenalty = [];
    this.lstDecisionAccu = [];
    if (this.selectedRegister) {
      this.handleFetchData();
      // set dữ liệu vào vụ án

    }
  }

  handleFetchData() {
    this.isCheckRegister(this.selectedRegister.accucode, this.selectedRegister.regicode);
    this.getListRegister();
    this.getListRegins();
    this.getListPenalties();
    this.getListDecisionJudicial();
    this.getListDecision();
    this.checkDisable()
  }

  isCheckRegister(accucode, regicode) {
    this.registerable = false;
    const search = {
      regicode: regicode,
      userfor: this.userfor,
      sppid: this.sppid,
      accucode: accucode
    }
    this.generalService.checkRegisterableG6(search)
      .toPromise()
      .then(res => {
        if (res.responseCode === '0000')
          this.registerable = 'Y' === res.responseMessage ? true : false;
        else
          this.notificationService.showNotification(Constant.ERROR, res.responseMessage);
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, error.error.text);
      });
  }

  /* REGISTER - SỔ THỤ LÝ */
  getListRegister() {
    this.lstRegister = [];
    const filter = {
      rowIndex: 0,
      pageSize: 10,
      casecode: this.selectedRegister.casecode,
      userfor: this.userfor,
      sppid: this.sppid,
      regiCode: this.selectedRegister.regicode
    }
    this.generalService.getListRegisterG6(filter)
      .toPromise()
      .then(res => {
        if (res.responseCode === '0000') {
          this.lstRegister = res.responseData;
          if (!this.isRegiSelected) {
            const length = this.lstRegister.length;
            this.selectedRegister = this.lstRegister[length - 1];
            this.selectedRegister.selected = true;
            this.selectedRegister = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(this.selectedRegister);
          }
        } else {
          this.selectedRegister.indate = null;
          this.selectedRegister.regicode = null;
          this.selectedRegister.setnum = null;
          this.selectedRegister.fromdate = null;
          this.selectedRegister.todate = null;
          this.selectedRegister.remark = null;
        }
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, error.error.text);
      });
  }

  /*REGINS - KIỂM SÁT VIÊN*/
  async getListRegins() {
    this.lstRegins = [];
    const filter = {
      casecode: this.selectedRegister.casecode,
      sortOrder: 'ASC',
      csppid: this.sppid,
      usefor: this.userfor,
      regicode: this.selectedRegister.regicode
    };
    this.generalService.getListPropoAssign(filter)
      .toPromise()
      .then(res => {
        if (res) this.lstRegins = res.datas;
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, error.error.text);
      });
  }

  /*PENALTY - QUYẾT ĐỊNH THI HÀNH ÁN */
  async getListPenalties() {
    this.lstPenalty = [];
    const request = {
      rowIndex: 0,
      pageSize: 20,
      accuCode: this.selectedRegister.accucode,
      regiCode: this.selectedRegister.regicode
    }
    if (request.accuCode && request.regiCode) {
      this.generalService.getListExcecutionG6(request)
        .toPromise()
        .then(resp => {
          if (resp.responseCode === '0000') {
            this.lstPenalty = resp.responseData;
          } else if (resp.responseCode === '0007') {
            // Không tìm thấy KQ nào thì không làm gì
          } else {
            this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
          }
        }, () => {
          this.notificationService.showNotification(Constant.ERROR, Constant.MESSAGE_SERVICE_ERROR);
        });
    }
  }

  /* DECISIONJUDICICAL - QUYẾT ĐỊNH THI HÀNH BIỆN PHÁP TƯ PHÁP */
  async getListDecisionJudicial() {
    this.lstDecisionJudicial = [];
    const request = {
      status: 1,
      accucode: this.sppCase?.accucode,
      regicode: this.selectedRegister?.regicode
    }
    this.constantService.postRequest(`${this.constantService.QLAHS_URL}decisionJudicial/getList/`, request)
      .toPromise().then(respJson => respJson.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.lstDecisionJudicial = resp.responseData;
          this.lstDecisionJudicial.forEach(e => {
            e.escaped = e.escaped === 1 ? true : false;
            e.isDead = e.isDead === 1 ? true : false;
            });
          if (resp.responseData.length > 0){
            this.isDeciJudicialable = true;
          }
        } else {
          this.isDeciJudicialable = false;
          // this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }, () => {
        this.notificationService.showNotification(Constant.ERROR, Constant.MESSAGE_SERVICE_ERROR);
      });
  }

  /* DECISION - QUYẾT ĐỊNH KHÁC*/
  async getListDecision() {
    this.lstDecisionAccu = [];
    const filter = {
      accucode: this.selectedRegister.accucode,
      regicode: this.selectedRegister.regicode,
      usefor: this.userfor
    };
    this.generalService.getListDecisionG6(filter)
      .toPromise()
      .then(res => {
        if (res.responseCode === '0000') this.lstDecisionAccu = res.responseData;
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, error.responseMessage);
      });
  }

  checkDisable(): void {
    if (this.selectedRegister && this.selectedRegister.resulttha && this.selectedRegister.resulttha === 'Y') this.isDecisisionable = false;
  }

  /*REGINS - HANDLES - KIỂM SÁT VIÊN*/
  showPopupRegins(data): void {
    this.isShowPopupRegins = true;
    if (data) {
      this.selectedRegins = {}
      this.selectedRegins.isEdit = true;
      this.selectedRegins.position_type = data.POSITION_NAME;
      this.selectedRegins.assigndate = data.ASSIGNDATE_REGINS
      this.selectedRegins.setnum = data.SETNUM_REGINS
      this.selectedRegins.assignins = data.ASSIGNINS
      this.selectedRegins.inspcode = data.INSPCODE
    } else {
      this.selectedRegins = {};
      this.selectedRegins.isEdit = false;
      this.selectedRegins.position_type = 'KS';
    }
  }

  showPopupDisableRegins(data): void {
    this.isShowPopupRegins = true;
    this.isShowPopupReginsDisable = true;
    if (data) {
      this.selectedRegins = {}
      this.selectedRegins.isEdit = true;
      this.selectedRegins.position_type = data.POSITION_NAME;
      this.selectedRegins.assigndate = data.ASSIGNDATE_REGINS
      this.selectedRegins.setnum = data.SETNUM_REGINS
      this.selectedRegins.assignins = data.ASSIGNINS
      this.selectedRegins.inspcode = data.INSPCODE
    }
  }

  deleteRowRegins(data): void {
    this.generalService.deleteRegins(this.selectedRegister.casecode, data.INSPCODE, this.selectedRegister.regicode).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa kiểm sát viên thành công');
      this.getListRegins();
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      if (msg) {
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.getListRegins();
      }
    });
  }

  reloadRegins($event): void {
    this.getListRegins();
  }

  closePopupRegins($event): void {
    this.isShowPopupRegins = false;
    this.isShowPopupReginsDisable = false;
  }

  /* END REGINS */


  // Popup register
  registerChange(value) {
    this.isRegiSelected = true;
    value = WebUtilities.toLowercaseFields(value);
    if (value.regicode === this.selectedRegister.regicode) {
      return;
    }
    this.userfor = value.userfor;
    this.selectedRegister = value;
  }

  showPopupRegister(data): void {
    this.isShowPopupRegister = true;
    if (data) {
      // -> lowercase field
      this.selectedRegister = WebUtilities.toLowercaseFields(data);
      this.selectedRegister.unspecial = this.selectedRegister.unspecial === true ? 'Y' : 'N';
      this.selectedRegister.isEdit = true;
    } else {
      this.selectedRegister.transfer = 'NEW';
      this.selectedRegister.unspecial = 'N';
      this.selectedRegister.isEdit = false;
      //Set default here
    }
  }

  showPopupRegisterDisable(data): void {
    this.isShowPopupRegister = true;
    this.isShowPopupRegisterDisable = true;
    this.selectedRegister = WebUtilities.toLowercaseFields(data);
    this.selectedRegister.unspecial = this.selectedRegister.unspecial === true ? 'Y' : 'N';
    this.selectedRegister.isEdit = true;
  }

  closePopupRegister(): void {
    this.isShowPopupRegister = false;
    this.isShowPopupRegisterDisable = false;
  }

  deleteRegister(code): void {
    this.generalService.deleteRegisterG6(code).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thụ lý thành công');
      this.registerable = true;
      this.getListRegister();
      // alert(res.length);
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      if (msg) {
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.getListRegister();
      }
    });
  }

  /*DECISION - HANDLES - QUYẾT ĐỊNH KHÁC */
  showPopupDecision(data): void {
    this.isShowPopupDecision = true;
    if (data) {
      this.selectedDecision = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(data);
      this.selectedDecision.isEdit = true;
    } else {
      this.selectedDecision = {};
      this.selectedDecision.isEdit = false;
      this.selectedDecision.settime = 0;
      this.selectedDecision.setunit = 'D';
      this.selectedDecision.esettime = 0;
      this.selectedDecision.esetunit = 'D';
    }
  }

  showPopupDisableDecision(data): void {
    this.isShowPopupDecision = true;
    this.isShowPopupDecisionDisable = true;
    if (data) {
      this.selectedDecision = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(data);
      this.selectedDecision.isEdit = true;
      this.selectedDecision.setnumdeci = data.SETNUM;
    }
  }

  deleteRowDecision(data): void {
    this.generalService.deleteDecisionAcc(data.DECICODE).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa quyết định thành công');
      this.getListDecision();
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      if (msg) {
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.getListDecision();
      }
    });
  }

  realoadDecision(data): void {
    this.getListDecision();
  }

  closePopupDecision(event): void {
    this.isShowPopupDecision = false;
    this.isShowPopupDecisionDisable = false;
  }

  /** END DECISION */

  reloadRegister($event) {
    this.selectedRegister.regicode = $event;
    this.getListRegister();
    this.isCheckRegister(this.sppCase.accucode, $event);
  }

  /*DECISIONJUDICAI - HANDLES - QUYẾT ĐỊNH THI HÀNH BIỆN PHÁP TƯ PHÁP */
  showPopupDecisionJudicial(data): void {
    this.isShowPopupDecisionJudicial = true;
    if (data) {
      this.selectedDecisionJudicial = Object.assign({}, data);
    } else {
      this.selectedDecisionJudicial = {};
    }
  }

  showPopupDecisionJudicialDisable(data): void {
    this.isShowPopupDecisionJudicial = true;
    this.isShowPopupDecisionJudicialDisable = true;
    if (data) {
      this.selectedDecisionJudicial = Object.assign({}, data);
    }
  }

  deleteRowDecisionJudicial(id): void {
    this.constantService.postRequest(`${this.constantService.QLAHS_URL}decisionJudicial/delete/`, {deciJudicialId: id})
      .toPromise().then(respJson => respJson.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.notificationService.showNotification(Constant.SUCCESS, resp.responseMessage);
          this.getListDecisionJudicial();
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }, () => {
        this.notificationService.showNotification(Constant.ERROR, Constant.MESSAGE_SERVICE_ERROR);
      });
  }

  realoadDecisionJudicial(data): void {
    this.getListDecisionJudicial();
  }

  closePopupDecisionJudicial(event): void {
    this.isShowPopupDecisionJudicial = false;
    this.isShowPopupDecisionJudicialDisable = false;
  }

  /** END DECISION */

  /*PENALTIES - HANDLES - QUYẾT ĐỊNH THI HÀNH ÁN */
  showPopupPenalty(data): void {
    this.isShowPopupPenalty = true;
    if (data) {
      this.selectedPenalty = Object.assign({}, WebUtilities.toLowercaseFields(data));
      this.selectedPenalty.isEdit = true;
    } else {
      this.selectedPenalty = {};
      this.selectedPenalty.isEdit = false;
    }
    this.selectedPenalty.casecode = this.selectedRegister.casecode;
    this.selectedPenalty.regicode = this.selectedRegister.regicode;
    this.selectedPenalty.accucode = this.sppCase.accucode;
    this.selectedPenalty.legalper = this.sppCase.legalper;
  }

  showPopupPenaltyDisabled(data): void {
    this.isShowPopupPenalty = true;
    this.isShowPopupPenaltyDisable = true;
    if (data) {
      this.selectedPenalty = Object.assign({}, WebUtilities.toLowercaseFields(data));
      this.selectedPenalty.casecode = this.selectedRegister.casecode;
      this.selectedPenalty.regicode = this.selectedRegister.regicode;
      this.selectedPenalty.accucode = this.sppCase.accucode;
      this.selectedPenalty.legalper = this.sppCase.legalper;
    }
  }

  deleteRowPenalty(data): void {
    this.constantService.postRequest(`${this.constantService.QLAHS_URL}sppExecution/delete/`,
      {
        accuCode: data.accuCode,
        regiCode: data.regiCode})
      .toPromise().then(respJson => respJson.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.notificationService.showNotification(Constant.SUCCESS, 'Đã xóa bản ghi thành công');
          this.getListPenalties();
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }, () => {
        this.notificationService.showNotification(Constant.ERROR, Constant.MESSAGE_SERVICE_ERROR);
      });
  }

  realoadPenalty(data): void {
    this.getListPenalties();
  }

  closePopupPenalty(event): void {
    this.isShowPopupPenalty = false;
    this.isShowPopupPenaltyDisable = false;
  }

  /** END PENALTIES */
}
