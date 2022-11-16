import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {DateChangeService} from '../../../../../service/date-change.service';
import {CategoriesService} from '../../../../../service/categories.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {StringService} from '../../../../../common/util/string.service';

@Component({
  selector: 'app-d-accu-legal',
  templateUrl: './d-accu-legal.component.html',
  styleUrls: ['./d-accu-legal.component.scss']
})
export class DAccuLegalComponent implements OnInit, OnChanges{
  // tslint:disable-next-line:variable-name
  position_type: any;
  @Input() sppCase: any;
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  userLogin: any;
  isSubmited: boolean;
  /*DEMO*/
  inputValue?: any;
  inspectorOpions: any[];
  assignInsOptions: any[];
  assignInsValue?: any;
  arrCollapse: any[];

  /*OPTIONS*/
  lstPolices: any[];
  lstArmies: any[];

  lstCustoms: any[];
  lstRangers: any[];
  lstBorderGuards: any[];
  lstSpps: any[]; // Viện kiểm sát
  lstSpcs: any[]; // Tòa án

  lstCountry: any[];
  lstAddress: any[];
  lstNations: any[];
  lstOffices: any[];
  lstPols: any[];
  /*LAW*/
  @Input() lstLaw: any[];
  lstSavedLaw: any[];
  pageSize: any;
  page: any;
  defaultPage: any;
  loading: boolean;
  isVisibleLaw: boolean;

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
  onInputCountry(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstCountry = [];
    } else {
      const payload = {counName: value};
      this.categoriesService.getListCountry(payload).subscribe(res => {
        this.lstCountry = res.datas;
      });
    }
  }
  onInputAddress(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstAddress = [];
    } else {
      this.categoriesService.getListLocation(value).subscribe(res => {
        this.lstAddress = res;
      });
    }
  }
  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private datechangeService: DateChangeService,
    private stringService: StringService
  ) {
    this.userLogin = WebUtilities.getLoggedSpp();
    if (!this.data) {
      // alert('vao day');
      this.data = {};
      this.data.position_type = 'KS';
      this.data.position_ksv = 'TG';
      this.arrCollapse = [true, true, true, true, true];
    }
  }

  ngOnInit(): void {
    this.isSubmited = false;
  }

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }
  bindAutoComplete(begin_officeid: any) {
    switch (this.data.begin_office) {
      case '02':
        this.categoriesService.getListPolice(begin_officeid).subscribe(res => {
          this.lstPolices = res;
          this.data.police = res[0];
        });
        break;
      case '04':
        this.categoriesService.getListArmy(begin_officeid).subscribe(res => {
          this.lstArmies = res;
          this.data.army = res[0];
        });
        break;
      case '06':
        this.categoriesService.getListCustoms(begin_officeid).subscribe(res => {
          this.lstCustoms = res;
          this.data.customs = res[0];
        });
        break;
      case '08':
        this.categoriesService.getListRangers(begin_officeid).subscribe(res => {
          this.lstRangers = res;
          this.data.ranger = res[0];
        });
        break;
      case '09':
        this.categoriesService.getListBorderGuards(begin_officeid).subscribe(res => {
          this.lstBorderGuards = res;
          this.data.border = res[0];
        });
        break;
      case 'SPP':
        this.categoriesService.getListVKS(begin_officeid).subscribe(res => {
          this.lstSpps = res;
          this.data.spp = res[0];
        });
        break;
      case 'SPC':
        this.categoriesService.getListToaAn(begin_officeid).subscribe(res => {
          this.lstSpcs = res;
          this.data.spc = res[0];
        });
        break;
    }
  }
  getListCategories(){
    this.categoriesService.getListNation({size: 100}).subscribe(res => {
      this.lstNations = res.datas;
    });
    this.categoriesService.getListOffice({size: 100}).subscribe(res => {
      this.lstOffices = res.datas;
    });
    this.categoriesService.getListPol({size: 100}).subscribe(res => {
      this.lstPols = res.datas;
    });
  }
  ngOnChanges(): void {
    if (this.isVisible){
      this.loading = false;
      this.isSubmited = false;
      if (this.data) {
        if (this.data.isEdit){
          this.generalService.getLstLawByAccu(this.data.accucode).subscribe(res => {
            this.lstSavedLaw = res;
          });
        } else{
          this.lstSavedLaw = this.lstLaw.filter(en => 1 === 1);
        }
        this.inspectorOpions = [];
        this.assignInsOptions = [];
        if (this.data && this.data.begin_officeid) {
          this.bindAutoComplete(this.data.begin_officeid);
        }
        this.getListCategories();
        this.getListOptions();
      }
    }
  }

  getListOptions() {
    let payloadCountry = {};
    if (this.data && this.data.counid) {
      payloadCountry = {counId: this.data.counid};
    } else {
      payloadCountry = {counId: 'VN'};
    }

    if (this.data) {
      this.categoriesService.getListCountry(payloadCountry).subscribe(res => {
        this.lstCountry = res.datas;
        this.data.country = res.datas[0];
      });
    }

    if (this.data && this.data.locaid) {
      this.categoriesService.getLocationById(this.data.locaid).subscribe(res => {
        this.data.locaid = res;
      });
    }

    if (this.data && this.data.address) {
      this.categoriesService.getLocationById(this.data.address).subscribe(res => {
        const data = WebUtilities.toUppercaseFields(res);
        this.lstAddress = [data];
        this.data.address = data;
      });
    }
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
  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
  handleOk(): void {
    this.loading = true;
    this.isSubmited = true;
    let valid = true;
    if (!this.data.begin_setnum)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Quyết định số');
      valid = false;
    }
    if (!this.data.begin_indate)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày ra quyết định');
      valid = false;
    }
    if (!this.data.begin_office)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Đơn vị ra quyết định');
      valid = false;
    }
    if (!this.data.fullname)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên pháp nhân');
      valid = false;
    }
    /*if (!this.data.aliasname)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Người đại diện');
      valid = false;
    }*/
    if (!this.data.country)
    {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Quốc tịch');
      valid = false;
    }

    if (valid) {
      this.data.phapnhan = 'P';
      /*Set lawcode*/
      this.data.lawcode = this.lstSavedLaw;
      /*End set lawcode*/
      this.isVisible = false;
      this.closeModal.emit(false);
      this.data.userfor = this.userfor;
      this.submitForm.emit({
        ...this.data,
        fullname: this.stringService.capitalize(this.data.fullname),
        aliasname: this.stringService.capitalize(this.data.aliasname)
      });
    }else{
      this.loading = false;
    }
  }


  /*LAW*/
  showInsertLaw() {
    this.isVisibleLaw = true;
  }
  closePopupLaw(): void {
    this.isVisibleLaw = false;
  }
  submitLaw(data): void {
    // this.lstSavedLaw.push(data);
    // use ... to change grid
    const checkExists = this.lstSavedLaw.find(en => en.LAWID === data.LAWID);
    if (!checkExists) {
      this.lstSavedLaw = [
        ...this.lstSavedLaw,
        data
      ];
    }
    else{
      this.notificationService.showNotification(Constant.ERROR, 'Điều luật đã được thêm trước đó');
    }
  }

  deleteLaw(data: any) {
    this.lstSavedLaw = this.lstSavedLaw.filter(en => en.LAWID !== data.LAWID);
  }
  handleReset() {
    this.doReset();
  }
  doReset(){
    this.data = {};
    this.data.begin_setnum = '';
    this.data.begin_indate = new Date();
    this.data.begin_office = this.sppCase.BEGIN_OFFICE;
    this.data.begin_officeid = this.sppCase.BEGIN_OFFICEID;
    this.data.firstacc = 'N';
    this.data.religion = 'K';
    this.data.sex = 'B';
    this.data.counid = 'VN';
    this.data.natiid = '01';
    this.data.levelid = '01';
    this.data.locaid = '01';
    this.data.address = this.userLogin?.locaid;
    this.data.partyid = '';
    this.data.isEdit = false;
    this.getListOptions();
    this.bindAutoComplete(this.data.begin_officeid);
  }

  onValueBeginIndate(event: any){
    this.data.begin_indate = this.datechangeService.onDateValueChange(event);
  }

	validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}
