import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../../../../service/notification.service";
import {Router} from "@angular/router";
import {CategoriesService} from "../../../../../service/categories.service";
import {GeneralService} from "../../../../../service/general-service";
import {AppConfigService} from "../../../../../../app-config.service";
import {CookieService} from "ngx-cookie-service";
import {Constant} from "../../../../../shared/constants/constant.class";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {WebUtilities} from "../../../../../shared/utils/qla-utils.class";

@Component({
  selector: 'app-office-search',
  templateUrl: './office-search.component.html',
  styleUrls: ['./office-search.component.scss']
})
export class OfficeSearchComponent implements OnInit {
  /* Show Dialogs*/
  isVisibleDetail: boolean;
  isVisibleEdit: boolean;
  isVisibleCreate: boolean;
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

  /* Button display*/
  isUpdBtn: boolean;
  isInsBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private cookieService: CookieService
  ) {
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
  }

  resetFilter() {
    this.resetBtn();
    this.filterItem = {
      partyid: '',
      partyname: ''
    };
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      const payload = {
        ...this.filterItem,
        size: this.defaultPage,
        page: this.defaultPage * (this.pageIndex - 1)
      }
      this.loading = true;
      this.generalService.searchOffice(payload).subscribe(res => {
        if(res){
          this.datas = res.datas;
          if (this.datas.length != 0)
            this.total = this.datas[0].rowcount;
          else
            this.total = 0;
        }else{
          this.datas = [];
          this.total = 0;
        }
        this.loading = false;
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

  showDetail(): void {
    this.isVisibleDetail = true;
  }

  closeDetail(isClose: boolean): void {
    this.isVisibleDetail = isClose;
  }

  showEditForm(): void {
    this.data = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(this.selectedItem);
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
  }

  doDelete() {
    this.generalService.deleteOffice({
      officeid: this.selectedItem.officeid
    }).subscribe(res => {
      if (res) {
        const msg = this.generalService.readPropertiesJava(res);
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa chức vụ chính quyền thành công');
        this.loadDataFromServer();
      }
    }, error => {
      const msg = this.generalService.readPropertiesJava(error.error.text);
      this.notificationService.showNotification(Constant.ERROR, msg);
    });
  }

  private resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  convert(f): any {
    return f === 'QH' ? 'Quận - Huyện' : (f === 'PX' ? 'Phường - Xã' : ((f === 'TT' ? 'Tỉnh - Thành phố' : 'Trung ương')));
  }
}
