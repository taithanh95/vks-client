import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AppConfigService } from '../../../../../../app-config.service';
import { CategoriesService } from '../../../../../service/categories.service';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-admdepartment-search',
  templateUrl: './admdepartment-search.component.html',
  styleUrls: ['./admdepartment-search.component.scss']
})
export class AdmdepartmentSearchComponent implements OnInit {

  /* Show Dialogs*/
  isVisibleDetail: boolean;
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

  /* Button display*/
  isUpdBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isBtnUpdDisabled: boolean;

  lstSpps: any;

  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private categoriesService: CategoriesService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
    this.resetFilter();
  }

  ngOnInit(): void {
    this.resetPage();
    this.doSearch();
  }

  resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 10;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  resetFilter() {
    this.resetBtn();
    this.filterItem = {
      departid: '',
      name: '',
      atxtSpp: ''
    };
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.filterItem.sortOrder = 'ASC';
      const payload = {
        ...this.filterItem,
        atxtSpp: this.filterItem.atxtSpp ? this.filterItem.atxtSpp.SPPID : '',
        sppid: this.sppId,
        size: this.defaultPage,
        page: this.defaultPage * (this.pageIndex - 1)
      }
      this.loading = true;
      this.generalService.getLstAdmDepertments(payload).subscribe(res => {
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

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpps = [];
    } else {
      this.categoriesService.getLstSpp(value).subscribe(res => {
        this.lstSpps = res;
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

  doDelete() {
    this.generalService.deleteAdmDepertments(this.selectedItem?.DEPARTID).subscribe(res => {
      if (res) {
        const msg = this.generalService.jsonErrorDM[res];
        this.notificationService.showNotification(Constant.ERROR, msg ? msg : res);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
        this.loadDataFromServer();
      }
    }, error => {
      const msg = this.generalService.jsonErrorDM[error.error.text];
      this.notificationService.showNotification(Constant.ERROR, msg ? msg : error.error.text);
    });
  }

  showEditForm(): void {
    this.data = WebUtilities.toLowercaseFields(this.selectedItem);
    this.data.isEdit = true;
    this.isVisibleCreate = true;
  }
  showCreateForm(): void {
    this.data = {};
    this.data.sppid = this.sppId;
    this.data.isEdit = false;
    this.isVisibleCreate = true;
  }

  closeModalCreate($event: boolean){
    this.isVisibleCreate = $event;
  }

  reloadModalCreate($event: boolean){
    this.isVisibleCreate = $event;
    this.loadDataFromServer();
  }
  
  showDetail(): void {
    this.isVisibleDetail = true;
    this.data = this.selectedItem;
  }

  closeModalDetail = ($event: boolean) => this.isVisibleDetail = $event;
}
