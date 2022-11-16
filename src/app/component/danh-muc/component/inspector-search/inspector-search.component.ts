  import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../../../service/notification.service";
import {Router} from "@angular/router";
import {CategoriesService} from "../../../../service/categories.service";
import {GeneralService} from "../../../../service/general-service";
import {AppConfigService} from "../../../../../app-config.service";
import {CookieService} from "ngx-cookie-service";
import {WebUtilities} from "../../../../shared/utils/qla-utils.class";
import {Constant} from "../../../../shared/constants/constant.class";
import {NzTableQueryParams} from "ng-zorro-antd/table";

@Component({
  selector: 'app-inspector-search',
  templateUrl: './inspector-search.component.html',
  styleUrls: ['./inspector-search.component.scss']
})
export class InspectorSearchComponent implements OnInit {

  /* Show Dialogs*/
  isVisibleDetail: boolean;
  isVisibleEdit: boolean;
  isVisibleCreate: boolean;
  isVisibleChange: boolean;
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

  /*LIST DƠN VỊ */
  lstSpp = [];
  lstSppIsDepart = [];

  /* Button display*/
  isUpdBtn: boolean;
  isInsBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isChangeBtn: boolean;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private categoriesService: CategoriesService,
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
  }

  resetFilter() {
    this.resetBtn();
    this.filterItem = {
      inspcode: '',
      fullname: '',
      sppid: '',
      currentsppid: '',
    };
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.filterItem.pageSize = this.defaultPage;
      this.filterItem.rowIndex = this.defaultPage * (this.pageIndex - 1);
      this.filterItem.sortOrder = 'ASC';
      const payload = {
        ...this.filterItem,
        sppid: this.filterItem?.sppid?.SPPID ? this.filterItem?.sppid?.SPPID : null,
        currentsppid: this.filterItem?.currentsppid?.SPPID ? this.filterItem?.currentsppid?.SPPID : null
      }
      this.loading = true;
      this.generalService.searchInspector(payload).subscribe(res => {
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

  private resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  showDetail(): void {
    this.isVisibleDetail = true;
  }

  closeDetail(isClose: boolean): void {
    this.isVisibleDetail = isClose;
  }

  showEditForm(): void {
    this.isVisibleEdit = true;
  }

  closeEditForm(isClose: boolean): void {
    this.isVisibleEdit = isClose;
  }

  showCreateForm(): void {
    this.isVisibleCreate = true;
  }

  closeCreateForm(isClose: boolean): void {
    this.isVisibleCreate = isClose;
  }

  showChangeForm(): void {
    this.isVisibleChange = true;
  }

  closeChangeForm(isClose: boolean): void {
    this.isVisibleChange = isClose;
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
    this.isChangeBtn = true;
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  currentPageDataChange($event: any[]): void {
  }

  toggleButtons() {
    if (this.selectedItem) {
      const temp = this.filterItem.sendtype === 'U';
      this.isDeleteBtn = temp;
      this.isUpdBtn = temp;
      this.isInsBtn = temp;
      this.isDetailBtn = false;
    } else {
      this.isDeleteBtn = false;
      this.isUpdBtn = false;
      this.isInsBtn = false;
      this.isDetailBtn = true;
    }
    this.isChangeBtn = this.selectedItem.STATUS === 'Y' ? false : true;
  }

  getListSpp(): void {
    this.generalService.getListSpp({
      sppid: this.sppId
    }).subscribe(res => {
      this.loading = false;
      this.lstSpp = res;
      this.filterItem.sppid = res[0];
      this.onInputSppIsDepart();
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  onInputSppIsDepart(): void {
    this.generalService.getListSppIsDepart(
      {
        sppid: this.filterItem?.sppid?.SPPID
      }
    ).subscribe(res => {
      this.loading = false;
      this.lstSppIsDepart = res;
      this.filterItem.currentsppid = null;
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }

  convert(f): any {
    return f === 'Y' ? 'Có' : 'Không'
  }

  convert1(f): any {
    let __res = '';
    if (f != null) {
      const lstPosition = f.split(',');
      lstPosition.forEach(data => {
        if (data === 'KH') {
          __res += __res ? ',Khác ': 'Khác ';
        } else if (data === 'DT') {
          __res += __res ? ', Điều tra viên' : 'Điều tra viên';
        } else if (data === 'LD') {
          __res += __res ? ', Lãnh đạo' : 'Lãnh đạo';
        } else if (data === 'KS') {
          __res += __res ? ', Kiểm sát viên' : 'Kiểm sát viên';
        }
      });
    }
    return __res;
  }

  doDelete() {
    this.generalService.deleteInspector({
      inspcode: this.selectedItem.INSPCODE
    }).subscribe(res => {
      if (res) {
        const msg = this.generalService.readPropertiesJava(res);
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa người xử lý thành công');
        this.loadDataFromServer();
      }
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      this.notificationService.showNotification(Constant.ERROR, msg);
    });
  }
}
