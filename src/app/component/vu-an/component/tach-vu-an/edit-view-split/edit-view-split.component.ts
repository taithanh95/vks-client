import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs/internal/observable/of';
import { CategoriesService } from '../../../../../service/categories.service';
import { DateChangeService } from '../../../../../service/date-change.service';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { SppService } from '../../../../../service/spp-service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-edit-view-split',
  templateUrl: './edit-view-split.component.html',
  styleUrls: ['./edit-view-split.component.scss']
})
export class EditViewSplitComponent implements OnInit {


  /* ITEMS */
  sppid: string;
  isSubmited: boolean;
  arrCollapse = [true, true, true, true];
  action: string;
  isTachva = false;
  userInfo: any;

  /* DATA */
  splitdate: Date | string;
  choicetype: string;
  choice: string;
  ccode: string;
  data: any;

  disabledSuccess: boolean;

  /** LIST DATA COMBOBOX */
  lstCase: any[] = [];
  sidOptions: any;
  lstLaw: any;
  LstLocation: any;

  lstHeroins: any;
  lstPols: any;
  lstPolices: any;
  lstArmies: any;
  lstCustoms: any;
  lstRangers: any;
  lstBorderGuards: any;
  lstSpps: any;
  lstSpcs: any;

  /** GRID VIEW */
  lstCaseacc: any;

