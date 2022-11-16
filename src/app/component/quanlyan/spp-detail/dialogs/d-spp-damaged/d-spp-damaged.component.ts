import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {AppConfigService} from '../../../../../../app-config.service';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';
import {Constant} from '../../../../../shared/constants/constant.class';
import * as moment from 'moment';
import {DateChangeService} from '../../../../../service/date-change.service';
import {StringService} from '../../../../../common/util/string.service';

@Component({
  selector: 'app-d-spp-damaged',
  templateUrl: './d-spp-damaged.component.html',
  styleUrls: ['./d-spp-damaged.component.scss']
})
export class DSppDamagedComponent implements OnInit, OnChanges {
  // tslint:disable-next-line:variable-name
  position_type: any;
  @Input() sppCase: any;
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() data: any;
  @Input() register: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  sppId: any;
  selectedSpp: any;
  isSubmited: boolean;

  /*DEMO*/
  inspectorOpions: any[];
  assignInsOptions: any[];
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
  lstLoca: any[];
  lstAddress: any[];
  lstReligions: any[];
  lstNations: any[];
  lstKnowledges: any[];

  lstOccupations: any[];
  lstParties: any[];
  lstOffices: any[];

  /*LAW*/
  @Input() lstSppDamaged: any[];
  lstSavedLaw: any[];
  pageSize: any;
  page: any;
  defaultPage: any;
  loading: boolean;
  lstDeciAccu: any[];

  selectedVio: any;
  isYearBef: any;
  isVisibleYearErr: boolean;

  /** Data Occupations */
  arrOccupations: string[];

