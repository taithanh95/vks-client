import {Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NotificationService} from '../../../service/notification.service';
import {ComponentMode, Constant} from '../../../shared/constants/constant.class';
import {FormBuilder} from '@angular/forms';
import {CategoriesService} from '../../../service/categories.service';
import {WebUtilities} from '../../../shared/utils/qla-utils.class';
import {GeneralService} from '../../../service/general-service';
import {ApParamModel} from '../../../model/ap-param.model';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {ConstantService} from '../../../service/constant.service';
import {ResponseBody} from '../../so-thu-ly/model/response-body';
import {DateService} from '../../../common/util/date.service';
import {DateChangeService} from '../../../service/date-change.service';


@Component({
  selector: 'app-spp-update',
  templateUrl: './spp-update.component.html',
  styleUrls: ['./spp-update.component.scss']
})
export class SppUpdateComponent implements OnInit, OnChanges {
  @Input() isVisibleAdd: boolean;
  @Input() sppCase: any;
  @Input() insertLoading: boolean;
  @Input() userfor: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Output() reloadSpp: EventEmitter<any> = new EventEmitter();
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;
  begin_office: any;
  arrCollapse: any[];
  acLstLocations: any[];
  atxLaws: any[];
  lstPolices: any[];
  lstArmies: any[];
  lstCustoms: any[];
  lstRangers: any[];
  lstBorderGuards: any[];
  lstSpps: any[];
  lstSpcs: any[];

  selectedSpp: any;
  isSubmited: boolean;
  data: any;

  lstUpdateLaw: any[];
  filterLaw: any;
  lstCode: any[];

  atxResultLaws: any[];
  resultLaw: any;

  /*dialog law*/
  isVisibleStatic: boolean;
  isVisibleExhibit: boolean;
  isVisibleHeroin: boolean;
  isVisibleDenun: boolean;
  isVisibleInvestigativeActivities: boolean;
  isVisibleCaseLaw: boolean;
  selectedLaw: any;

  /*Denun*/
  loadingDenun: boolean;
  denuns: any[];
  investigationActivityType: any[];
  denouncementProcessType: any[];
  activities: any[];
  loadingActivity: boolean;
  mode: ComponentMode = ComponentMode.CREATE;
  procurators: any[];
  modeEnum = ComponentMode;
  indexForEdit: number;
  invesForEdit: any;
  lstDeleteActivities: any[];

  constructor(
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private modalService: NzModalService,
    private constantService: ConstantService,
    private dateService: DateService,
    private datechangeService: DateChangeService
  ) {
    this.initForm();
  }

  initForm() {
    this.filterLaw = {};
    this.data = {
      begin_setnum: null,
      begin_indate: null,
      begin_office: '02',
      atxLaw: null,
      autolaw: false,
      atxPol: null,
      atxArmy: null,
      atxCustoms: null,
      atxRanger: null,
      atxBorderGuards: null,
      atxSpp: null,
      atxSpc: null,

      vks_y_c_khoi_to: false,
      casecode: null,
      casename: null,
      spccasecode: null,
      casetype: 'L0',
      crimdate: null,

      // Thang nam gio
      cmonth: null,
      cyear: null,
      crimtime: null,

      // Noi xay ra
      atxLocation: [null],
      crimwhere1: null,

      remark: null,
      address: null,

      ghihinh: false,
      dienthoai: false,
      dientu: false,

      // Number
      kham_nghiem_hien_truong: 0,
      nhan_dang: 0,
      kham_nghiem_tu_thi: 0,
      kham_xet: 0,
      nhan_biet_giong_noi: 0,
      thuc_nghiem_dieu_tra: 0,
      doi_chat: 0,
      kham_nghiem_hien_truong_ko: 0,
      nhan_dang_ko: 0,
      kham_nghiem_tu_thi_ko: 0,
      kham_xet_ko: 0,
      nhan_biet_giong_noi_ko: 0,
      thuc_nghiem_dieu_tra_ko: 0,
      doi_chat_ko: 0,
      tt_hoi_cung: 0,
      tt_lk_nbd_ds: 0,
      tg_hoi_cung: 0,
      tt_lk_bb_tg: 0,
      tt_lk_nlc: 0,
      tt_lk_nbh: 0,
      tg_lk: 0,
      denouncementid: null
    };
    this.begin_office = '02';

  }