  /* VISIBLE */
  isVisibleDialog: boolean;

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private datechangeService: DateChangeService,
    private sppService: SppService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private cookieService: CookieService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.sppid = WebUtilities.getLoggedSppId();
    this.lstCaseacc = this.sppService.getCurrentSppCaseSplit();
    this.choicetype = this.cookieService.get(Constant.SPP_CHOICETYPE);
  }

  onInputLoca(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.LstLocation = [];
    } else {
      this.categoriesService.getListLocation(value).subscribe(res => this.LstLocation = res ? res : [{ Locaid: 'XX', remark: 'Không xác định' }]);
    }
  }

  onInputPolice(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstPolices = [];
    } else {
      this.categoriesService.getListPolice(value).subscribe(res => this.lstPolices = res);
    }
  }

  onInputArmy(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstArmies = [];
    } else {
      this.categoriesService.getListArmy(value).subscribe(res => this.lstArmies = res);
    }
  }

  onInputCustoms(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstCustoms = [];
    } else {
      this.categoriesService.getListCustoms(value).subscribe(res => this.lstCustoms = res);
    }
  }

  onInputRangers(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstRangers = [];
    } else {
      this.categoriesService.getListRangers(value).subscribe(res => this.lstRangers = res);
    }
  }

  onInputBorderGuards(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstBorderGuards = [];
    } else {
      this.categoriesService.getListBorderGuards(value).subscribe(res => this.lstBorderGuards = res);
    }
  }

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpps = [];
    } else {
      this.categoriesService.getListVKS(value).subscribe(res => this.lstSpps = res);
    }
  }

  onInputSpc(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpcs = [];
    } else {
      this.categoriesService.getListToaAn(value).subscribe(res => this.lstSpcs = res);
    }
  }

  onInputAtxLaw(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstLaw = [];
    } else {
      if (value === ' ') {
        value = '0';
      }
      this.categoriesService.getListLawAutoCompleteWithoutType(value).subscribe(res => {
        this.lstLaw = res;
      });
    }
  }

  ngOnDestroy(): void {
    this.sppService.setCurrentSppCaseSplit(null);
    this.cookieService.delete(Constant.SPP_CHOICETYPE);
  }

  async ngOnInit() {
    this.lstCase = [];
    this.data = {};
    this.data.crimwhere = this.sppid;
    this.data.begin_office = '02';
    this.data.casetype = 'L0';
    this.choice = '1';
    this.setLstCase();
    this.getListCategories();
    this.getLocation(this.sppid);
    this.bindAutoComplete(this.sppid);
  }

  async getLocation(sppid) {
    this.categoriesService.getLocationById(sppid).subscribe(res => {
      if (res) {
        const rs = WebUtilities.toUppercaseFields(res);
        this.LstLocation = [rs];
        this.data.atxLocation = rs;
      } else {
        this.LstLocation = [];
        this.data.atxLocation = null;
      }
    }), error => this.notificationService.showNotification(Constant.ERROR, error.error.text);
  }

  setLstCase() {
    this.lstCaseacc.forEach(element => {
      this.lstCase.push({ casename: element.casename, casecode: element.casecode });
    })
  }

  toLawOption = (l) => `${l.lawid == null ? '' : 'Điều ' + l.lawid}${l.item == null || l.item === 0 ? '' : (' - Khoản ' + l.item)}${l.point == null ? '' : (' - Điểm ' + l.point)}${l.lawid == null ? '' : ' - ' + l.lawname}`;

  async handleOk() {
    this.isSubmited = false;
    let valid = false;
    if (!this.splitdate) {
      this.notificationService.showNotification(Constant.ERROR, this.msgErr('Ngày tách'))
      valid = true
    }
    if (!this.choice) {
      this.notificationService.showNotification(Constant.ERROR, this.msgErr('Loại tách BCBC'))
      valid = true
    }
    if (!this.data.begin_setnum) {
      this.notificationService.showNotification(Constant.ERROR, this.msgErr('Quyết định khởi tố vụ án số'))
      valid = true
    }
    if (!this.data.begin_indate) {
      this.notificationService.showNotification(Constant.ERROR, this.msgErr('Ngày quyết định khởi tố vụ án'))
      valid = true
    }
    const valid_begin = this.validBegin_Off(this.data.begin_office);
    if (!this.data.casename) {
      this.notificationService.showNotification(Constant.ERROR, this.msgErr('Tên vụ án'))
      valid = true
    }
    if (!this.data.atxLocation) {
      this.notificationService.showNotification(Constant.ERROR, this.msgErr('Nơi xảy ra'))
      valid = true
    }
    if (!this.data.atxLaw || !this.data.atxLaw.lawcode) {
      this.notificationService.showNotification(Constant.ERROR, this.msgErr('Điều luật vụ'))
      valid = true
    }
    if (!this.data.cyear) {
      this.notificationService.showNotification(Constant.ERROR, this.msgErr('Năm'))
      valid = true
    }
    if (!valid_begin && !valid)
      this.insertCase();
    else
      this.isSubmited = true;
  }

  msgErr = (item) => `Bạn phải nhập giá trị cho trường ${item}`;

  validBegin_Off(begin_office) {
    switch (begin_office) {
      case '02':
        if (!this.data.atxPol) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Đơn vị công an'))
          return true
        }
        break;
      case '04':
        if (!this.data.atxArmy) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Quân đội'))
          return true
        }
        break;
      case '06':
        if (!this.data.atxCustoms) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Hải quan'))
          return true
        }
        break;
      case '08':
        if (!this.data.atxRanger) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Kiểm lâm'))
          return true
        }
        break;
      case '09':
        if (!this.data.atxBorderGuards) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Bộ đội biên phòng'))
          return true
        }
        break;
      case 'SPP':
        if (!this.data.atxSpp) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Viện kiểm sát'))
          return true
        }
        break;
      case 'SPC':
        if (!this.data.atxSpc) {
          this.notificationService.showNotification(Constant.ERROR, this.msgErr('Tòa án'))
          return true
        }
        break;
      default:
        return false
    }
    return false;
  }


  async insertCase() {
    let check = false;
    for (const element of this.lstCaseacc) {
      if (this.choicetype === 'a') {
        if (moment(new Date(this.splitdate)).isBefore(moment(new Date(element.decidate)))) {
          this.splitdate = null;
          this.notificationService.showNotification(Constant.ERROR, 'Ngày tách vụ án không được trước ngày ra quyết định tách')
          break;
        } else {
          check = true;
          break;
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        check = true;
        break;
      }
    }
    if (check) {
      if (!this.data.casecode) {
        const data = this.data;
        if (!data.crimtime || data.crimtime === '') {
          data.crimtime = '00:00';
        }
        data.atxLaw = { lawcode: data.atxLaw.lawcode, lawid: data.atxLaw?.lawid };
        const payload = {
          isTachvu: this.isTachva,
          sppcase: data,
          sppId: this.sppid,
          withWarn: false,
          userId: this.userInfo.userid
        }
        this.generalService.addBanAn(payload).subscribe(async res => {
          const datas = await this.reloadSppCase(res);
          of(datas).subscribe(rs => {
            if (rs) {
              this.data = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(rs[0]);
            }
          }, err => console.log(err));
          if (this.data.casecode) {
            this.insertSplit(this.data.casecode);
          } else {
            this.notificationService.showNotification(Constant.ERROR, res)
          }
        }, err => this.notificationService.showNotification(Constant.ERROR, err.error.text))
      } else {
        this.insertSplit(this.data.casecode);
      }
    }
  }

  async insertSplit(casecode) {
    const lstPayload = [];
    this.lstCaseacc.forEach(element => {
      const newcase = {
        accucode1: element.accucode,
        casecode1: element.casecode,
        casecode2: casecode,
        splitdate: new Date(this.splitdate)
      }
      lstPayload.push(newcase);
     
    })
    const payload = {
      sppcasesplit: lstPayload,
      choiceType: this.choicetype,
      choice: this.choice
    }
    this.generalService.saveListSppSplit(payload).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới thành công')
        this.disabledSuccess = true;
        this.handleCancel();
      } else {
        this.notificationService.showNotification(Constant.ERROR, res)
      }
    }, err => this.notificationService.showNotification(Constant.ERROR, err.error.text))
  }

  async reloadSppCase(casecode) {
    return await this.generalService.getSppByCode(casecode).toPromise().then();
  }

  handleCancel() {
    this.router.navigate(['/admin/vu-an/search/tach-vu-an']);
  }

  changeValueDate($event, item) {
    this.data[item] = this.datechangeService.onDateValueChange($event);
  }

  changeValueDateSplit($event) {
    this.splitdate = this.datechangeService.onDateValueChange($event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  toggleCollapse = (i) => this.arrCollapse[i] = !this.arrCollapse[i];

  async doOpenAccuSplitAdd() {
    if (!this.ccode) {
      this.doReset();
    } else {
      const sppCase = await this.generalService.getSppCaseByCasecode(this.ccode).toPromise().then();
      of(sppCase).subscribe(res => this.data = res);
      this.getSppCaseUpdateinfo();
      this.data.casecode = "";
      this.data.casename = "";
    }
    this.action = 'I';
  }

  openModalAccu = () => this.isVisibleDialog = true;

  closeModalAccu = ($event) => this.isVisibleDialog = false;

  doAddCaseSplit(data) {
    this.isVisibleDialog = false;
    this.data = data;
    this.getSppCaseUpdateinfo();
    this.isTachva = true;
  }

  doReset() {
    const atxLocation = this.data.atxLocation
    this.data = {};
    this.data.atxLocation = atxLocation;
    this.data.begin_office = '02';
    this.categoriesService.getPoliceFromBySppId(this.sppid).subscribe(res => {
      this.lstPolices = res ? [WebUtilities.toUppercaseFields(res)] : [];
      this.data.atxPol = this.setObj(this.lstPolices, 'POLICEID', this.sppid);
    }),
      error => this.notificationService.showNotification(Constant.ERROR, error.error.text);
  }

  getSppCaseUpdateinfo() {
    if (this.data.casecode) {
      this.isTachva = true;
      if (this.data.crimdate) {
        const joda = new Date(this.data.crimdate);
        this.data.cyear = joda.getFullYear();
        this.data.cmonth = joda.getMonth() + 1;
        this.data.cday = joda.getDay();
      }

      if (this.data.crimwhere === 'XX') {
        this.LstLocation = [{ Locaid: 'XX', remark: 'Không xác định' }]
      } else {
        this.getLocation(this.data.crimwhere);
      }

      this.bindAutoComplete(this.data.begin_officeid)

      if (this.data.lawcode) {
        this.getLstLaws(this.data.lawcode);
      } else {
        this.lstLaw = [];
      }
    }
  }

  async getLstLaws(lawcode) {
    this.categoriesService.getLawByLawCode(lawcode).subscribe(res => {
      if (res) {
        const rs = WebUtilities.toLowercaseFields(res);
        this.lstLaw = [rs];
        this.data.atxLaw = rs;
      }
    }), error => this.notificationService.showNotification(Constant.ERROR, error.error.text);
  }

  polChangeEvent() {
    this.data.police = null;
    this.data.army = null;
    this.data.border = null;
    this.data.customs = null;
    this.data.ranger = null;
    this.data.spp = null;
    this.data.spc = null;
    this.bindAutoComplete('0');
  }

  async getListCategories() {
    this.categoriesService.getListPol({ size: 100 }).subscribe(res => {
      this.lstPols = res.datas;
    });
  }

  bindAutoComplete(begin_officeid: any) {
    switch (this.data.begin_office) {
      case '02':
        this.categoriesService.getListPolice(begin_officeid).subscribe(res => {
          this.lstPolices = res;
          this.data.atxPol = this.setObj(this.lstPolices, 'POLICEID', begin_officeid);
        });
        break;
      case '04':
        this.categoriesService.getListArmy(begin_officeid).subscribe(res => {
          this.lstArmies = res;
          this.data.atxArmy = this.setObj(this.lstArmies, 'ARMYID', begin_officeid);
        });
        break;
      case '06':
        this.categoriesService.getListCustoms(begin_officeid).subscribe(res => {
          this.lstCustoms = res;
          this.data.atxCustoms = this.setObj(this.lstCustoms, 'CUSTOMID', begin_officeid);
        });
        break;
      case '08':
        this.categoriesService.getListRangers(begin_officeid).subscribe(res => {
          this.lstRangers = res;
          this.data.atxRanger = this.setObj(this.lstRangers, 'RANGID', begin_officeid);
        });
        break;
      case '09':
        this.categoriesService.getListBorderGuards(begin_officeid).subscribe(res => {
          this.lstBorderGuards = res;
          this.data.atxBorderGuards = this.setObj(this.lstBorderGuards, 'BORGUAID', begin_officeid);
        });
        break;
      case 'SPP':
        this.categoriesService.getListVKS(begin_officeid).subscribe(res => {
          this.lstSpps = res;
          this.data.atxSpp = this.setObj(this.lstSpps, 'sppid', begin_officeid);
        });
        break;
      case 'SPC':
        this.categoriesService.getFromSpp(begin_officeid).subscribe(res => {
          this.lstSpcs = res;
          this.data.atxSpc = this.lstSpcs[0];
        });
        break;
    }
  }

  setObj(lst: any[], item: string, value: any) {
    if (lst && lst.length > 0) {
      return lst.find(e => e[item] === value);
    } else {
      return null;
    }
  }

  changeBeginIndate($event) {
    if ($event) {
      const date = new Date($event);
      if (moment(date).isAfter(new Date())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày quyết định không được sau ngày hiện tại')
      }
      if (this.data.crimdate) {
        const crimdate = new Date(this.data.crimdate)
        if (moment(date).isBefore(crimdate)) {
          this.notificationService.showNotification(Constant.ERROR, 'Ngày quyết định không được trước Ngày xảy ra')
        }
      }
    }
  }

  changeCrimdate($event) {
    if ($event && $event instanceof Date) {
      this.data.cmonth = $event.getMonth() + 1;
      this.data.cyear = $event.getFullYear();
    } else {
      this.data.cmonth = null;
      this.data.cyear = null;
    }
  }

  monthyearChange() {
    setTimeout(() => {
      const year = this.data.cyear ? this.data.cyear : '';
      let month = this.data.cmonth;
      if (!month) {
        month = 1;
      }
      const crimDate = new Date(year, month - 1, 1);
      this.data.crimdate = crimDate;
    }, 10);
  }
}
