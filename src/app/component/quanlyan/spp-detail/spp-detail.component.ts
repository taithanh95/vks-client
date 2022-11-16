import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SppService} from '../../../service/spp-service';
import {ActivatedRoute, Router} from '@angular/router';
import {GeneralService} from '../../../service/general-service';
import {Constant} from '../../../shared/constants/constant.class';
import {SppRegister} from '../../../model/spp-register';
import {WebUtilities} from '../../../shared/utils/qla-utils.class';
import {CategoriesService} from '../../../service/categories.service';
import {NotificationService} from '../../../service/notification.service';
import {CookieService} from 'ngx-cookie-service';
import {of} from 'rxjs';
import {distinct} from 'rxjs/operators';
import {ResponseBody} from "../../so-thu-ly/model/response-body";
import {ConstantService} from "../../../service/constant.service";

@Component({
  selector: 'app-spp-detail',
  templateUrl: './spp-detail.component.html',
  styleUrls: ['./spp-detail.component.scss']
})
export class SppDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  registerable: any;
  userInfo: any;
  sppCase: any;
  userfor: any;
  arrCollapse: any[];

  /*LIST*/
  lstCaseLaw?: any[];
  lstRegister?: any[];
  lstRegins?: any[];
  lstAccu?: any[];
  lstSppDamaged?: any[];
  lstVictim?: any[];
  lstDecisionCase?: any[];
  lstCenG1?: any[];
  lstCenG2?: any[];
  lstCentence?: any[];
  lstAppeal?: any[];
  lstAgainst?: any[];
  lstReportAppeal?: any[];

  lstSppSpcPolG1?: any[];
  lstSppSpcPolG2?: any[];

  lstInfoAccu?: any[];

  /*DIALOGS*/
  isShowPopupRegister: boolean; // Thụ lý
  isShowPopupRegisterDisable: boolean; // Thụ lý
  isShowPopupRegins: boolean; // Kiểm sát viên & điều tra viên
  isShowPopupReginsDisable: boolean; // Kiểm sát viên & điều tra viên
  isShowPopupAccu: boolean; // Bị can bị cáo
  isShowPopupAccuDisable: boolean; // Bị can bị cáo
  isShowSppDamaged: boolean; // Bị hại
  isShowPopupVictim: boolean; // Bị hại
  isShowPopupVictimDisable: boolean; // Bị hại
  isShowPopupAccuLegal: boolean; // Pháp nhân
  isShowPopupAccuLegalDisable: boolean; // Pháp nhân
  isShowPopupDecisionCase: boolean; // Quyết định
  isShowPopupDecisionCaseDisable: boolean; // Quyết định
  isShowPopupDecisionAcc: boolean; // Quyết định bị can
  isShowPopupCenG1: boolean; // Kết luận điều tra
  isShowPopupCenG1Disable: boolean; // Kết luận điều tra

  isShowPopupCentence: boolean; // Bản án
  isShowPopupCentenceDisable: boolean; // Bản án

  isShowPopupReportAppeal: boolean; // Báo cáo kháng nghị G5
  isShowPopupReportAppealDisable: boolean; // Báo cáo kháng nghị G5

  isShowPopupAppeal: boolean; // Kháng cáo
  isShowPopupAppealDisable: boolean; // Kháng cáo

  isShowPopupAgainst: boolean; // Kháng nghị
  isShowPopupAgainstDisable: boolean; // Kháng nghị

  isShowPopupSppSpcPol: boolean; // Giao nhận hồ sơ
  isShowPopupSppSpcPolDisable: boolean; // Giao nhận hồ sơ

  isShowPopupCentApped: boolean; // BA/QĐ bị KC/KN

  isShowPopupAgainstResult: boolean; // KQ Kháng nghị

  /*SELECTED DATA*/
  selectedRegister?: any;
  selectedRegins?: any;
  selectedAccu?: any;
  selectedVictim?: any;
  selectedAccuLegal?: any;
  selectedDecisionCase?: any;
  selectedCenG1?: any;
  selectedCentence: any;
  selectedReportAppeal: any;
  selectedAppeal: any;
  selectedAgainst: any;
  selectedSppSpcPol?: any;
  regiCheckAll = false;
  selectedSpp: any;
  isSubmited: boolean;

  /*Loading*/
  cenG1Loading: boolean;
  cenLoading: boolean;
  appealLoading: boolean;
  againstLoading: boolean;
  checkedAccuId = new Set<any>();

  /* isCheck G3*/
  // isCheckDecision = true;
  // isCheckTransDate = true;
  // isCheckInsert = true;

  constructor(
    private sppService: SppService,
    private generalService: GeneralService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private categoriesService: CategoriesService,
    private cookieService: CookieService,
    private constantService: ConstantService,
  ) {
    this.sppCase = sppService.getCurrentSppCase();
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.userInfo.sppid = WebUtilities.getLoggedSppId();
    this.selectedSpp = WebUtilities.getLoggedSpp();
    if (!this.sppCase) {
      /*this.router.navigate(['/']);*/
    }
  }

  ngOnDestroy(): void {
    this.sppService.setCurrentSppCase(null);
  }

  async ngAfterViewInit() {
    if (this.sppCase) {
      this.getListRegister();
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem(Constant.USER_INFO) === null
      || localStorage.getItem(Constant.USERID) !== this.cookieService.get(Constant.USERNAME)) {
      localStorage.clear();
      this.router.navigate(['login'], {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
    }
    this.lstCaseLaw = [];
    this.lstRegister = [];
    this.lstAccu = [];
    this.lstRegins = [];
    this.lstDecisionCase = [];
    this.registerable = 'N';
    this.isSubmited = false;
    this.route.params.subscribe(routeParams => {
      const id = routeParams.type;
      this.userfor = id;
    });
    if (this.userfor === 'G4' || this.userfor === 'G5') {
      this.getListInfoAcc();
    }
    if (this.sppCase) {
      this.getListCaseLaw();
    }
  }

  getListCaseLaw() {
    const filter = {casecode: this.sppCase.CASECODE, sortOrder: 'ASC', size: 100, userfor: this.userfor};
    this.generalService.getListCaseLawBySppCase(filter).subscribe(res => {
      if (res) {
        this.lstCaseLaw = res.datas;
      }
      // alert(res.length);
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  /*REGISTER - THỤ LÝ*/
  async getListRegister() {
    this.lstRegister = [];
    this.selectedRegister = {};
    this.registerable = true;
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      csppid: this.userInfo.sppid,
      usefor: this.userfor === 'G2' ? 'G1' : this.userfor
    };
    this.generalService.getListRegisterBySppCase(filter).subscribe(res => {
      if (res) {
        this.lstRegister = [];
        const tempDatas = res.datas;
        // selected register when 1 item
        if (tempDatas.length >= 1) {
          this.selectedRegister = tempDatas[tempDatas.length - 1];
          tempDatas[tempDatas.length - 1].selected = true;
          this.registerChange(this.selectedRegister);

          const allItem = {'SETNUM': 'Tất cả', 'REGICODE': '', 'EDITABLE': 'N'};
          if (tempDatas.length > 1) {
            this.lstRegister.push(allItem);
          }
          for (let i = 0; i < tempDatas.length; i++) {
            this.lstRegister.push(tempDatas[i]);
          }
        }
      } else {
        this.lstRegister = [];
        this.registerable = true;
      }
      // alert(res.length);
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  async checkRegisterEditable() {
    const payload = {casecode: this.sppCase.CASECODE, sppId: this.userInfo.sppid, usefor: this.userfor};
    this.generalService.checkRegisterable(payload).subscribe(res => {
      this.registerable = res;
    }, error => {
      // alert(error.error.text);
    });
  }

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  async registerChange(value) {
    value = WebUtilities.toLowercaseFields(value);
    if (value.regicode === this.selectedRegister.regicode) {
      return;
    }
    this.userfor = value.userfor;
    this.selectedRegister = value;
    this.regiCheckAll = false;
    if (!this.userfor || value.regicode === '' || !value.regicode) {
      this.regiCheckAll = true;
      this.userfor = 'G1';
    }
    this.checkRegisterEditable();
    this.getListCaseLaw();
    this.getListRegins();
    this.getListAccu();
    // this.getListVictim();
    this.findBySppDamagedIdCaseCode();
    this.getListDesicionCase();
    if (this.regiCheckAll) {
      this.getListCenG1();
      this.getListCenG2();
      this.getListSppSpcPolG1();
      this.getListSppSpcPolG2();
    } else if (this.userfor === 'G1') {
      this.getListCenG1();
      this.getListSppSpcPolG1();
    } else if (this.userfor === 'G2') {
      this.getListCenG2();
      this.getListSppSpcPolG2();
    } else if (this.userfor === 'G3' || this.userfor === 'G4' || this.userfor === 'G5') {
      this.getListCentence();
      this.getListAppeal();
      this.getListAgainst();
      if (this.userfor === 'G5') this.getListReport();
    }
  }

  // Popup register
  showPopupRegister(data): void {
    this.isShowPopupRegister = true;
    if (data) {
      // -> lowercase field
      this.selectedRegister = WebUtilities.toLowercaseFields(data);
      this.selectedRegister.unspecial = this.selectedRegister.unspecial === true ? 'Y' : 'N';
      this.selectedRegister.isEdit = true;
    } else {
      this.selectedRegister = new SppRegister();
      this.selectedRegister.transfer = 'NEW';
      this.selectedRegister.unspecial = 'N';
      this.selectedRegister.isEdit = false;
      //Set default here
    }
  }

  showPopupRegisterDisable(data): void {
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
    this.generalService.deleteRegister(code).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thụ lý thành công');
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

  submitRegister(data): void {
    data.userforname = this.generalService.toUserForName(this.userfor);
    const savedItem = {
      sppCase: this.sppCase,
      sppId: this.userInfo.sppid,
      sppRegister: data,
      userId: this.userInfo.userid
    };

    let actionText = 'Thêm mới';
    if (data.regicode) {
      actionText = 'Cập nhật';
    }
    this.generalService.saveRegister(savedItem).subscribe(res => {
      if (['G1', 'G2', 'G3', 'G4', 'G5', 'G6'].includes(res)) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày thụ lý giai đoạn sau phải lớn hơn hoặc bằng Ngày thụ lý giai đoạn trước');
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, `${actionText} thụ lý thành công`);
        this.getListRegister();
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  /*REGINS - KIỂM SÁT VIÊN / ĐIỀU TRA VIÊN */
  async getListRegins() {
    this.lstRegins = [];
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      csppid: this.userInfo.sppid,
      usefor: this.userfor,
      regicode: this.selectedRegister.regicode
    };
    this.generalService.getListPropoAssign(filter).subscribe(res => {
      if (res) {
        this.lstRegins = res.datas;
      } else {
        this.lstRegins = [];
      }
      // alert(res.length);
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  showPopupRegins(data): void {
    this.isShowPopupRegins = true;
    if (data) {
      // -> lowercase field
      this.selectedRegins = WebUtilities.toLowercaseFields(data);

      this.selectedRegins.position_type = this.selectedRegins.position_name;
      if (this.selectedRegins.position_name === 'DT') {
        this.selectedRegins.position_type = 'DT';
      } else {
        this.selectedRegins.position_type = 'KS';
        if (this.selectedRegins.position_name === 'PC') {
          this.selectedRegins.position_ksv = 'PC';
        } else {
          this.selectedRegins.position_ksv = 'TG';
        }
      }
      this.selectedRegins.isEdit = true;
      this.selectedRegins.assigndate = this.selectedRegins.assigndate_regins;
      this.selectedRegins.setnum = this.selectedRegins.setnum_regins;


    } else {
      this.selectedRegins = {};
      this.selectedRegins.isEdit = false;
      this.selectedRegins.position_type = 'KS';
      this.selectedRegins.position_ksv = 'PC';
    }
  }

  deleteRegins(item): void {
    this.generalService.deleteRegins(this.sppCase.CASECODE, item.INSPCODE, this.selectedRegister.regicode).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa điều tra viên \ kiểm sát viên thành công');
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

  submitRegins(data): void {
    if (this.selectedRegister) {
      data.userforname = this.generalService.toUserForName(this.userfor);
      data.usefor = this.userfor;
      data.regicode = this.selectedRegister.regicode;
      const savedItem = {sppPropoAssign: data, sppId: this.userInfo.sppid};
      if (data.isEdit) {
        this.generalService.updatePropoAssign(savedItem).subscribe(res => {
          this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật kiểm sát viên / điều tra viên thành công');
          this.getListRegister();
          // alert(res.length);
        }, error => {
          if (error.error && error.error.text) {
            this.notificationService.showNotification(Constant.ERROR, error.error.text);
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
          }
        });
      } else {
        this.generalService.insertPropoAssign(savedItem).subscribe(res => {
          if (res === 'error_exist_record') {
            this.notificationService.showNotification(Constant.ERROR, 'Kiểm sát hoặc Điều tra viên này đã được phân công, hãy chọn Kiểm sát hoặc Điều tra viên khác');
          } else {
            this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới kiểm sát viên / điều tra viên thành công');
            this.getListRegister();
          }
          // alert(res.length);
        }, error => {
          if (error.error && error.error.text) {
            this.notificationService.showNotification(Constant.ERROR, error.error.text);
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
          }
        });
      }
    }
  }

  closePopupRegins(): void {
    this.isShowPopupRegins = false;
    this.isShowPopupReginsDisable = false;
  }

  showPopupReginsDisable(data): void {
    this.isShowPopupReginsDisable = true;
    this.selectedRegins = WebUtilities.toLowercaseFields(data);
    this.selectedRegins.position_type = this.selectedRegins.position_name;
    if (this.selectedRegins.position_name === 'DT') {
      this.selectedRegins.position_type = 'DT';
    } else {
      this.selectedRegins.position_type = 'KS';
      if (this.selectedRegins.position_name === 'PC') {
        this.selectedRegins.position_ksv = 'PC';
      } else {
        this.selectedRegins.position_ksv = 'TG';
      }
    }
    this.selectedRegins.isEdit = true;
    this.selectedRegins.assigndate = this.selectedRegins.assigndate_regins;
    this.selectedRegins.setnum = this.selectedRegins.setnum_regins;
  }

  /*ACCU*/
  async getListAccu() {
    this.lstAccu = [];
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      csppid: this.userInfo.sppid,
      usefor: this.userfor,
      regicode: this.selectedRegister ? this.selectedRegister.regicode : null
    };
    this.generalService.getListAccu(filter).subscribe(res => {
      this.lstAccu = res;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  async findBySppDamagedIdCaseCode() {
    const item = {
      caseCode: this.sppCase.CASECODE
    };
    this.generalService.findBySppDamagedIdCaseCode(item).subscribe(res => {
      this.lstSppDamaged = res;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  showPopupAccuLegal(data): void {
    this.isShowPopupAccuLegal = true;
    if (data) {
      // -> lowercase field
      this.selectedAccuLegal = WebUtilities.toLowercaseFields(data);
      this.selectedAccuLegal.isEdit = true;
    } else {
      this.selectedAccuLegal = {};
      this.selectedAccuLegal.begin_setnum = '';
      this.selectedAccuLegal.begin_indate = new Date();
      this.selectedAccuLegal.begin_office = this.sppCase.BEGIN_OFFICE;
      this.selectedAccuLegal.begin_officeid = this.sppCase.BEGIN_OFFICEID;
      this.selectedAccuLegal.firstacc = 'N';
      this.selectedAccuLegal.religion = 'K';
      this.selectedAccuLegal.sex = 'B';
      this.selectedAccuLegal.counid = 'VN';
      this.selectedAccuLegal.natiid = '01';
      this.selectedAccuLegal.levelid = '01';
      this.selectedAccuLegal.locaid = this.selectedSpp.locaid;
      this.selectedAccuLegal.address = this.selectedSpp.locaid;
      this.selectedAccuLegal.partyid = '';
      this.selectedAccuLegal.isEdit = false;
    }
  }

  showPopupAccu(data): void {
    this.isShowPopupAccu = true;
    if (data) {
      // -> lowercase field
      this.selectedAccu = WebUtilities.toLowercaseFields(data);
      this.selectedAccu.isEdit = true;
      this.selectedAccu.firstacc = this.selectedAccu.firstacc === true ? 'Y' : 'N';
    } else {
      this.selectedAccu = {};
      this.selectedAccu.begin_setnum = '';
      this.selectedAccu.begin_indate = new Date();
      /*this.selectedAccu.begin_office = '02';
      this.selectedAccu.begin_officeid = this.selectedSpp.polid;*/
      this.selectedAccu.begin_office = this.sppCase.BEGIN_OFFICE;
      this.selectedAccu.begin_officeid = this.sppCase.BEGIN_OFFICEID;

      this.selectedAccu.firstacc = 'N';
      this.selectedAccu.religion = 'K';
      this.selectedAccu.sex = 'B';
      this.selectedAccu.counid = 'VN';
      this.selectedAccu.natiid = '01';
      this.selectedAccu.levelid = '01';
      this.selectedAccu.locaid = this.selectedSpp.locaid;
      this.selectedAccu.address = this.selectedSpp.locaid;
      this.selectedAccu.partyid = '';
      this.selectedAccu.isEdit = false;
      /*this.selectedRegins.isEdit = false;
      this.selectedRegins.position_type = 'KS';
      this.selectedRegins.position_ksv = 'PC';*/
    }
  }

  showPopupSppDamaged(data): void {
    this.isShowSppDamaged = true;

  }

  // deleteAccu(code): void {
  //   this.checkRegisterDecision(code);
  //   this.generalService.deleteAccu(code).subscribe(res => {
  //     this.notificationService.showNotification(Constant.SUCCESS, 'Xóa bị can thành công');
  //     this.getListRegister();
  //     this.reloadSppCase(this.sppCase.CASECODE)
  //     // alert(res.length);
  //   }, error => {
  //     const err = error.error.text;
  //     const lstError: string[] = err ? err.split('|'): [];
  //     lstError.forEach(dt => {
  //       const msg = this.generalService.readPropertiesJava(dt);
  //       if (msg) {
  //         this.notificationService.showNotification(Constant.ERROR, msg);
  //       }
  //     })
  //     this.getListRegister();
  //   });
  // }

  deleteAccu(code): void {
    this.constantService.postRequest(
      this.constantService.SOTHULY_URL + 'registerDecision/checkRegisterDecision/',
      {
        type: 2,
        req: code
      }).toPromise().then(resp => resp.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0001') {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        } else {
          this.generalService.deleteAccu(code).subscribe(res => {
            this.notificationService.showNotification(Constant.SUCCESS, 'Xóa bị can thành công');
            this.getListRegister();
            this.reloadSppCase(this.sppCase.CASECODE)
            // alert(res.length);
          }, error => {
            const err = error.error.text;
            const lstError: string[] = err ? err.split('|') : [];
            lstError.forEach(dt => {
              const msg = this.generalService.readPropertiesJava(dt);
              if (msg) {
                this.notificationService.showNotification(Constant.ERROR, msg);
              }
            })
            this.getListRegister();
          });
        }
      }).catch(err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không phản hồi. ' + err.message));
  }

  updateBC(item): void {
    const selectedIds = item.selectedIds;
    const defaultIds = item.defaultIds;

    const insetIds = [];
    item.selectedIds.forEach(en => {
      const notExists = !item.defaultIds.has(en);
      if (notExists) {
        // insetIds.add(en);
        const iAcc = this.lstAccu.find(acc => acc.ACCUCODE === en);
        insetIds.push(iAcc);
      }
    });

    const deleteIds = [];
    item.defaultIds.forEach(en => {
      const notExists = !item.selectedIds.has(en);
      if (notExists) {
        const dAcc = this.lstAccu.find(acc => acc.ACCUCODE === en);
        deleteIds.push(dAcc);
      }
    });
    const payload = {for_type: 'BC', sppAccusedsDeleted: deleteIds, sppAccusedsInserted: insetIds};
    this.generalService.updateBC(payload).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật bị can thành công');
      this.getListAccu();
      this.reloadSppCase(this.sppCase.CASECODE)
    }, error => {
      if (error.error && error.error.text) {
        this.notificationService.showNotification(Constant.ERROR, error.error.text);
      } else {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
      }
    });
  }

  submitAccu(data): void {
    if (this.selectedRegister) {
      data.userforname = this.generalService.toUserForName(this.userfor);
      data.usefor = this.userfor;
      data.regicode = this.selectedRegister.regicode;
      data.sppid = this.userInfo.sppid;
      data.casecode = this.sppCase.CASECODE;

      const savedItem = {
        accused: data,
        action: 'I',
        address: data.address,
        army: data.army,
        border: data.border,
        casecode: this.sppCase.CASECODE,
        country: data.country,
        customs: data.customs,
        lawcode: data.lawcode,
        locaid: data.locaid,
        phapnhan: data.phapnhan,
        police: data.police,
        ranger: data.ranger,
        regicode: data.regicode,
        spc: data.spc,
        spp: data.spp,
        sppid: this.userInfo.sppid
      };
      const _localid = savedItem.locaid.LOCAID ? ('' + savedItem.locaid.LOCAID) : null;
      const _addressid = savedItem.address.LOCAID ? ('' + savedItem.address.LOCAID) : null;
      delete (savedItem.accused.lawcode);
      savedItem.accused.locaid = _localid;
      savedItem.accused.address = _addressid;
      let actionText = 'Thêm mới';
      if (data.isEdit) {
        savedItem.action = 'U';
        actionText = 'Cập nhật';
      } else {
        savedItem.action = 'I';
      }
      this.generalService.saveSppAccused(savedItem).subscribe(res => {
        if (res) {
          const msg = this.generalService.readPropertiesJava(res);
          if (msg) {
            this.notificationService.showNotification(Constant.ERROR, msg);
          } else {
            this.notificationService.showNotification(Constant.SUCCESS, actionText + ' ' + (data.phapnhan === 'P' ? 'pháp nhân' : 'bị can / bị cáo') + ' thành công');
            this.getListAccu();
            this.getListCaseLaw();
          }
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, actionText + ' ' + (data.phapnhan === 'P' ? 'pháp nhân' : 'bị can / bị cáo') + ' thành công');
          this.getListAccu();
          this.getListCaseLaw();
        }
        this.reloadSppCase(this.sppCase.CASECODE)
      }, error => {
        if (error.error && error.error.text) {
          this.notificationService.showNotification(Constant.ERROR, error.error.text);
        } else {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
        }
      });
    }
  }

  closePopupAccu(): void {
    this.isShowPopupAccu = false;
    this.isShowPopupAccuDisable = false;
    this.isShowPopupAccuLegal = false;
    this.isShowPopupAccuLegalDisable = false;
  }


  /*DECISION CASE - Quyết định vụ án*/
  async getListDesicionCase() {
    this.lstDecisionCase = [];
    const filter = {
      applyfor: 'C',
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      usefor: this.userfor,
      regicode: this.selectedRegister.regicode
    };

    if (this.regiCheckAll) {
      delete filter.regicode;
    }
    this.generalService.getListDecision(filter).subscribe(res => {
      if (res) {
        this.lstDecisionCase = res;
        // this.isCheckButtonG3();
      } else {
        this.lstDecisionCase = [];
      }
      // alert(res.length);
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
    });
  }

  showPopupDecisionCase(data): void {
    this.isShowPopupDecisionCase = true;
    if (data) {
      // -> lowercase field
      this.selectedDecisionCase = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(data);
      this.selectedDecisionCase.isEdit = true;
      this.selectedDecisionCase.decitypeid = this.selectedDecisionCase.deciid.substring(0, 2);
    } else {
      this.selectedDecisionCase = {};
      this.selectedDecisionCase.isEdit = false;
      this.selectedDecisionCase.settime = 0;
      this.selectedDecisionCase.setunit = 'Y';

      this.selectedDecisionCase.esettime = 0;
      this.selectedDecisionCase.esetunit = 'M';
      this.selectedDecisionCase.begin_office = this.userfor === 'G1' || this.userfor === 'G2' ? 'SPP' : 'SPC';
      this.selectedDecisionCase.begin_officeid = this.userInfo.sppid;
      this.selectedDecisionCase.decitypeid = '';
    }
  }

  showPopupDecisionCaseDisable(data): void {
    this.isShowPopupDecisionCaseDisable = true;
    this.selectedDecisionCase = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(data);
    this.selectedDecisionCase.isEdit = true;
    this.selectedDecisionCase.decitypeid = this.selectedDecisionCase.deciid.substring(0, 2);
  }

  showPopupDecisionAcc(data): void {
    this.isShowPopupDecisionAcc = true;
  }

  deleteDecisionCase(item): void {
    this.generalService.deleteDecision({...item, RUTGON: false}).subscribe(res => {
      console.log(item);
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa quyết định thành công');
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

  submitDecisionCase(data): void {
    if (this.selectedRegister) {
      data.userforname = this.generalService.toUserForName(this.userfor);
      data.usefor = this.userfor;
      data.regicode = this.selectedRegister.regicode;
      data.sppid = this.userInfo.sppid;
      data.casecode = this.sppCase.CASECODE;

      const savedItem = {
        decision: data,
        action: 'I',
        sppid: this.userInfo.sppid,
        rutgon: data.rutgon === true ?  'Y' : 'N'
      };
      let actionText = 'Thêm mới';
      if (data.isEdit) {
        savedItem.action = 'U';
        actionText = 'Cập nhật';
      } else {
        savedItem.action = 'I';
      }

      this.generalService.saveSppDecisionCase(savedItem).subscribe(res => {
        this.notificationService.showNotification(Constant.SUCCESS, actionText + ' quyết định thành công');
        this.getListDesicionCase();
        this.getListRegister();
      }, error => {
        if (error.error && error.error.text) {
          this.notificationService.showNotification(Constant.ERROR, error.error.text);
        } else {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
        }
      });
    }
  }

  closePopupDecisionCase(): void {
    this.isShowPopupDecisionCase = false;
    this.isShowPopupDecisionCaseDisable = false;
  }

  closePopupDecisionAcc(): void {
    this.isShowPopupDecisionAcc = false;
  }

  reloadDecisionAcc(): void {
    this.getListAccu();
  }

  /*CENTENSE G1 - Kết luận điều tra*/
  async getListCenG1() {
    this.lstCenG1 = [];
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      sppid: this.userInfo.sppid,
      userfor: 'G1',
      regicode: this.selectedRegister.regicode
    };
    this.generalService.getListCentence(filter).subscribe(res => {
      if (res) {
        this.lstCenG1 = res;
      } else {
        this.lstCenG1 = [];
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  async getListCenG2() {
    this.lstCenG1 = [];
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      sppid: this.userInfo.sppid,
      userfor: 'G2',
      regicode: this.selectedRegister.regicode
    };
    this.generalService.getListCentence(filter).subscribe(res => {
      if (res) {
        this.lstCenG2 = res;
      } else {
        this.lstCenG2 = [];
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  showPopupCenG1(data): void {
    this.isShowPopupCenG1 = true;
    if (data) {
      // -> lowercase field
      this.selectedCenG1 = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(data);
      this.selectedCenG1.isEdit = true;
      this.selectedCenG1.centtype = data.CENTTYPE === '1' ? true : false;
    } else {
      this.selectedCenG1 = {};
      this.selectedCenG1.isEdit = false;
    }
  }

  showPopupCenG1Disable(data): void {
    this.isShowPopupCenG1Disable = true;
    this.selectedCenG1 = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(data);
    this.selectedCenG1.isEdit = true;
  }

  deleteCenG1(item): void {
    const deleteItem = {
      centence: item,
      sppId: this.userInfo.sppid,
      regicode: this.selectedRegister.regicode,
      userId: this.userInfo.userid,
      action: 'D'
    };
    this.generalService.deleteUpdateInfoCentenceG1(deleteItem).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, res);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa ' + (this.userfor === 'G1' ? 'kết luận' : 'bản cáo trạng') + ' thành công');
        this.getListRegister();
      }

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

  submitCenG1(data): void {
    if (this.selectedRegister) {
      if (!data.isEdit) {
        data.userforname = this.generalService.toUserForName(this.userfor);
        data.userfor = this.userfor;
        data.regicode = this.selectedRegister.regicode;
      }
      data.sppid = this.userInfo.sppid;
      data.casecode = this.sppCase.CASECODE;
      const savedItem = {
        centence: data,
        action: 'I',
        sppId: this.userInfo.sppid,
        regicode: data.regicode,
        userId: this.userInfo.userid,
        userfor: data.userfor,
        beginOffice: this.sppCase.BEGIN_OFFICE,
        beginOfficeId: this.sppCase.BEGIN_OFFICEID
      };
      let actionText = 'Thêm mới';
      if (data.isEdit) {
        savedItem.action = 'U';
        actionText = 'Cập nhật';
      } else {
        savedItem.action = 'I';
      }
      this.generalService.saveSppCentenceG1(savedItem).subscribe(res => {
        this.cenG1Loading = false;
        if (res.result) {
          this.notificationService.showNotification(Constant.ERROR, res.result);
        } else {
          // this.closePopupCenG1();
          this.notificationService.showNotification(Constant.SUCCESS, actionText + ' ' + (this.userfor === 'G1' ? 'kết luận' : 'bản cáo trạng') + ' thành công');
          this.getListRegister();
          /*if (!data.isEdit) {
            data.isEdit = true;
            // this.showPopupCenG1(data);
            this.selectedCenG1 = data;
          }*/
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

  closePopupCenG1(): void {
    this.isShowPopupCenG1 = false;
    this.isShowPopupCenG1Disable = false;
  }

  /*SPPSPCPOL G1G2 - Giao nhận hồ sơ*/
  async getListSppSpcPolG1() {
    this.lstSppSpcPolG1 = [];
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      sppid: this.userInfo.sppid,
      userfor: 'G1',
      regicode: this.selectedRegister.regicode
    };
    this.generalService.getListSppSpcPol(filter).subscribe(res => {
      if (res) {
        this.lstSppSpcPolG1 = res.datas;
      } else {
        this.lstSppSpcPolG1 = [];
      }
      // alert(res.length);
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  async getListSppSpcPolG2() {
    this.lstSppSpcPolG1 = [];
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      sppid: this.userInfo.sppid,
      userfor: 'G2',
      regicode: this.selectedRegister.regicode
    };
    this.generalService.getListSppSpcPol(filter).subscribe(res => {
      if (res) {
        this.lstSppSpcPolG2 = res.datas;
      } else {
        this.lstSppSpcPolG2 = [];
      }
      // alert(res.length);
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  showPopupSppSpcPol(data): void {
    this.isShowPopupSppSpcPol = true;
    if (data) {
      // -> lowercase field
      this.selectedSppSpcPol = WebUtilities.toLowercaseFields(data);
      this.selectedSppSpcPol.isEdit = true;
      this.selectedSppSpcPol.action = 'U';
      if (this.selectedSppSpcPol.status === true) {
        this.selectedSppSpcPol.status = 'Y';
      }
    } else {
      this.selectedSppSpcPol = {};
      this.selectedSppSpcPol.action = 'I';
      this.selectedSppSpcPol.status = 'Y';
      this.selectedSppSpcPol.isEdit = false;
      this.selectedSppSpcPol.sppid = this.selectedSpp.sppid;
      this.selectedSppSpcPol.polid = '02';
      this.selectedSppSpcPol.policeid = '01';

      if (this.userfor === 'G2') {
        this.selectedSppSpcPol.changeid = '01';
        this.selectedSppSpcPol.polid = 'SPP';
        this.selectedSppSpcPol.spcid = this.selectedSpp.spcid;
      } else if (this.userfor === 'G1') {
        this.selectedSppSpcPol.changeid = '04';
      }
    }
    if (this.userfor === 'G1')
      this.selectedCenG1 = this.lstCenG1.find(e => e.STATUS === 'Y');
    else if (this.userfor === 'G2')
      this.selectedCenG1 = this.lstCenG2.find(e => e.STATUS === 'Y');
  }

  showPopupSppSpcPolDisable(data): void {
    this.isShowPopupSppSpcPolDisable = true;
    this.selectedSppSpcPol = WebUtilities.toLowercaseFields(data);
    this.selectedSppSpcPol.isEdit = true;
    this.selectedSppSpcPol.action = 'U';
    if (this.selectedSppSpcPol.status === true) {
      this.selectedSppSpcPol.status = 'Y';
    }
  }

  deleteSppSpcPol(data): void {
    if (this.selectedRegister) {
      const savedItem = {
        action: 'D',
        casecode: this.sppCase.CASECODE,
        ppl: {
          userfor: this.userfor,
          regicode: this.selectedRegister.regicode,
          changeid: data.CHANGEID,
          transcode: data.TRANSCODE,
          transdate: data.TRANSDATE,
          lststatus: [data.STATUS]
        }
      };
      this.generalService.saveSppSpcPol(savedItem).subscribe(res => {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa hồ sơ thành công');
        this.getListRegister();
      }, error => {
        if (error.error && error.error.text) {
          this.notificationService.showNotification(Constant.ERROR, error.error.text);
        } else {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
        }
      });
    }
  }

  submitSppSpcPol(data): void {
    if (this.selectedRegister) {
      if (!data.isEdit) {
        data.userforname = this.generalService.toUserForName(this.userfor);
        data.userfor = this.userfor;
        data.regicode = this.selectedRegister.regicode;
      }
      data.sppid = this.userInfo.sppid;
      data.casecode = this.sppCase.CASECODE;
      delete data.atxSpp.isdepart;
      if (data.changeid === '01' || data.changeid === '04') {
        data.lststatus = [data.status];
      } else {
        data.lststatus = [];
      }
      const savedItem = {
        action: 'I',
        casecode: this.sppCase.CASECODE,
        ppl: data,
        regicode: data.regicode,
        userid: this.userInfo.userid,
      };
      let actionText = 'Thêm mới';
      if (data.isEdit) {
        savedItem.action = 'U';
        actionText = 'Cập nhật';
      } else {
        savedItem.action = 'I';
      }
      this.generalService.saveSppSpcPol(savedItem).subscribe(res => {
        this.notificationService.showNotification(Constant.SUCCESS, `${actionText} hồ sơ thành công`);

        if (this.regiCheckAll) {
          this.getListSppSpcPolG1();
          this.getListSppSpcPolG2();
        } else if (this.userfor === 'G1') {
          this.getListSppSpcPolG1();
        } else if (this.userfor === 'G2') {
          this.getListSppSpcPolG2();
        }
        // Thực hiện load lại trang khi tạo mới hồ sơ giao nhận ở giai đoạn G1
        if (!data.isEdit && this.userfor === 'G1') {
          this.getListRegister();
          // window.location.reload();
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

  closePopupSppSpcPol(): void {
    this.isShowPopupSppSpcPol = false;
    this.isShowPopupSppSpcPolDisable = false;
  }

  reloadForm(sppCase) {
    this.sppCase = sppCase;
    if (this.sppCase) {
      this.getListCaseLaw();
      this.getListRegister();
      this.selectedSpp = WebUtilities.getLoggedSpp();
    }
  }

  /*Victim*/
  getListVictim(): void {
    this.lstVictim = [];
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      csppid: this.userInfo.sppid,
      usefor: this.userfor,
      regicode: this.selectedRegister ? this.selectedRegister.regicode : null
    };
    this.generalService.getListVictim(filter).subscribe(res => {
      this.lstVictim = res;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  showPopupVictim(data): void {
    this.isShowPopupVictim = true;
    if (data) {
      // -> lowercase field
      this.selectedVictim = data;
      this.selectedVictim = Object.assign({}, data);
      this.selectedVictim.isEdit = true;
    } else {
      this.selectedVictim = {};
      this.selectedVictim.isEdit = false;
    }
  }

  showPopupVictimDisable(data): void {
    this.isShowPopupVictimDisable = true;
    if (data) {
      // -> lowercase field
      this.selectedVictim = data;
      this.selectedVictim.isEdit = true;
    } else {
      this.selectedVictim = {};
      this.selectedVictim.isEdit = false;
    }
  }

  deleteVictim(code): void {
    const savedItem = {
      id: code
    };
    this.generalService.deleteVictim(savedItem).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa bị hại thành công');
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

  submitVictim(data): void {
    if (this.selectedRegister) {
      data.regicode = this.selectedRegister.regicode;
      data.casecode = this.sppCase.CASECODE;
      const savedItem = {
        id: data.id,
        damaCode: data.damaCode,
        fullName: data.fullName,
        otherName: data.otherName,
        bYear: data.byear,
        bMonth: data.bmonth,
        bDate: this.sppCase.bdate,
        birthDay: data.birthDay,
        counId: data.counId,
        natiId: data.natiId,
        sex: data.sex,
        religion: data.religion,
        identify: data.identify,
        levelId: data.levelId,
        locaId: data.locaId,
        locaName: data.locaName,
        address: data.address,
        addrName: data.addrName,
        occuId: data.occuId,
        officeId: data.officeId,
        partyId: data.partyId,
        conviction: data.conviction,
        offence: data.offence,
        isDisabled: data.isDisabled,
        isWanderer: data.isWanderer,
        relationshipWithTheAccused: data.relationshipWithTheAccused,
        isPregnant: data.isPregnant,
        isSuicide: data.isSuicide,
        caseCode: data.casecode,
        regiCode: data.regicode
      };
      this.generalService.saveSppVictim(savedItem).subscribe(res => {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật bị hại thành công');
        this.findBySppDamagedIdCaseCode();
      }, error => {
        if (error.error && error.error.text) {
          this.notificationService.showNotification(Constant.ERROR, error.error.text);
        } else {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
        }
      });
    }
  }

  closePopupVictim(): void {
    this.isShowPopupVictim = false;
  }

  submitVictimDisable = (data) => null;

  closePopupVictimDisable(): void {
    this.isShowPopupVictimDisable = false;
  }

  showPopupLegalDisabled(data): void {
    this.isShowPopupAccuLegalDisable = true;
    this.selectedAccuLegal = WebUtilities.toLowercaseFields(data);
    this.selectedAccuLegal.isEdit = true;
  }

  showPopupDisabled(data): void {
    this.isShowPopupAccuDisable = true;
    this.selectedAccu = WebUtilities.toLowercaseFields(data);
    this.selectedAccu.isEdit = true;
    this.selectedAccu.firstacc = this.selectedAccu.firstacc === true ? 'Y' : 'N';
  }

  /*CENTENSE G3 - Bản án*/
  async getListCentence() {
    this.lstCenG1 = [];
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      sppid: this.userInfo.sppid,
      userfor: this.userfor,
      regicode: this.selectedRegister.regicode
    };
    this.generalService.getListCentence(filter).subscribe(res => {
      if (res) {
        this.lstCentence = res;
      } else {
        this.lstCentence = [];
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  showCentApped(data): void {
    this.isShowPopupCentApped = true;
  }

  closeCentApped(status): void {
    this.isShowPopupCentApped = false;
  }

  showPopupCentence(data): void {
    this.isShowPopupCentence = true;
    if (data) {
      // -> lowercase field
      this.selectedCentence = WebUtilities.toLowercaseFields(data);
      this.selectedCentence.movement = this.selectedCentence.movement === true ? "Y" : "N"
      this.selectedCentence.isEdit = true;
    } else {
      this.selectedCentence = {movement: 'N'};
      this.selectedCentence.isEdit = false;
    }
  }

  showPopupCentenceDisable(data): void {
    this.isShowPopupCentence = true;
    this.isShowPopupCentenceDisable = true;
    this.selectedCentence = WebUtilities.toLowercaseFields(data);
    this.selectedCentence.movement = this.selectedCentence.movement === true ? "Y" : "N"
    this.selectedCentence.isEdit = true;
  }

  deleteCentence(item): void {
    const deleteItem = {
      centence: item,
      sppId: this.userInfo.sppid,
      regicode: this.selectedRegister.regicode,
      userId: this.userInfo.userid,
      action: 'D'
    };
    this.generalService.deleteUpdateInfoCentenceG1(deleteItem).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, res);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa bản án thành công');
        this.getListRegister();
      }

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

  submitCentence(data): void {
    this.getListRegister();
  }

  closePopupCentence(status): void {
    this.isShowPopupCentence = false;
    this.isShowPopupCentenceDisable = false;
  }

  /*APPEAL G3 - Kháng cáo*/
  async getListAppeal() {
    this.lstAppeal = [];
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      sppid: this.userInfo.sppid,
      userfor: this.userfor,
      regicode: this.selectedRegister.regicode,
    };
    this.generalService.getListAppealByRegiCode(filter).subscribe(res => {
      if (res) {
        this.lstAppeal = res;
      } else {
        this.lstAppeal = [];
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  showPopupAppealCopy(data): void {
    this.isShowPopupAppeal = true;
    if (data) {
      // -> lowercase field
      this.selectedAppeal = WebUtilities.toLowercaseFields(data);
      this.selectedAppeal.appecode = null;
      this.selectedAppeal.arrAppealid = null;
      this.selectedAppeal.perapp = null;
      this.selectedAppeal.accucode = null;
      this.selectedAppeal.isEdit = false;
      this.selectedAppeal.logedSppName = this.selectedSpp.name;
    }
  }

  showPopupAppeal(data): void {
    this.isShowPopupAppeal = true;
    if (data) {
      // -> lowercase field
      this.selectedAppeal = WebUtilities.toLowercaseFields(data);
      this.selectedAppeal.isEdit = true;
      this.selectedAppeal.logedSppName = this.selectedSpp.name;
    } else {
      this.selectedAppeal = {
        acctype: 'A',
        appeafor: 'C',
        logedSppName: this.selectedSpp.name,
        casecode: this.sppCase.CASECODE,
        casename: this.sppCase.CASENAME
      };
      this.selectedAppeal.isEdit = false;
    }
  }

  showPopupAppealDisable(data): void {
    this.isShowPopupAppealDisable = true;
    this.selectedAppeal = WebUtilities.toLowercaseFields(data);
    this.selectedAppeal.logedSppName = this.selectedSpp.name;
    this.selectedAppeal.isEdit = true;
  }

  deleteAppeal(item): void {
    /*const deleteItem = {
      centence: item,
      sppId: this.userInfo.sppid,
      regicode: this.selectedRegister.regicode,
      userId: this.userInfo.userid,
      action: 'D'
    };*/
    this.generalService.deleteAppeal(item.APPECODE).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, res);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa kháng cáo thành công');
        this.getListAppeal();
      }
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

  submitAppeal(data): void {
    if (this.selectedRegister) {
      if (!data.isEdit) {
        data.userforname = this.generalService.toUserForName(this.userfor);
        data.userfor = this.userfor;
        data.regicode = this.selectedRegister.regicode;
      }
      data.sppid = this.userInfo.sppid;
      data.casecode = this.sppCase.CASECODE;
      const savedItem = {
        action: 'I',
        sppid: this.userInfo.sppid,
        /*regicode: data.regicode,*/
        /*userId: this.userInfo.userid,*/
        /*userfor: data.userfor,*/
        /*beginOffice: this.sppCase.BEGIN_OFFICE,
        beginOfficeId: this.sppCase.BEGIN_OFFICEID,*/
        sppAppeal: data
      };
      let actionText = 'Thêm mới';
      if (data.isEdit) {
        savedItem.action = 'U';
        actionText = 'Cập nhật';
      } else {
        savedItem.action = 'I';
      }
      this.generalService.saveAppeal(savedItem).subscribe(res => {
        this.cenLoading = false;
        if (res.result) {
          let msg = this.generalService.readPropertiesJava(res.result);
          if (res.result === 'Ngày ra bản cáo trạng nhỏ hơn ngày hiệu lực kết luận điều tra') {
            msg = 'Ngày ra bản cáo trạng phải lớn hơn hoặc bằng ngày hiệu lực kết luận điều tra';
          } else if (res.result === 'Ngày giao nhận trước ngày giao nhận gần nhất') {
            msg = 'Ngày giao nhận phải lớn hơn hoặc bằng ngày giao nhận gần nhất';
          } else if (!msg) {
            msg = res.result;
          }
          this.notificationService.showNotification(Constant.ERROR, msg);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, actionText + ' kháng cáo thành công');
          this.getListAppeal();
          this.isShowPopupAppeal = false;
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

  closePopupAppeal(status): void {
    this.isShowPopupAppeal = false;
    this.isShowPopupAppealDisable = false;
    if (status) {
      this.getListRegister();
    }
  }

  /*AGAINST G3 - Kháng nghị*/
  async getListAgainst() {
    this.lstAgainst = [];
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      sppid: this.userInfo.sppid,
      userfor: this.userfor,
      regicode: this.selectedRegister.regicode,
    };
    this.generalService.getListAgainstByRegiCode(filter).subscribe(res => {
      if (res) {
        this.lstAgainst = res;
      } else {
        this.lstAgainst = [];
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  showPopupAgainst(data): void {
    this.isShowPopupAgainst = true;
    if (data) {
      // -> lowercase field
      this.selectedAgainst = WebUtilities.toLowercaseFields(data);
      this.selectedAgainst.isEdit = true;
      this.selectedAgainst.gd_tt = this.selectedAgainst.gd_tt ? this.selectedAgainst.gd_tt : 'PT';
      this.selectedAgainst.logedSppName = this.selectedAgainst?.sppname
    } else {
      this.selectedAgainst = {
        /*acctype: 'A',
        appeafor: 'C',*/
        agafor: 'C',
        sppspc: 'SPP',
        agalevel: 'CT',
        logedSppName: this.selectedSpp.name,
        casecode: this.sppCase.CASECODE,
        casename: this.sppCase.CASENAME
      };
      this.selectedAgainst.isEdit = false;
      if (this.userfor === 'G3') {
        this.selectedAgainst.gd_tt = 'PT';
      } else {
        this.selectedAgainst.gd_tt = 'GD';
      }
    }
  }

  showPopupAgainstCopy(data): void {
    this.isShowPopupAgainst = true;
    if (data) {
      // -> lowercase field
      this.selectedAgainst = WebUtilities.toLowercaseFields(data);
      this.selectedAgainst.againstcode = null;
      this.selectedAgainst.accucode = null;
      this.selectedAgainst.gd_tt = this.selectedAgainst.gd_tt ? this.selectedAgainst.gd_tt : 'PT';
      this.selectedAgainst.logedSppName = this.selectedAgainst?.sppname
    }
  }

  showPopupAgainstDisable(data): void {
    this.isShowPopupAgainstDisable = true;
    this.selectedAgainst = WebUtilities.toLowercaseFields(data);
    this.selectedAgainst.isEdit = true;
    this.selectedAgainst.logedSppName = this.selectedAgainst?.sppname
  }

  deleteAgainst(item): void {
    const deleteItem = {
      sppAgainst: item,
      sppid: this.userInfo.sppid
    };
    this.generalService.deleteAgainst(deleteItem).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, res);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa kháng nghị thành công');
        this.getListAgainst();
      }

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

  submitAgainst(data): void {
    if (this.selectedRegister) {
      if (!data.isEdit) {
        data.userforname = this.generalService.toUserForName(this.userfor);
        data.userfor = this.userfor;
        data.regicode = this.selectedRegister.regicode;
      }
      data.sppid = this.userInfo.sppid;
      data.casecode = this.sppCase.CASECODE;
      const savedItem = {
        action: 'I',
        sppid: this.userInfo.sppid,
        sppAgainst: this.handldeForAgainst(data)
      };
      let actionText = 'Thêm mới';
      if (data.isEdit) {
        savedItem.action = 'U';
        actionText = 'Cập nhật';
      } else {
        savedItem.action = 'I';
      }
      this.generalService.saveAgainst(savedItem).subscribe(res => {
        this.cenLoading = false;
        if (res.result) {
          this.notificationService.showNotification(Constant.ERROR, this.generalService.readPropertiesJava(res.result));
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, actionText + ' kháng nghị thành công');
          this.getListAgainst();
          this.isShowPopupAgainst = false;
        }
      }, error => {
        if (error.error && error.error.text) {
          this.notificationService.showNotification(Constant.ERROR, this.generalService.readPropertiesJava(error.error.text));
        } else {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
        }
      });
    }
  }

  handldeForAgainst(data): any {
    if (data.gd_tt === 'TT' || data.gd_tt === 'GD') {
      data.userfor = 'G5';
    } else {
      data.userfor = 'G4';
      data.gd_tt = null;
    }
    return data;
  }

  closePopupAgainst(status): void {
    this.isShowPopupAgainst = false;
    this.isShowPopupAgainstDisable = false;
    if (status) {
      this.getListRegister();
    }
  }

  // isCheckButtonG3(){
  //   // check nút thêm mới bản án
  //   if (this.userfor === 'G3') {
  //     this.isCheckCentence();
  //   }else{
  //     this.isCheckDecision = false;
  //   }
  //   // check nút thêm mới kháng cáo và kháng nghị
  //   this.isCheckAppeal();
  // }

  // isCheckCentence(){
  //   if (this.lstDecisionCase.length !== 0)
  //     this.isCheckDecision = !this.lstDecisionCase.some(e => e.DECITYPEID === 'XX');
  //   else
  //     this.isCheckDecision = true;
  // }

  // isCheckAppeal(){
  //   this.categoriesService.getIsCheckTransDate(this.selectedRegister.regicode).subscribe(res => {
  //     let length = res.length;
  //     if(length != 0)
  //       this.isCheckTransDate = this.userInfo.sppid != res[length-1].SPPIDF
  //     else
  //       this.isCheckTransDate = false;
  //     }, error => {
  //       this.isCheckTransDate = false;
  //   });

  //   this.categoriesService.getIsCheckAgainst(this.selectedRegister.regicode).subscribe(res => {
  //     this.isCheckInsert = parseInt(res) === 0;
  //     }, error => {
  //     this.isCheckInsert = true;
  //   });
  // }

  reloadSppCase(casecode) {
    this.generalService.getSppByCode(casecode).subscribe(resSpp => {
      this.sppService.setCurrentSppCase(resSpp[0]);
      this.sppCase = resSpp[0];
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  loadPageAccu($event: any) {
    this.getListAccu();
    this.getListCaseLaw();
    this.reloadSppCase(this.sppCase.CASECODE);
  }

  deleteCaseLaw(data) {
    if (data) {
      const payload = {
        action: 'D',
        lawCode: data.LAWCODE,
        sppCase: this.sppCase,
        userfor: this.userfor,
        sppId: WebUtilities.getLoggedSppId()
      };
      this.generalService.deleteCaseLaw(payload).subscribe(res => {
        this.getListCaseLaw();
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa điều luật thành công');
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, error.error.text);
      });
    }
  }

  async getListInfoAcc() {
    this.lstInfoAccu = [];
    const filter = {
      casecode: this.sppCase.CASECODE,
      sortOrder: 'ASC',
      sppid: this.sppCase.BEGIN_OFFICEID,
      userfor: 'G3'
    };

    // lấy kháng cáo ở G3
    const appealLst = await this.generalService.getListAppealByCasecode(filter).toPromise().then();

    // lấy kháng nghị ở G3
    const againstLst = await this.generalService.getListAgainstByCasecode(filter).toPromise().then();

    // thêm bị can đã kháng cáo/kháng nghị ở giai đoạn G3 vào bị can của kháng nghị ở giai đoạn G4/G5
    of(...appealLst, ...againstLst)
      .pipe(distinct((p) => p.ACCUCODE))
      .subscribe(res => this.lstInfoAccu = [...this.lstInfoAccu, {...res, FULLNAME: res?.ACCUNAME}]);
  }

  goToRollBack() {
    let url = "/truy-to/G1";
    switch (this.userfor) {
      case 'G1':
      case 'G2':
        url = "truy-to/G1";
        break;
      case 'G3':
        url = "so-tham/G3";
        break;
      case 'G4':
        url = "phuc-tham/G4";
        break;
      case 'G5' :
        url = "giam-doc-tham/G5";
        break;
      default:
        break;
    }
    return this.router.navigate([`admin/quanlyan/search/${url}`])
  }

  /*REPORT - BÁO CÁO ĐỀ NGHỊ VKSND TC KHÁNG NGHỊ GĐT,TT */
  async getListReport() {
    const filter = {
      casecode: this.sppCase.CASECODE,
      regicode: this.selectedRegister.regicode
    };
    this.generalService.getListReportAppeal(filter).subscribe(res => {
      if (res) {
        this.lstReportAppeal = res;
      } else {
        this.lstReportAppeal = [];
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  showPopupReport(data): void {
    this.isShowPopupReportAppeal = true;
    if (data) {
      // -> lowercase field
      this.selectedReportAppeal = WebUtilities.toLowercaseFields(data);
      this.selectedReportAppeal.isEdit = true;
    } else {
      this.selectedReportAppeal = {};
      this.selectedReportAppeal.isEdit = false;
    }
  }

  showPopupReportDisable(data): void {
    this.isShowPopupReportAppeal = true;
    this.isShowPopupReportAppealDisable = true;
    this.selectedReportAppeal = WebUtilities.toLowercaseFields(data);
    this.selectedReportAppeal.isEdit = true;
  }

  deleteReport(id): void {
    this.generalService.deleteReportAppeal(id).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, res);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa báo cáo đề nghị thành công');
        this.getListReport();
      }

      // alert(res.length);
    }, error => {
      if (error) {
        this.notificationService.showNotification(Constant.ERROR, error);
      } else {
        this.getListReport();
      }
    });
  }

  submitReport(data): void {
    this.getListReport();
  }

  closePopupReport(status): void {
    this.isShowPopupReportAppeal = false;
    this.isShowPopupReportAppealDisable = false;
  }

  /*END REPOR*/

  /*AGAINST-RESULT*/
  showPopupAgainstResult(data): void {
    this.isShowPopupAgainstResult = true;
  }

  closePopupAgainstResult(status): void {
    this.isShowPopupAgainstResult = false;
  }

  submitAgainstResult(data): void {
    if (this.selectedRegister) {
      if (!data.isEdit) {
        data.userforname = this.generalService.toUserForName(this.userfor);
        data.userfor = this.userfor;
        data.regicode = this.selectedRegister.regicode;
      }
      data.sppid = this.userInfo.sppid;
      data.casecode = this.sppCase.CASECODE;
      const savedItem = {
        action: 'U',
        sppid: this.userInfo.sppid,
        sppAgainst: this.handldeForAgainst(data)
      };
      const actionText = 'Cập nhật';
      this.generalService.saveAgainstResult(savedItem).subscribe(res => {
        this.cenLoading = false;
        if (res.result) {
          this.notificationService.showNotification(Constant.ERROR, this.generalService.readPropertiesJava(res.result));
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, actionText + ' kháng nghị thành công');
          this.getListAgainst();
          this.isShowPopupAgainst = false;
        }
      }, error => {
        if (error.error && error.error.text) {
          this.notificationService.showNotification(Constant.ERROR, this.generalService.readPropertiesJava(error.error.text));
        } else {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi dữ liệu');
        }
      });
    }
  }

  /*END-AGAINST-RESULT*/
}
