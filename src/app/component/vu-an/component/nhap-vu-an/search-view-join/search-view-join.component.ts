import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { AppConfigService } from '../../../../../../app-config.service';
import { DateChangeService } from '../../../../../service/date-change.service';
import { GeneralService } from '../../../../../service/general-service';
import { SppService } from '../../../../../service/spp-service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-search-view-join',
  templateUrl: './search-view-join.component.html',
  styleUrls: ['./search-view-join.component.scss']
})
export class SearchViewJoinComponent implements OnInit {

  /**ITEM */
  filterItem: any;
  sppid: string;

  /**PAGE */
  page: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;
  total: any;

  /**GRID VIEW*/
  isVisibleTable: boolean;
  enabledAutoLoadData: boolean;
  loading: boolean;
  datas: any;
  
  /**ISVISBLE BUTTON */
  isDelBtnDisable: boolean;
  isUpdBtnDisable: boolean;
  isDetailBtnDisable: boolean;

  /**DATA */
  selectedItems: any;
  isVisibleEdit: boolean;

  /** MODA DETAIL */
  isVisibleDetail: boolean;
  dataDetail: any;

  constructor(
    private router: Router,
    private configService: AppConfigService,
    private cookieService : CookieService,
    private datechangeService: DateChangeService,
    private generalService: GeneralService,
    private sppService: SppService
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
   }

  ngOnInit(): void {
    if (localStorage.getItem(Constant.USER_INFO) === null
      || localStorage.getItem(Constant.USERID) !== this.cookieService.get(Constant.USERNAME)) {
      localStorage.clear();
      this.router.navigate(['login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } });
    }
    this.pageSize = this.configService.getConfig().pageSize;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
    this.page = 20;
    this.filterItem = {
      choicetype: 'b',
      choice: '1'
    };
    this.resetBtn();
  }

  doSearch() {
    this.isVisibleTable = true;
    this.enabledAutoLoadData = true;
    this.resetBtn();
    this.loadDataFromServer();
  }

  resetBtn() {
    this.selectedItems = null;
    this.isDelBtnDisable = true;
    this.isUpdBtnDisable = true;
    this.isDetailBtnDisable = true;
  }

  onChangeBtn() {
    this.isUpdBtnDisable = false;
    this.isDetailBtnDisable = false;
  }

  toggleTable(){
    this.isVisibleTable = false;
    this.resetBtn();
  } 

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.loadDataFromServer();
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.loading = true;
      const payload = {
        ...this.filterItem,
        pageSize: this.defaultPage,
        rowIndex: this.defaultPage * (this.pageIndex - 1),
        sppid: this.sppid
      }
      this.generalService.searchListSppJoin(payload).subscribe(res => {
        this.loading = false;
        this.datas = res;
        if (this.datas.length != 0)
          this.total = this.datas[0].ROWCOUNT;
        else
          this.total = 0;
      }, error => {
        alert('Lỗi dữ liệu');
      });
    }
  }

  onRowSelect(item) {
    this.datas.forEach(i => i.selected = false)
    item.selected = true;
    this.selectedItems = item;
    this.onChangeBtn();
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  changeValueDate($event, item) {
    this.filterItem[item] = this.datechangeService.onDateValueChange($event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onOpenDetail() {
    this.dataDetail = this.selectedItems;
    this.isVisibleDetail = true;
  }

  onCloseDetail=($event)=>this.isVisibleDetail = false;

  showScreenEdit() {
    if (this.selectedItems) {
      this.router.navigate(['/admin/vu-an/search/nhap-vu-an/update']);
      const item = WebUtilities.toLowercaseFieldsWithoutConvertBoolean(this.selectedItems);
      this.sppService.setCurrentSppCaseJoin(item);
      this.isVisibleEdit = true;
    }
    
  }

}
