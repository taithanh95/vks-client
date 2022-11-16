import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {CookieService} from 'ngx-cookie-service';
import {AppConfigService} from '../../../../../../app-config.service';
import {DateChangeService} from '../../../../../service/date-change.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {SppService} from '../../../../../service/spp-service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-search-view-reveice',
  templateUrl: './search-view-reveice.component.html',
  styleUrls: ['./search-view-reveice.component.scss']
})
export class SearchViewReveiceComponent  implements OnInit{

  /* Show Dialogs*/
  isVisibleGrid: boolean;
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

  /* Button display*/
  isUpdBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private datechangeService: DateChangeService,
    private sppService: SppService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private cookieService: CookieService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
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
    this.doSearch();
  }

  resetFilter() {
    this.resetBtn();
    this.filterItem = {
      casecode: '',
      casename: '',
      fromdate: null,
      todate: null,
      reveicetype: 'I',
      sppname: '',
    };
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.filterItem.pageSize = this.defaultPage;
      this.filterItem.rowIndex = this.pageIndex - 1
      this.loading = true;
      this.filterItem.sppid = WebUtilities.getLoggedSppId();
      this.generalService.getListSppReveice(this.filterItem).subscribe(res => {
        this.loading = false;
        this.datas = res;
        if(this.datas.length != 0) 
          this.total = this.datas[0].ROWCOUNT;
        else
          this.total = 0;
      }, error => {
        alert('Lỗi dữ liệu');
      });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.loadDataFromServer();
  }

  doSearch() {
    this.enabledAutoLoadData = true;
    this.resetBtn();
    this.loadDataFromServer();
  }

  showEditForm() {
    this.router.navigate(['/admin/vu-an/search/nhan-an/update']);
    this.sppService.setCurrentSppCase(WebUtilities.toLowercaseFieldsWithoutConvertBoolean(this.selectedItem));
  }

  showGridView(): void {
    this.isVisibleGrid = true;
  }

  closeGridView(isClose: boolean): void {
    this.isVisibleGrid = isClose;
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
    if (this.filterItem.reveicetype === 'U') {
      this.isDeleteBtn = false;
    }
    this.isUpdBtn = false;
    this.isDetailBtn = false;
  }

  doDelete() {
    let payload = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(this.selectedItem);
    payload = {...payload, action: 'D'}
    this.generalService.updateSppReveice(payload).subscribe(res => {
      if (res) {
        const msg = this.generalService.readPropertiesJava(res);
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa vụ án thành công');
        this.loadDataFromServer();
      }
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      this.notificationService.showNotification(Constant.ERROR, msg);
    });
  }

  f(f): any {
    return f === 'G1' ? 'Kiểm sát điều tra' : 
    f === 'G2' ? 'Truy tố' : 
    f === 'G3' ? 'Sơ thẩm' : 
    f === 'G4' ? 'Phúc thẩm' : 
    f === 'G5' ? 'Giám đốc thẩm/Tái thẩm' : null
  }
}