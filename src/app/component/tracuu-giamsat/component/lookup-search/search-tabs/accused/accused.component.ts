import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NotificationService} from '../../../../../../service/notification.service';
import {Router} from '@angular/router';
import {ConstantService} from '../../../../../../service/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from '../../../../../../service/date-change.service';
import {GeneralService} from '../../../../../../service/general-service';
import {AppConfigService} from '../../../../../../../app-config.service';
import {WebUtilities} from '../../../../../../shared/utils/qla-utils.class';
import {Constant} from '../../../../../../shared/constants/constant.class';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {CategoriesService} from "../../../../../../service/categories.service";

@Component({
  selector: 'app-accused',
  templateUrl: './accused.component.html',
  styleUrls: ['./accused.component.scss']
})
export class AccusedComponent implements OnInit {
  @Input() filterItem: any;

  /* PAGE */
  page: any;
  total: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;

  /* DATA PAGE */
  datas = [];

  /* SEARCH FILTER*/
  isCollapse = true;
  loading = false;
  enabledAutoLoadData = false; // Tự động lấy dữ liệu sau khi tải trang
  selectedItem: any;
  lstNati: any[];
  lstCountry: any[];
  lstLocation: any[];
  lstOccupation: any[];
  userfor: any;
  sppid: any;
  data: any;
  lstParties: any[];
  lstOffices: any[];

  isVisibleDetail: boolean;
  isVisiblePopupLaw: boolean;

  /* Button display*/
  isUpdBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isBtnUpdDisabled: boolean;

  /* DIALOG CONFIRM */
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;


  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private constantService: ConstantService,
    private cookieService: CookieService,
    private datechangeService: DateChangeService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private categoriesService: CategoriesService
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.resetPage();
    this.resetBtn();
    this.getListParty();
    this.getListOffice();
    // this.getListNation();
  }

  resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  closeDetail(isClose: boolean): void {
    this.isVisibleDetail = isClose;
  }

  showDetail(): void {
    this.data = this.selectedItem;
    this.isVisibleDetail = true;
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.filterItem.pageSize = this.defaultPage;
      this.filterItem.rowIndex = this.defaultPage * (this.pageIndex - 1);
      this.filterItem.sortOrder = 'ASC';
      const payload = {
        ...this.filterItem,
        sppidList: this.filterItem?.sppid,
        sppid: '',
        natiid: this.filterItem?.natiid?.NATIID,
        counid: this.filterItem?.counid?.COUNID,
        locaid: this.filterItem?.locaid?.LOCAID,
        address: this.filterItem?.address?.LOCAID,
        occuid: this.filterItem?.occuid?.OCCUID,
      }
      this.loading = true;
      this.generalService.searchLookupAccused(payload).subscribe(res => {
        this.loading = false;
        this.datas = res;
        if (this.datas.length != 0)
          this.total = this.datas[0].ROWCOUNT;
        else
          this.total = 0;
        this.resetBtn();

      }, error => {
        this.notificationService.showNotification(Constant.ERROR, error);
      });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex, sort, filter} = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.loadDataFromServer();
  }

  doSearch() {
    this.enabledAutoLoadData = true;
    this.resetBtn();
    this.resetPage();
    this.loadDataFromServer();
  }

  onRowSelect(item) {
    this.selectedItem = item;
    this.clearSelection(false);
  }

  resetBtn() {
    this.selectedItem = null;
    this.clearSelection(true);
  }

  clearSelection(opt: boolean) {
    this.isDeleteBtn = opt;
    this.isUpdBtn = opt;
    this.isDetailBtn = opt;
    this.isBtnUpdDisabled = opt;
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  onValueTodate(event: any) {
    this.data.todate = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onValueFDate(event: any) {
    this.filterItem.birthdayfrom = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.birthdayto = this.datechangeService.onDateValueChange(event);
  }

  checkDate(): void {
    if (this.filterItem.birthdayfrom && this.filterItem.birthdayto) {
      const fromdate = new Date(this.filterItem.birthdayfrom);
      const todate = new Date(this.filterItem.birthdayto);
      const count = WebUtilities.calculateDiff(fromdate, todate);
      if (count > 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày sinh đến ngày phải lớn hơn hoặc bằng Ngày sinh từ ngày');
        this.filterItem.birthdayto = null;
      }
    }
  }

  getListNation(): void {
    const query = ' ';
    this.generalService.getLstNation(query).subscribe(res => {
      this.lstNati = res;
    })
  }

  onInputNation(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstNati = [];
    } else {
      this.generalService.getLstNation({
        query: value
      }).subscribe(res => {
        this.lstNati = res;
      });
    }
  }

  onInputCountry(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstCountry = [];
    } else {
      this.generalService.getLstCountry({
        query: value
      }).subscribe(res => {
        this.lstCountry = res;
      });
    }
  }

  onInputLocation(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstLocation = [];
    } else {
      this.generalService.autocompleteLocation(value).subscribe(res => {
        this.lstLocation = res;
      });
    }
  }

  onInputOccupation(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstOccupation = [];
    } else {
      this.generalService.getLstOccupation(value).subscribe(res => {
        this.lstOccupation = res;
      });
    }
  }

  getListParty() {
    this.categoriesService.getListParty({size: 100}).subscribe(res => {
      this.lstParties = res.datas;
    });
  }

  getListOffice() {
    this.categoriesService.getListOffice({size: 100}).subscribe(res => {
      this.lstOffices = res.datas;
    });
  }

  showPopupLaw(): void {
    this.isVisiblePopupLaw = true;
  }

  closePopupLaw = ($event: boolean) => {
    this.isVisiblePopupLaw = $event;
  }

  submitPopupLaw = ($event) => {
    this.isVisiblePopupLaw = false;
    let law = $event;
    this.filterItem.lawid = law.LAWID;
    this.filterItem.item = law.ITEM;
    this.filterItem.point = law.POINT;
  }
}