  showConfirmSave(data): void {
    this.confirmModalRef = this.modalService.create({
      nzTitle: this.confirmHeaderTemplate,
      nzContent: this.confirmTemplate,
      nzClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: 'Có', onClick: () => {
            this.lawChange(data);
            this.confirmModalRef.close();
          }
        },
        {
          label: 'Không', onClick: () => {
            this.confirmModalRef.close();
          }
        }
      ]
    });
  }

  coquanChange($event: any) {
    this.begin_office = $event;
    switch (this.begin_office) {
      case '02':
        this.bindAutoComplete(this.selectedSpp.polid);
        break;
      case 'SPP':
        this.bindAutoComplete(this.selectedSpp.sppid);
        break;
      case 'SPC':
        this.bindAutoComplete(this.selectedSpp.spcid);
        break;
    }
  }

  toLawOption(l) {
    return `${l.lawid == null ? '' : 'Điều ' + l.lawid}${l.item == null || l.item === 0 ? '' : (' - Khoản ' + l.item)}${l.point == null ? '' : (' - Điểm ' + l.point)}${l.lawid == null ? '' : ' - ' + l.lawname}`;
  }

  ngOnInit(): void {
    if (localStorage.getItem(Constant.USER_INFO) === null
      || localStorage.getItem(Constant.USERID) !== this.cookieService.get(Constant.USERNAME)) {
      localStorage.clear();
      this.router.navigate(['login'], {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
    }
    this.arrCollapse = [true, true, true, true, true, true, true];
    this.selectedSpp = WebUtilities.getLoggedSpp();
    this.isSubmited = false;
    this.denuns = [];
    this.activities = [];
    this.lstDeleteActivities = [];

    this.getDomainValueList({code: Constant.INVESTIGATION_ACTIVITY_TYPE}, 'investigationActivityType');
    this.getDomainValueList({code: Constant.DENOUNCEMENT_PROCESS_TYPE}, 'denouncementProcessType');
    this.categoriesService.getListInspector().subscribe(next => {
      this.procurators = next;
    }, error => {
      console.error(error);
    });
  }

  getDomainValueList(code, list) {
    this.constantService.postRequest(
      this.constantService.SOTHULY_URL + 'dm/ApParam/getParams', code).toPromise().then(resp => resp.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this[list] = resp.responseData as ApParamModel[];
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }).catch(err => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không phản hồi. ' + err.message));
  }

  ngOnChanges(): void {
    this.isSubmited = false;
    this.selectedLaw = null;
    this.insertLoading = false;
    if (this.sppCase && this.isVisibleAdd && this.sppCase.isedit === true) {
      this.loadEditData();
      this.getListDenun(this.data.denouncementid);
      this.getListActivities();
    } else if (this.isVisibleAdd) {
      this.begin_office = '02';
      this.selectedSpp = WebUtilities.getLoggedSpp();
      if (this.selectedSpp) {
        this.bindAutoComplete(this.selectedSpp.polid);
        this.categoriesService.getLocationById(this.selectedSpp.locaid).subscribe(res => {
          res = WebUtilities.toUppercaseFields(res);
          this.acLstLocations = [res]
          setTimeout(() => {
            this.data.atxLocation = res;
          }, 10);
        });
      }
    }
  }

  loadEditData() {
    this.validateForm();
    const crimDate = new Date(this.sppCase.crimdate);
    const crimtime = crimDate.getHours() + ':' + crimDate.getMinutes();
    this.begin_office = this.sppCase.begin_office;

    this.data = {
      begin_setnum: this.sppCase.begin_setnum,
      begin_indate: this.sppCase.begin_indate,
      begin_office: this.sppCase.begin_office,
      atxLaw: this.sppCase.atxLaw,
      autolaw: this.sppCase.autolaw,
      atxPol: this.sppCase.atxPol,
      vks_y_c_khoi_to: this.sppCase.vks_y_c_khoi_to === 'Y' ? true : false,
      casecode: this.sppCase.casecode,
      casename: this.sppCase.casename,
      spccasecode: this.sppCase.spccasecode,
      casetype: this.sppCase.casetype,
      crimdate: this.sppCase.crimdate,

      // Thang nam gio
      cmonth: this.sppCase.crimdate ? crimDate.getMonth() + 1 : null,
      cyear: this.sppCase.crimdate ? crimDate.getFullYear() : null,
      crimtime: this.sppCase.crimtime,

      // Noi xay ra
      //atxLocation: this.acLstLocations[0],
      crimwhere1: this.sppCase.crimwhere1,

      remark: this.sppCase.remark,
      address: this.sppCase.address,

      ghihinh: this.sppCase.ghihinh === 'Y' ? true : false,
      dienthoai: this.sppCase.dienthoai === 'Y' ? true : false,
      dientu: this.sppCase.dientu === 'Y' ? true : false,

      // Number
      kham_nghiem_hien_truong: +this.sppCase.kham_nghiem_hien_truong,
      nhan_dang: +this.sppCase.nhan_dang,
      kham_nghiem_tu_thi: +this.sppCase.kham_nghiem_tu_thi,
      kham_xet: +this.sppCase.kham_xet,
      nhan_biet_giong_noi: +this.sppCase.nhan_biet_giong_noi,
      thuc_nghiem_dieu_tra: +this.sppCase.thuc_nghiem_dieu_tra,
      doi_chat: +this.sppCase.doi_chat,
      kham_nghiem_hien_truong_ko: +this.sppCase.kham_nghiem_hien_truong_ko,
      nhan_dang_ko: +this.sppCase.nhan_dang_ko,
      kham_nghiem_tu_thi_ko: +this.sppCase.kham_nghiem_tu_thi_ko,
      kham_xet_ko: +this.sppCase.kham_xet_ko,
      nhan_biet_giong_noi_ko: +this.sppCase.nhan_biet_giong_noi_ko,
      thuc_nghiem_dieu_tra_ko: +this.sppCase.thuc_nghiem_dieu_tra_ko,
      doi_chat_ko: +this.sppCase.doi_chat_ko,
      tt_hoi_cung: +this.sppCase.tt_hoi_cung,
      tt_lk_nbd_ds: +this.sppCase.tt_lk_nbd_ds,
      tg_hoi_cung: +this.sppCase.tg_hoi_cung,
      tt_lk_bb_tg: +this.sppCase.tt_lk_bb_tg,
      tt_lk_nlc: +this.sppCase.tt_lk_nlc,
      tt_lk_nbh: +this.sppCase.tt_lk_nbh,
      tg_lk: +this.sppCase.tg_lk,
      denouncementid: this.sppCase?.denouncement_id
    };
    if (this.sppCase.crimwhere) {
      this.categoriesService.getLocationById(this.sppCase.crimwhere).subscribe(res => {
        res = WebUtilities.toUppercaseFields(res)
        this.acLstLocations = [res];
        setTimeout(() => {
          this.data.atxLocation = res;
        }, 10);
      });
    }
    this.bindAutoComplete(this.sppCase.begin_officeid);
    // bind law
    if (this.sppCase.lawcode) {
      this.categoriesService.getListLawAutoCompleteWithoutType(this.sppCase.lawcode).subscribe(res => {
        this.atxLaws = res;
        setTimeout(() => {
          const item0 = this.atxLaws.find(en => en.lawcode === this.sppCase.lawcode);
          // this.sppCaseForm.controls['atxLaw'].setValue(item0);
          this.data.atxLaw = item0;
        }, 100);
      });
    }
    //bind list law
    this.bindCaseLaw();
    this.categoriesService.getListCode(' ').subscribe(res => {
      this.lstCode = res;
      this.filterLaw.code = res[0].CODEID;
    });
  }

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  bindAutoComplete(begin_officeid: any) {
    switch (this.begin_office) {
      case '02':
        this.categoriesService.getListPolice(begin_officeid).subscribe(res => {
          this.lstPolices = res;
          setTimeout(() => {
            const item0 = this.lstPolices.find(en => en.POLICEID === begin_officeid);
            // this.sppCaseForm.controls['atxPol'].setValue(item0);
            this.data.atxPol = item0;
          }, 10);
        });
        break;
      case '04':
        this.categoriesService.getListArmy(begin_officeid).subscribe(res => {
          this.lstArmies = res;
          setTimeout(() => {
            const item0 = this.lstArmies.find(en => en.ARMYID === begin_officeid);
            // this.sppCaseForm.controls['atxArmy'].setValue(item0);
            this.data.atxArmy = item0;
          }, 10);
        });
        break;
      case '06':
        this.categoriesService.getListCustoms(begin_officeid).subscribe(res => {
          this.lstCustoms = res;
          setTimeout(() => {
            const item0 = this.lstCustoms.find(en => en.CUSTOMID === begin_officeid);
            // this.sppCaseForm.controls['atxCustoms'].setValue(item0);
            this.data.atxCustoms = item0;
          }, 10);
        });
        break;
      case '08':
        this.categoriesService.getListRangers(begin_officeid).subscribe(res => {
          this.lstRangers = res;
          //this.atxRanger = res[0];
          setTimeout(() => {
            const item0 = this.lstRangers.find(en => en.RANGID === begin_officeid);
            // this.sppCaseForm.controls['atxRanger'].setValue(item0);
            this.data.atxRanger = item0;
          }, 10);
        });
        break;
      case '09':
        this.categoriesService.getListBorderGuards(begin_officeid).subscribe(res => {
          this.lstBorderGuards = res;
          //this.atxBorderGuards = res[0];
          setTimeout(() => {
            const item0 = this.lstBorderGuards.find(en => en.BORGUAID === begin_officeid);
            // this.sppCaseForm.controls['atxBorderGuards'].setValue(item0);
            this.data.atxBorderGuards = item0;
          }, 10);
        });
        break;
      case 'SPP':
        this.categoriesService.getListVKS(begin_officeid).subscribe(res => {
          this.lstSpps = res;
          //this.data.atxSpp = res[0];
          setTimeout(() => {
            const item0 = this.lstSpps.find(en => en.sppid === begin_officeid);
            // this.sppCaseForm.controls['atxSpp'].setValue(item0);
            this.data.atxSpp = item0;
          }, 10);
        });
        break;
      case 'SPC':
        this.categoriesService.getListToaAn(begin_officeid).subscribe(res => {
          this.lstSpcs = res;
          //this.data.atxSpc = res[0];
          setTimeout(() => {
            const item0 = this.lstSpcs.find(en => en.SPCID === begin_officeid);
            // this.sppCaseForm.controls['atxSpc'].setValue(item0);
            this.data.atxSpc = item0;
          }, 10);
        });
        break;
    }
  }

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpps = [];
    } else {
      this.categoriesService.getListVKS(value).subscribe(res => {
        this.lstSpps = res;
      });
    }
  }

  onInputSpc(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpcs = [];
    } else {
      this.categoriesService.getListToaAn(value).subscribe(res => {
        this.lstSpcs = res;
      });
    }
  }

  onInputCustoms(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstArmies = [];
    } else {
      this.categoriesService.getListCustoms(value).subscribe(res => {
        this.lstCustoms = res;
      });
    }
  }

  onInputRangers(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstArmies = [];
    } else {
      this.categoriesService.getListRangers(value).subscribe(res => {
        this.lstRangers = res;
      });
    }
  }

  onInputBorderGuards(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstArmies = [];
    } else {
      this.categoriesService.getListBorderGuards(value).subscribe(res => {
        this.lstBorderGuards = res;
      });
    }
  }

  onInputAtxLaw(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.atxLaws = [];
    } else {
      if (value === ' ') {
        value = '0';
      }
      this.categoriesService.getListLawAutoCompleteWithoutType(value).subscribe(res => {
        this.atxLaws = res;
      });
    }
  }

  onInputAtxLawWithCode(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.atxResultLaws = [];
    } else {
      if (value === ' ') {
        value = '0';
      }
      this.categoriesService.getListLawAutoComplete(value, this.filterLaw.code).subscribe(res => {
        this.atxResultLaws = res;
      });
    }
  }

  validateForm() {
    /*for (const key in this.sppCaseForm.controls) {
      this.sppCaseForm.controls[key].markAsDirty();
      this.sppCaseForm.controls[key].updateValueAndValidity();
    }*/
  }

  handleOk(): void {
    this.isSubmited = true;
    let valid = true;
    if (!this.data.begin_setnum) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Quyết định khởi tố vụ án số');
      valid = false;
    }
    if (!this.data.begin_indate) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày quyết định khởi tố vụ án');
      valid = false;
    }
    if (!this.data.atxLaw || !this.data.atxLaw.lawcode) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Điều luật vụ');
      valid = false;
    }
    if (!this.data.cyear) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Năm xảy ra vụ án');
      valid = false;
    }
    if (!this.data.casename) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên vụ án');
      valid = false;
    }
    if (!this.data.atxLocation || !this.data.atxLocation.LOCAID) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Nơi xảy ra');
      valid = false;
    }
    if (valid) {
      this.insertLoading = true;
      const lstdenun = [];
      this.denuns.forEach(n => lstdenun.push(n?.id));
      this.data.denouncementid = lstdenun?.toString();
      const savedValue = this.data;
      savedValue.lstInvestment = this.activities;
      savedValue.lstInvecode = this.lstDeleteActivities;
      if (this.sppCase && this.sppCase.isedit) {
        savedValue.casecode = this.sppCase.casecode;
        this.isVisibleAdd = false;
      }
      this.submitForm.emit(savedValue);
      this.closeModal.emit(false);
    }
  }

  handleCancel() {
    this.initForm();
    this.isVisibleAdd = false;
    this.closeModal.emit(false);
  }

  onInputLocaltion(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.acLstLocations = [];
    } else {
      this.categoriesService.getListLocation(value).subscribe(res => {
        this.acLstLocations = res;
      });
    }
  }

  onInputPolice(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstPolices = [];
    } else {
      this.categoriesService.getListPolice(value).subscribe(res => {
        this.lstPolices = res;
      });
    }
  }

  onInputArmy(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstArmies = [];
    } else {
      this.categoriesService.getListArmy(value).subscribe(res => {
        this.lstArmies = res;
      });
    }
  }

  /*compareFun = (o1: any | string, o2: any) => {
    if (o1) {
      console.log(o1,o2);
      return typeof o1 === 'string' ? o1 === o2.label : o1.value === o2.value;
    } else {
      return false;
    }
  };*/
  indateChange(event: any) {
    const indate = new Date(event);
    const currentDate = new Date();

    const dayCount = WebUtilities.calculateDiff(indate, currentDate);
    if (dayCount > 0) {
      this.notificationService.showNotification(Constant.ERROR, 'Ngày quyết định phải nhỏ hơn hoặc bằng ngày hiện tại');
      setTimeout(() => {
        this.data.begin_indate = new Date();
      }, 100);
      return;
    }
  }

  crimdateChange(event: any) {
    const begin_indate = new Date(this.data.begin_indate);
    const crimdate = new Date(event);
    if (this.data.begin_indate) {
      const dayCount = WebUtilities.calculateDiff(crimdate, begin_indate);
      if (dayCount > 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày xảy ra vụ án phải bé hơn hoặc bằng ngày quyết định khởi tố vụ án.');
        setTimeout(() => {
          // this.sppCaseForm.controls['crimdate'].setValue(null);
          this.data.crimdate = null;
        }, 100);
        return;
      } else {
        const yyyy = crimdate.getFullYear();
        const mm = crimdate.getMonth() + 1;
        /*this.sppCaseForm.controls['cmonth'].setValue(mm);
        this.sppCaseForm.controls['cyear'].setValue(yyyy);*/
        this.data.cmonth = mm;
        this.data.cyear = yyyy;
      }
    } else {
      setTimeout(() => {
        // this.sppCaseForm.controls['crimdate'].setValue(null);
        this.data.crimdate = null;
      }, 100);
    }
  }

  monthyearChange($event: any) {
    setTimeout(() => {
      const year = this.data.cyear;
      let month = this.data.cmonth;
      if (!month) {
        month = 1;
        this.data.cmonth = 1;
      }
      const crimDate = new Date(year, month - 1, 1);
      this.data.crimdate = crimDate;
    }, 10);
  }

  bindCaseLaw() {
    this.categoriesService.getLawByCasecode({casecode: this.sppCase.casecode, userfor: this.userfor}).subscribe(res => {
      this.lstUpdateLaw = res;
    });
  }

  lawChange(data: any) {
    const payload = {
      sppId: WebUtilities.getLoggedSppId(),
      sppCase: this.data,
      lstLaw: data
    };
    payload.sppCase.atxLaw = {lawcode: this.data.atxLaw.lawcode};
    this.sppCase.lawcode = data.lawcode;
    this.generalService.updateCaselawcodewithwarn(payload).subscribe(res => {
      this.reloadSpp.emit(this.data.casecode);
      this.bindCaseLaw();
      this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật thông tin thành công');
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  insertLaw($event) {
    if ((this.resultLaw && this.resultLaw.lawcode) || $event === 'D') {
      const payload = {
        action: $event,
        lawCode: $event === 'I' ? this.resultLaw.lawcode : this.selectedLaw.LAWCODE,
        sppCase: this.sppCase,
        userfor: this.userfor,
        sppId: WebUtilities.getLoggedSppId()
      };
      this.generalService.insertUpdateDeleteCaseLaw(payload).subscribe(res => {
        if (res && res.result) {
          const msg = this.generalService.readPropertiesJava(res.result);
          if (msg)
            this.notificationService.showNotification(Constant.WARNING, msg);
          else
            this.notificationService.showNotification(Constant.ERROR, res.result);
        } else {
          const msgSuc = 'Thêm điều luật thành công';
          const msgDel = 'Xóa điều luật thành công'
          this.notificationService.showNotification(Constant.SUCCESS, $event === 'I' ? msgSuc : msgDel);
        }
        this.resultLaw = null;
        this.selectedLaw = null;
        this.reloadSpp.emit(this.data.casecode);
        this.bindCaseLaw();
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, error.error.text);
      });
    } else {
      this.notificationService.showNotification(Constant.ERROR, 'Chưa nhập giá trị cho trường "Tội danh"');
    }
  }

  showStatic(data: any) {
    this.isVisibleStatic = true;
    this.selectedLaw = data;
  }

  showHeroin(data: any) {
    this.isVisibleHeroin = true;
    this.selectedLaw = data;
  }

  showExhibit(data: any) {
    this.isVisibleExhibit = true;
    this.selectedLaw = data;
  }

  closeStaticDialog($event: any) {
    this.isVisibleStatic = false;
  }

  closeExhibitDialog($event: any) {
    this.isVisibleExhibit = false;
  }

  closeHeroinDialog($event: any) {
    this.isVisibleHeroin = false;
  }

  /*Denun*/
  showPopupDenun(): void {
    this.isVisibleDenun = true;
  }

  showPopupInvestigativeActivities(mode: ComponentMode, index?: number) {
    this.mode = mode;
    switch (this.mode) {
      case ComponentMode.VIEW:
      case ComponentMode.UPDATE:
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.invesForEdit = this.activities[this.indexForEdit];
          this.isVisibleInvestigativeActivities = true;
        }
        break;
      case ComponentMode.CREATE:
        this.isVisibleInvestigativeActivities = true;
        this.invesForEdit = null;
        break;
    }
    ;
  }

  cancelDeleteActivity() {
  }

  closePopupDenun(): void {
    this.isVisibleDenun = false;
  }

  closePopupInvestigativeActivities(): void {
    this.isVisibleInvestigativeActivities = false;
  }

  submitDenun($event): void {
    const item = this.denuns.find(en => en.denouncementCode === $event.denouncementCode);
    if (!item) {
      this.getListInvestigativeActivities($event);
      this.denuns = [...this.denuns, $event];
    }
  }

  getListInvestigativeActivities(data: any) {
    if (data.id) {
      this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/detail', {id: data.id})
        .toPromise().then(resp => resp.json())
        .then((resp: ResponseBody) => {
          if (resp.responseCode === '0000') {
            const datas = resp.responseData;
            const lstInves: any[] = datas.investigationActivityList ? datas.investigationActivityList : [];
            lstInves.forEach(e => {
              const invetype_name = this.investigationActivityType.find(n => n.paramValue === e?.investigationActivityType)?.paramName;
              const inves = {
                invetype: e?.investigationActivityType,
                invetype_name: invetype_name,
                has_inspector: e.procuracyParticipated,
                reason: e?.reasonForNotParticipating,
                invedate: e.executionDate ? this.dateService.stringToDate(e.executionDate, 'DD/MM/YYYY') : null,
                investor: e?.investigator,
                insp_fullname: e?.participatedProcurator,
                inspcode: e?.participatedProcuratorId,
                identify: e?.assessment,
                content_results: e?.result,
                remark: e?.note
              };
              this.onLoadValueActivities(inves, true);
              this.activities = [...this.activities, inves];
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
          }
        });
    }
  }

  cancelDeleteDenun() {
  }

  confirmDeleteDenun(index: number) {
    this.denuns.splice(index, 1)[0];
    this.denuns = [...this.denuns];
  }

  submitInvestigativeActivities(data: any) {
    if (this.mode === ComponentMode.CREATE) {
      this.activities = [...this.activities, data];
    } else if (this.mode === ComponentMode.UPDATE) {
      this.onLoadValueActivities(this.invesForEdit, false);
      this.activities[this.indexForEdit] = data;
      this.activities = [...this.activities];
    }
    this.isVisibleInvestigativeActivities = false;
    this.onLoadValueActivities(data, true);
  }

  deleteActivity(index: number) {
    const invesForEdit = this.activities[index];
    this.activities.splice(index, 1)[0];
    this.activities = [...this.activities];
    this.onLoadValueActivities(invesForEdit, false);
    if (invesForEdit.invecode) {
      this.lstDeleteActivities = [...this.lstDeleteActivities, invesForEdit.invecode]
    }
  }

  setValueHasInspector(inspector: any, reason: any): string {
    const value = inspector ? 'Có tham gia' : !reason ? 'Không tham gia' : `Không tham gia - ${reason}`
    return value;
  }

  getListDenun(denouncementid: string) {
    this.denuns = [];
    if (denouncementid) {
      const lstdenounId = denouncementid.split(',');
      lstdenounId.forEach(n => this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/detail', {id: n})
        .toPromise().then(resp => resp.json())
        .then((resp: ResponseBody) => {
          if (resp.responseCode === '0000') {
            const fullName = [];
            const lstPerson: any[] = resp.responseData.denounceDenouncedPersonList;
            if (lstPerson.length != 0)
              lstPerson.forEach(e => {
                fullName.push(e.fullName)
              });

            const res = {
              id: resp.responseData.id,
              denouncementCode: resp.responseData.denouncementCode,
              takenOverDate: resp.responseData.takenOverDate,
              nameAccused: fullName ? fullName.toString() : '',
              settlementStatus: resp.responseData.settlementStatus,
              rreporter: resp.responseData.rreporter,
              rdelation: resp.responseData.rdelation
            }
            this.denuns = [...this.denuns, res];
          } else {
            return;
          }
        })
      );
    }
    ;
  }

  getListActivities() {
    const search = {casecode: this.data.casecode}
    this.generalService.searchInvestment(search).subscribe(res => {
      const activity: any[] = res;
      this.activities = [];
      activity.forEach(n => {
        this.activities = [...this.activities, WebUtilities.toLowercaseFields(n)]
      });
    });
  }

  onLoadValueActivities(activities: any, upd?: boolean) {
    activities.has_inspector ? this.setDataActivities(upd, activities.invetype) : this.setDataActivitiesKo(upd, activities.invetype);
  }

  setDataActivities(upd?: boolean, invetype?: any) {
    switch (invetype) {
      case "1":
        this.data.kham_nghiem_hien_truong = upd ? this.data.kham_nghiem_hien_truong + 1 : this.data.kham_nghiem_hien_truong !== 0 ? this.data.kham_nghiem_hien_truong - 1 : 0;
        break;
      case "2":
        this.data.kham_nghiem_tu_thi = upd ? this.data.kham_nghiem_tu_thi + 1 : this.data.kham_nghiem_tu_thi !== 0 ? this.data.kham_nghiem_tu_thi - 1 : 0;
        break;
      case "3":
        this.data.doi_chat = upd ? this.data.doi_chat + 1 : this.data.doi_chat !== 0 ? this.data.doi_chat - 1 : 0;
        break;
      case "4":
        this.data.nhan_dang = upd ? this.data.nhan_dang + 1 : this.data.nhan_dang !== 0 ? this.data.nhan_dang - 1 : 0;
        break;
      case "5":
        this.data.nhan_biet_giong_noi = upd ? this.data.nhan_biet_giong_noi + 1 : this.data.nhan_biet_giong_noi !== 0 ? this.data.nhan_biet_giong_noi - 1 : 0;
        break;
      case "6":
        this.data.kham_xet = upd ? this.data.kham_xet + 1 : this.data.kham_xet !== 0 ? this.data.kham_xet - 1 : 0;
        break;
      case "7":
        this.data.thuc_nghiem_dieu_tra = upd ? this.data.thuc_nghiem_dieu_tra + 1 : this.data.thuc_nghiem_dieu_tra !== 0 ? this.data.thuc_nghiem_dieu_tra - 1 : 0;
        break;
      default:
        break;
    }
  }

  setDataActivitiesKo(upd?: boolean, invetype?: any) {
    switch (invetype) {
      case "1":
        this.data.kham_nghiem_hien_truong_ko = upd ? this.data.kham_nghiem_hien_truong_ko + 1 : this.data.kham_nghiem_hien_truong_ko !== 0 ? this.data.kham_nghiem_hien_truong_ko - 1 : 0;
        break;
      case "2":
        this.data.kham_nghiem_tu_thi_ko = upd ? this.data.kham_nghiem_tu_thi_ko + 1 : this.data.kham_nghiem_tu_thi_ko !== 0 ? this.data.kham_nghiem_tu_thi_ko - 1 : 0;
        break;
      case "3":
        this.data.doi_chat_ko = upd ? this.data.doi_chat_ko + 1 : this.data.doi_chat_ko !== 0 ? this.data.doi_chat_ko - 1 : 0;
        break;
      case "4":
        this.data.nhan_dang_ko = upd ? this.data.nhan_dang_ko + 1 : this.data.nhan_dang_ko !== 0 ? this.data.nhan_dang_ko - 1 : 0;
        break;
      case "5":
        this.data.nhan_biet_giong_noi_ko = upd ? this.data.nhan_biet_giong_noi_ko + 1 : this.data.nhan_biet_giong_noi_ko !== 0 ? this.data.nhan_biet_giong_noi_ko - 1 : 0;
        break;
      case "6":
        this.data.kham_xet_ko = upd ? this.data.kham_xet_ko + 1 : this.data.kham_xet_ko !== 0 ? this.data.kham_xet - 1 : 0;
        break;
      case "7":
        this.data.thuc_nghiem_dieu_tra_ko = upd ? this.data.thuc_nghiem_dieu_tra_ko + 1 : this.data.thuc_nghiem_dieu_tra_ko !== 0 ? this.data.thuc_nghiem_dieu_tra_ko - 1 : 0;
        break;
      default:
        break;
    }
  }

  checkDisabled() {
    if (this.userfor === '1' || this.userfor === 'G1' || this.userfor === 'G2')
      return false;
    else
      return true;
  }

  onValueDate(item, event: any) {
    this.data[item] = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onRowSelect(item) {
    this.selectedLaw = item;
    for (const child of this.lstUpdateLaw) {
      child.selected = false;
    }
    item.selected = true;
  }

  cancelDialogConfirm() {
  }

  showPopupCaseLaw = () => this.isVisibleCaseLaw = true;

  onReloadCaseLaw = ($event) => {
    this.bindCaseLaw();
    this.reloadSpp.emit(this.data.casecode);
  };

  closePopupCaseLaw = ($event) => this.isVisibleCaseLaw = false;

}
