import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CategoriesService } from '../../../../../service/categories.service';
import { AppConfigService } from '../../../../../../app-config.service';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-reason-search',
  templateUrl: './reason-search.component.html',
  styleUrls: ['./reason-search.component.scss']
})
export class ReasonSearchComponent implements OnInit {

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
  data: any;

  lstDeci: any[];

  /* Button display*/
  isUpdBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isBtnUpdDisabled: boolean;

  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private categoriesService: CategoriesService
  ) {
    this.resetFilter();
  }

  ngOnInit(): void {
    this.lstDeci = [];
    this.resetPage();
    this.doSearch();
  }

  resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  resetFilter() {
    this.resetBtn();
    this.filterItem = {
      reasonId: '',
      deciId: '',
      reasonName: '',
    };
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.filterItem.sortOrder = 'ASC';
      const payload = {
        ...this.filterItem,
        size: this.defaultPage,
        page: (this.pageIndex - 1)
      }
      this.loading = true;
      this.categoriesService.getListReason(payload).subscribe(res => {
        if (res) {
          this.datas = res.datas;
          this.total = res.totalRecords;
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

  onRowSelect(item) {
    this.selectedItem = item;
    this.clearSelection(false);
  }

  resetBtn() {
    this.selectedItem = null;
    this.clearSelection(true);
  }

  onInputDeci(e) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstDeci = [];
    } else {
      this.categoriesService.getDeciAutocomplete(value).subscribe(res => {
        this.lstDeci = res;
      });
    }
  }

  clearSelection(opt: boolean) {
    this.isDeleteBtn = opt;
    this.isUpdBtn = opt;
    this.isDetailBtn = opt;
    this.isBtnUpdDisabled = opt;
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  doDelete() {
    this.generalService.deleteLstReason(this.selectedItem?.reasonid).subscribe(res => {
      if (res && res === 'lst_Party.error.errorpk') {
        this.notificationService.showNotification(Constant.ERROR, 'Dữ liệu này đã được sử dụng ở chức năng khác, bạn không thể xóa');
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
        this.loadDataFromServer();
      }
    }, error => {
      this.handleErr(error.error.text);
    });
  }
  
  handleErr(text) {
    const msg = this.generalService.jsonErrorDM[text];
    this.notificationService.showNotification(Constant.ERROR, msg ? msg : text);
  }

  showEditForm(): void {
    this.data = {...this.selectedItem};
    this.data.isEdit = true;
    this.isVisibleCreate = true;
  }
  
  showCreateForm(): void {
    this.data = {
      reasonid: '',
      reasonname: '',
      deciid: '',
      isEdit : false
    };
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
