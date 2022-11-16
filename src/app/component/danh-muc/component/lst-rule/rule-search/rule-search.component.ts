import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AppConfigService } from '../../../../../../app-config.service';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-rule-search',
  templateUrl: './rule-search.component.html',
  styleUrls: ['./rule-search.component.scss']
})
export class RuleSearchComponent implements OnInit {

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

  /* Button display*/
  isUpdBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isBtnUpdDisabled: boolean;

  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService
  ) {
    this.resetFilter();
  }

  ngOnInit(): void {
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
      caseType: '',
      userFor: '',
      thoi_han_tu: '',
      thoi_han_den: '',
      setUnit: ''
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
      this.generalService.getLstRule(payload).subscribe(res => {
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
    if (this.handleValidTime())
      return;
    this.enabledAutoLoadData = true;
    this.resetBtn();
    this.resetPage();
    this.loadDataFromServer();
  }

  handleValidTime() {
    if (this.filterItem.thoihan_tu && this.filterItem.thoihan_den
      && +this.filterItem.thoihan_tu > +this.filterItem.thoihan_tu) {
        this.notificationService.showNotification(Constant.ERROR, 'Thời hạn từ phải nhỏ hơn thời hạn đến');
        return true;
      }
    return false;
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
    this.generalService.deleteLstRule(this.selectedItem?.caseType,this.selectedItem?.userFor).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, 'Loại vụ án và giai đoạn áp dụng đã có trong CSDL');
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
    this.data = {...this.selectedItem, isEdit : true};
    this.isVisibleCreate = true;
  }
  
  showCreateForm(): void {
    this.data = {
      caseType: 'L1',
      userFor: 'G1',
      setUnit: 'DAY',
      ruleTime: '',
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
