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
  selector: 'app-law-search',
  templateUrl: './law-search.component.html',
  styleUrls: ['./law-search.component.scss']
})
export class LawSearchComponent implements OnInit {
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
  lstLawGroup: any;
  lstCode: any;

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
    this.getListCode();
    this.onInputLawGroup();
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
      this.generalService.searchLaw(payload).subscribe(res => {
        if (res) {
          this.datas = res.datas;
          if (this.datas.length != 0)
            this.total = this.datas[0].rowCount;
          else
            this.total = 0;
        } else {
          this.datas = [];
          this.total = 0;
        }
        this.resetBtn();
        this.loading = false;
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
    this.data = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(this.selectedItem);
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
    this.generalService.deleteLaw({
      lawcode: this.selectedItem.lawCode
    }).subscribe(res => {
      if (res) {
        const msg = this.generalService.readPropertiesJava(res);
        this.notificationService.showNotification(Constant.ERROR, msg);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa điều luật thành công');
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
    return f === '01' ? 'BLTTHS  2004' : (f === '02' ? 'BLHS 1999' : ((f === '03' ? 'BLDS 1995' :
      (f === '04' ? 'BLHC' : (f === '05' ? 'BLHS 1985' : (f === '06' ? 'BLHS 2015' : 'BLHS 2015'))))));
  }

  f(value): any {
    return value === 'L4' ? 'Đặt biệt nghiêm trọng' : value === 'L3' ?
      'Rất nghiêm trọng' : value === 'L2' ? 'Nghiêm trọng' : 'Ít nghiêm trọng';
  }

  getListCode(): void {
    this.generalService.getListCode({code: ' '}).subscribe(res => {
      if (res) {
        this.lstCode = res;
      } else {
        this.lstCode = [];
      }
    });
  }

  onInputLawGroup(): void {
    this.generalService.getListLawGroup({code: this.filterItem.codeId}).subscribe(res => {
      if (res) {
        this.lstLawGroup = res;
      } else {
        this.lstLawGroup = [];
      }
    });
  }
}