  onInputLoca(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstLoca = [];
    } else {
      this.categoriesService.getListLocation(value).subscribe(res => {
        this.lstLoca = res;
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
    private configService: AppConfigService,
    private datechangeService: DateChangeService,
    private stringService: StringService
  ) {
    this.sppId = this.categoriesService.getSppId();
    if (!this.data) {
      this.data = {};
      this.data.position_type = 'KS';
      this.data.position_ksv = 'TG';
      this.arrCollapse = [true, true, true, true, true];
    }
  }

  ngOnInit(): void {
    this.lstDeciAccu = [];
    this.isSubmited = false;
    this.loading = false;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.selectedSpp = WebUtilities.getLoggedSpp();
    this.resetViolation();
  }

  resetViolation() {
    this.selectedVio = {VIOLATION_TYPE: 1};
  }

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  getListCategories() {
    this.categoriesService.getListReligion({size: 100}).subscribe(res => {
      this.lstReligions = res.datas;
    });
    this.categoriesService.getListNation({size: 100}).subscribe(res => {
      this.lstNations = res.datas;
    });
    this.categoriesService.getListKnowledge({size: 100}).subscribe(res => {
      this.lstKnowledges = res.datas;
    });
    this.categoriesService.getListOccupation({size: 100, sortField: 'occuId', sortOrder: 'ASC'}).subscribe(res => {
      this.lstOccupations = res.datas;
    });
    this.categoriesService.getListParty({size: 100}).subscribe(res => {
      this.lstParties = res.datas;
    });
    this.categoriesService.getListOffice({size: 100}).subscribe(res => {
      this.lstOffices = res.datas;
    });
      this.categoriesService.getListCountry({size: 300}).subscribe(res => {
      this.lstCountry = res.datas;
    });
  }

  ngOnChanges(): void {
    if (!this.data || !this.isVisible) {
      return;
    }

    if (this.isVisible){
      this.loading = false;
      this.isSubmited = false;
      this.arrOccupations = [];
      this.inspectorOpions = [];
      this.assignInsOptions = [];
      if (this.data.id) {
        if (!this.data.partyId) {
          this.data.partyId = '';
        }
        const newDate = new Date(this.data.birthDay);
        this.data.byear = newDate.getFullYear();
        this.data.bmonth = newDate.getMonth() + 1;
        this.data.bdate = newDate.getDate();
      } else {
          this.data.partyId = '';
          this.data.occuId = '01';
          this.data.conviction = 0;
          this.data.offence = 0;
          this.data.counId = 'VN';
          this.data.natiId = '01';
          this.data.religion = 'K';
          this.data.sex = 'B';
          this.data.levelId = '01';
          this.data.locaId = this.selectedSpp.locaid;
          this.data.address = this.selectedSpp.address;
      }
      this.arrOccupations = this.data.occuId.split(',');
      this.getListCategories();
      this.getListCountry();
      this.getListLocation();
    }
  }

  getListCountry(): void {
    let payloadCountry = {};
    if (this.data && this.data.counId) {
      payloadCountry = {counId: this.data.counId};
    } else {
      payloadCountry = {counId: 'VN'};
    }
    if (this.data) {
      this.categoriesService.getListCountry(payloadCountry).subscribe(res => {
        this.data.country = res.datas[0];
      });
    }
  }

  getListLocation(): void {
    if (this.data && this.data.locaId) {
      const locaId = this.data.locaId.LOCAID ? this.data.locaId.LOCAID : this.data.locaId;
        this.categoriesService.getListLocation(locaId).subscribe(res => {
          this.lstLoca = res;
          this.data.locaId = res[0];
        });
    }
    if (this.data && this.data.address) {
      const addressId = this.data.address.LOCAID ? this.data.address.LOCAID : this.data.address;
        this.categoriesService.getListLocation(addressId).subscribe(res => {
          this.lstAddress = res;
          this.data.address = res[0];
        });
    }
  }

  changeInspector() {
    this.data.assigndate = null;
    this.data.setnum = null;
    this.data.atxtIns = null;
    this.data.atxtAssignIns = null;
  }

  f(data, f): any {
    return data[f.toUpperCase()];
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleOk(): void {
    this.loading = true;
    this.isSubmited = true;
    let valid = true;
    if (!this.data.fullName) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Họ và tên');
      valid = false;
    }
    if (!this.data.byear) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Năm sinh');
      valid = false;
    } else if(this.data.byear < 4) {
      this.notificationService.showNotification(Constant.ERROR, 'Giá trị cho trường Năm sinh không hợp lệ');
      valid = false;
    }
    if (!this.data.country) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Quốc tịch');
      valid = false;
    }
    if (!this.data.natiId) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Dân tộc');
      valid = false;
    }
    if (!this.data.sex) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Giới tính');
      valid = false;
    }
    if (!this.data.birthDay) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Ngày sinh');
      valid = false;
    }
    if (!this.data.levelId) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Học vấn');
      valid = false;
    }
    if (!this.data.locaId) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Nơi ĐKHKTT');
      valid = false;
    }
    if (valid) {
      this.isVisible = false;
      this.closeModal.emit(false);
      if (this.data.locaId != null || this.data.locaId !== undefined) {
        this.data.locaId = this.data.locaId.LOCAID;
      }
      if (this.data.address != null || this.data.address !== undefined) {
        this.data.address = this.data.address.LOCAID;
      }
      this.data.occuId = this.arrOccupations.toString();
      this.submitForm.emit({...this.data, fullName: this.stringService.capitalize(this.data.fullName)});
    }else{
      this.loading = false;
    }
  }

  birthdayChange() {
    if (this.data) {
      this.isVisibleYearErr = false;
      this.data.byear = !this.data.byear?this.isYearBef:this.data.byear;
      if (!this.data.byear){
        this.notificationService.showNotification(Constant.ERROR,'Bạn phải nhập giá trị cho trường Năm sinh bị hại')
        this.isVisibleYearErr = true;
        return;
      }else if(this.data.byear.length < 4) {
        setTimeout(() => {
        this.isVisibleYearErr = true;
        this.data.byear = null;
        this.data.bmonth = null;
        this.data.bdate = null;
        this.data.birthDay = null;
        }, 10);
        this.notificationService.showNotification(Constant.ERROR,'Bạn phải nhập giá trị cho trường Năm / tháng / ngày sinh')
        return;
      }
      this.isYearBef = this.data.byear?this.data.byear:this.isYearBef;

      if (!this.data.bmonth || this.data.bmonth > 12) {
        this.data.bmonth = 12;
      }
      let day = this.getDaysInMonth(this.data.bmonth, this.data.byear);
      if (!this.data.bdate || this.data.bdate > day) {
        this.data.bdate = day
      }

      let crimDate = this.sppCase.CRIMDATE;
      const birthDay = new Date(this.data.byear, this.data.bmonth - 1, this.data.bdate);

      crimDate = new Date(crimDate);
      this.data.birthDay = null;
      if(moment(new Date()).isBefore(birthDay)){
        this.notificationService.showNotification(Constant.WARNING,'Ngày sinh phải nhỏ hơn hoặc bằng ngày hiện tại')
        this.data.byear = null;
        this.data.bmonth = null;
        this.data.bdate = null;
        this.data.birthDay = null;
        return;
      }else if (birthDay.getFullYear() < 1700) {
        const msg = this.generalService.readPropertiesJava('Bị hại đã quá cao tuổi trái với tự nhiên, đề nghị kiểm tra lại!');
        this.notificationService.showNotification(Constant.WARNING, msg);
        this.data.byear = null;
        this.data.bmonth = null;
        this.data.bdate = null;
        this.data.birthDay = null;
        return;
      }
      this.data.birthDay = birthDay;
      // @ts-ignore
      // const ageDate = new Date(crimDate - birthDay); // miliseconds from epoch
      // const totalYear = Math.abs(ageDate.getUTCFullYear() - 1970);
      // if (totalYear < 14 && (this.sppCase.CASETYPE === 'L3' || this.sppCase.CASETYPE === 'L4')) {
      //   const msg = this.generalService.readPropertiesJava('SppAccused.warn.accusedTooYoung');
      //   this.notificationService.showNotification(Constant.WARNING, msg);
      //   this.data.byear = null;
      //   this.data.bmonth = null;
      //   this.data.bdate = null;
      //   this.data.birthDay = null;
      //   return;
      // }
      /*else if (totalYear < 16){
        const msg = this.generalService.readPropertiesJava('SppAccused.warn.accusedTooYoung');
        this.notificationService.showNotification(Constant.ERROR, msg);
        this.data.birthday = null;
        return;
      }*/
    }
  }

  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  };

  selectCountry(){
    this.categoriesService.getListCountry({counId : this.data.counId}).subscribe(res => {
          this.data.country = res.datas[0];
    });
  }


  deleteLaw(data: any) {
    this.lstSavedLaw = this.lstSavedLaw.filter(en => en.LAWID !== data.LAWID);
  }


  confirm(data): void {
    this.deleteLaw(data);
  }

  handleReset() {
    this.doReset();
  }

  doReset() {
    this.isSubmited = false;
    this.data = {};
    this.data.begin_setnum = '';
    this.data.begin_indate = new Date();
    this.arrOccupations = ['01'];
    this.data.conviction = 0;
    this.data.offence = 0;
    this.data.firstacc = 'N';
    this.data.religion = 'K';
    this.data.sex = 'B';
    this.data.counId = 'VN';
    this.data.natiId = '01';
    this.data.levelId = '01';
    this.data.locaId = this.selectedSpp.locaid;
    this.data.address = this.selectedSpp.address;
    this.data.partyId = '0';
    this.data.isEdit = false;
    this.getListLocation();
  }

  onValueBirthDay(event: any){
    this.data.birthDay = this.datechangeService.onDateValueChange(event);
    if(this.data.birthDay && moment(new Date()).isBefore(this.data.birthDay)){
      this.notificationService.showNotification(Constant.ERROR,'Ngày sinh phải nhỏ hơn hoặc bằng ngày hiện tại')
      this.data.birthDay = null;
    }
  }

	validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  addOccupation(input: HTMLInputElement): void {
    const value = input.value;
    if (!value) {
      this.notificationService.showNotification(Constant.ERROR, 'Nhập giá trị trước khi nhấn thêm mới');
      return;
    }
    if (this.lstOccupations.some(o => o.name.toLowerCase() === value.toLowerCase())) {
      this.notificationService.showNotification(Constant.WARNING, `Nghề nghiệp ${value} đã tồn tại trong danh sách`);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.categoriesService.insertOccupation(value).subscribe((res) => {
        this.getListOccupation(this.lstOccupations.length);
      this.notificationService.showNotification(Constant.SUCCESS, `Thêm nghề nghiệp ${value} thành công`);
      }, err => {console.log(err);})
    }
  }

  getListOccupation(length: number) {
    this.categoriesService.getListOccupation({size: length + 1, sortField: 'occuId', sortOrder: 'ASC'}).subscribe(res => {
      this.lstOccupations = res.datas;
    });
  }
}
