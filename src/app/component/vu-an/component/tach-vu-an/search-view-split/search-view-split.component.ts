import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { debounceTime } from 'rxjs/operators';
import { AppConfigService } from '../../../../../../app-config.service';
import { CategoriesService } from '../../../../../service/categories.service';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { SppService } from '../../../../../service/spp-service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

interface location { remark?: string; locaid?: string | number; }
interface nation { natiId?: string; remark?: string; name?: string; }
interface country { counid?: string; remark?: string; counname?: string; }
interface knowledge { levelid?: string; levelname?: string; }
interface sppAccuSplit {
  choicetype?: string;
  choice?: string | number;
  casecode?: string;
  casename?: string;
  fullname?: string;
  identify?: number | string;
  atxtLocaid?: string | location;
  atxtAddressid?: string | location;
  atxtNatiid?: string | nation;
  atxtCounid?: string | country;
  atxtLevelid?: string | knowledge;
}
enum choiceDetail {
  ACCUS_SPLIT_YET = 1, // Chưa tách bị can bị cáo
  ACCUS_SPLIT, //Tách bị can bị cáo
  CASE_SPLIT_YET, // Chưa tách vụ án
  CASE_SPLIT, //Tách vụ án
}
@Component({
  selector: 'app-search-view-split',
  templateUrl: './search-view-split.component.html',
  styleUrls: ['./search-view-split.component.scss']
})
export class SearchViewSplitComponent implements OnInit, OnDestroy {
  // ITEM
  filterItem: sppAccuSplit;
  sppid: string;
  dataDetail: any;
  dataEdit: any[] = [];

  // LIST COMBOBOX
  lstLocation: location[];
  lstAddress: location[];
  lstNation: nation[];
  lstCountry: country[];
  lstKnowledge: knowledge[];

  // GRIDVIEW
  loading: boolean;
  enabledAutoLoadData: boolean;
  datas: any;
  selectedItems: any[] = [];

  // PAGE
  page: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;
  total: any;

  /* Button display*/
  isSelBtnDisable: boolean;
  isUpdBtnDisable: boolean;
  isDelBtnDisable: boolean;
  isDetailBtnDisable: boolean;

  /* selection */
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<any>();
  defaultCheckedId = new Set<any>();

  /* VISIBLE */
  isVisibleDetail: boolean;
  isVisibleEdit: boolean;

  /* VISIBLE TABLES */
  TYPE: choiceDetail;
  isVisibleTable: boolean;

  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private router: Router,
    private notificationService: NotificationService,
    private cookieService: CookieService,
    private sppService: SppService
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
    this.getListCategories();
    this.resetBtn();
  }
  ngOnDestroy(): void {
    this.dataEdit = [];
    // nothing
  }

  ngOnInit() {
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
  }

  async onInputLocaname(e: any) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstLocation = [];
    } else {
      this.categoriesService.getListLocation(value).subscribe(res => {
        this.lstLocation = res;
      });
    }
  }

  async onInputRemark(e: any) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstAddress = [];
    } else {
      this.categoriesService.getListLocation(value).subscribe(res => {
        this.lstAddress = res;
      });
    }
  }

  async getListCategories() {
    this.categoriesService.getListNation({ size: 100 }).subscribe(res => {
      this.lstNation = res.datas;
    });
    this.categoriesService.getListKnowledge({ size: 100 }).subscribe(res => {
      this.lstKnowledge = res.datas;
    });
    this.categoriesService.getListCountry({ size: 300 }).subscribe(res => {
      this.lstCountry = res.datas;
    });
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
      this.generalService.searchListSppSplit(payload).subscribe(res => {
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

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.loadDataFromServer();
  }

  doSearch() {
    this.isVisibleTable = true;
    this.enabledAutoLoadData = true;
    this.resetBtn();
    this.resetTable();
    this.loadDataFromServer();
  }

  toggleTable() {
    this.isVisibleTable = false;
    this.enabledAutoLoadData = false;
    this.resetBtn();
  }

  resetTable() {
    this.pageIndex = 1;
    this.datas = [];
    this.checkTypeChoice(this.filterItem.choicetype, this.filterItem.choice);
    this.resetCheck();
  }

  resetCheck() {
    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId.clear();
  }

  checkTypeChoice(choicetype, choice) {
    if (choicetype === 'b') {
      if (choice === '1') {
        this.TYPE = choiceDetail.ACCUS_SPLIT_YET
      } else {
        this.TYPE = choiceDetail.ACCUS_SPLIT
      }
    } else {
      if (choice === '1') {
        this.TYPE = choiceDetail.CASE_SPLIT_YET
      } else {
        this.TYPE = choiceDetail.CASE_SPLIT
      }
    }
  }

  doDelete() {
    const payload = {
      sppcasesplit: this.selectedItems,
      choiceType: this.filterItem.choicetype
    }
    this.generalService.deleteListSppSplit(payload).pipe(debounceTime(500)).subscribe(res => {
      if (!res) {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
        this.doSearch();
      } else {
        this.notificationService.showNotification(Constant.ERROR, res);
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  onChangeSelected(item, check) {
    item.selected = check;
    if (!check) {
      const index = this.selectedItems.findIndex((element) => element.ACCUCODE === item.ACCUCODE)
      if (index !== -1) {
        this.selectedItems.splice(index, 1)[0]
      }
    } else if (!this.selectedItems.includes(item)) {
      this.selectedItems.push(item);
    }
    this.toggleButtons();
  }

  onRowSelect(item, check) {
    this.onItemChecked(item, check === undefined ? true : check)
  }

  toggleButtons() {
    if (this.selectedItems && this.selectedItems.length > 0) {
      this.isDelBtnDisable = false;
      this.isUpdBtnDisable = this.filterItem.choice === '1' ? false : true;
      this.isDetailBtnDisable = this.selectedItems.length > 1 ? true : false;
    } else {
      this.isDelBtnDisable = true;
      this.isUpdBtnDisable = true;
      this.isDetailBtnDisable = true;
    }
  }

  resetBtn() {
    this.selectedItems = [];
    this.isDelBtnDisable = true;
    this.isUpdBtnDisable = true;
    this.isDetailBtnDisable = true;
  }

  updateCheckedSet(item: any, checked: boolean): void {
    this.onChangeSelected(item, checked);
    if (checked) {
      this.setOfCheckedId.add(item);
    } else {
      this.setOfCheckedId.delete(item);
    }
  }

  onItemChecked(item: any, checked: boolean): void {
    this.updateCheckedSet(item, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.datas.forEach(item => this.updateCheckedSet(item, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.datas.every(item => this.setOfCheckedId.has(item));
    this.indeterminate = this.datas.some(item => this.setOfCheckedId.has(item)) && !this.checked;
  }

  openDetail(): void {
    if (this.selectedItems.length > 0) {
      this.dataDetail = this.selectedItems[0];
      this.isVisibleDetail = true;
      this.dataDetail.TYPE = this.TYPE;
    }
  }

  closeDetail = ($event) => this.isVisibleDetail = false;

  showScreenEdit(): void {
    this.router.navigate(['/admin/vu-an/search/tach-vu-an/update']);
    this.selectedItems.forEach(element => this.dataEdit.push(WebUtilities.toLowercaseFields(element)));
    this.sppService.setCurrentSppCaseSplit(this.dataEdit);
    this.cookieService.set(Constant.SPP_CHOICETYPE, this.filterItem.choicetype);
    this.isVisibleEdit = true;
  }

}

