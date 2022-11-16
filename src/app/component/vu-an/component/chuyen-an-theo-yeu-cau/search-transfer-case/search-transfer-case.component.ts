import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../../../../service/notification.service";
import {Router} from "@angular/router";
import {DateChangeService} from "../../../../../service/date-change.service";
import {SppService} from "../../../../../service/spp-service";
import {GeneralService} from "../../../../../service/general-service";
import {AppConfigService} from "../../../../../../app-config.service";
import {CookieService} from "ngx-cookie-service";
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";
import {Constant} from "../../../../../shared/constants/constant.class";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {CategoriesService} from "../../../../../service/categories.service";

@Component({
  selector: 'app-search-transfer-case',
  templateUrl: './search-transfer-case.component.html',
  styleUrls: ['./search-transfer-case.component.scss']
})
export class SearchTransferCaseComponent implements OnInit {

  /* Show Dialogs*/
  isVisibleDetail: boolean;
  /*page*/
  page: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;
  total: any;
  loading: boolean;
  /*search filter*/
  enabledAutoLoadData = false; // Tự động lấy dữ liệu sau khi tải trang
  datas: any[];
  filterItem: any;
  selectedItem: any;
  sppId: any;
  data: any;
  spp: any;
  check: boolean;

  /*LIST DƠN VỊ */
  lstSpp = [];
  lstSppChild = [];
  parentid: any;

  /* Button display*/
  isUpdBtn: boolean;
  isInsBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private datechangeService: DateChangeService,
    private categoriesService: CategoriesService,
    private sppService: SppService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private cookieService: CookieService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
    this.spp = JSON.parse(localStorage.getItem(Constant.SPP));
    this.resetFilter();
  }

  ngOnInit(): void {
    if (localStorage.getItem(Constant.USER_INFO) === null
      || localStorage.getItem(Constant.USERID) !== this.cookieService.get(Constant.USERNAME)) {
      localStorage.clear();
      this.router.navigate(['login'], {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
    }
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
    this.getListSpp();
    (this.spp.SPPID === '01' || (this.spp.SPPID != '01' && this.spp.SPPLEVEL === '2' && this.spp.ISDEPART === 'Y')) ? this.check = true : this.check = false;
  }

  resetFilter() {
    this.resetBtn();
    this.filterItem = {
      casecode: '',
      casename: '',
      fromdate: null,
      todate: null,
      sendtype: '',
      sppname: '',
    };
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.filterItem.pageSize = this.defaultPage;
      this.filterItem.rowIndex = this.pageIndex - 1
      const payload = {
        ...this.filterItem,
        sppid: this.filterItem?.sppid?.SPPID ? this.filterItem?.sppid?.SPPID : null,
        sppname: this.filterItem?.sppname?.SPPID ? this.filterItem?.sppname?.SPPID : null
      }
      this.loading = true;
      this.generalService.searchRequest(payload).subscribe(res => {
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
    this.loadDataFromServer();
  }

  doSubmit(status: string) {
    const payload = {
      regicode: this.selectedItem.REGICODE,
      centcode: this.selectedItem.CENTCODE,
      status: status
    }
    this.generalService.insertRequest(payload).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới yêu cầu thành công');
      this.loadDataFromServer();
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  onHandle(status) {
    this.doSubmit(status);
  }

  showDetail(): void {
    this.isVisibleDetail = true;
  }

  closeDetail(isClose: boolean): void {
    this.isVisibleDetail = isClose;
  }

  onRowSelect(item) {
    this.selectedItem = item;
    this.toggleButtons();
  }

  resetBtn() {
    this.selectedItem = null;
    this.isDeleteBtn = true;
    this.isUpdBtn = true;
    this.isDetailBtn = true;
    this.isInsBtn = true;
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  currentPageDataChange($event: any[]): void {
  }

  changeValueDate(item: any, $event) {
    this.filterItem[item] = this.datechangeService.onDateValueChange($event);
  }

  changeDate($event): void {
    if (this.filterItem.todate && this.filterItem.fromdate) {
      const fromdate = new Date(this.filterItem.fromdate);
      const todate = new Date(this.filterItem.todate);
      const dayCount = WebUtilities.calculateDiff(fromdate, todate)
      if (dayCount > 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Từ ngày phải nhỏ hơn hoặc bằng đến ngày');
        this.filterItem.todate = '';
      }
    }
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  toggleButtons() {
    if (this.selectedItem) {
      const temp = this.filterItem.sendtype === 'U';
      this.isDeleteBtn = temp;
      this.isUpdBtn = !temp;
      this.isInsBtn = temp;
      this.isDetailBtn = false;
    } else {
      this.isDeleteBtn = false;
      this.isUpdBtn = false;
      this.isInsBtn = false;
      this.isDetailBtn = true;
    }
  }

  f(f): any {
    return f === 'G1' ? 'Kiểm sát điều tra' :
      f === 'G2' ? 'Truy tố' :
        f === 'G3' ? 'Sơ thẩm' :
          f === 'G4' ? 'Phúc thẩm' :
            f === 'G5' ? 'Giám đốc thẩm/Tái thẩm' : null
  }

  convert(f): any {
    return f === '1' ? 'Đã yêu cầu' : null
  }

  reloadPage() {
    this.datas = [];
  }

  getListSpp(): void {
    this.generalService.getListSppTinh('').subscribe(res => {
      this.loading = false;
      this.lstSpp = res;
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  onInputSppChild(): void {
    this.generalService.getListSppHuyen(this.filterItem?.sppid?.SPPID).subscribe(res => {
      this.loading = false;
      this.lstSppChild = res;
      this.filterItem.sppname = null;
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }
}
