import {Component, Input, OnInit} from '@angular/core';
import {NotificationService} from "../../../../../../service/notification.service";
import {GeneralService} from "../../../../../../service/general-service";
import {AppConfigService} from "../../../../../../../app-config.service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {CategoriesService} from "../../../../../../service/categories.service";
import {WebUtilities} from "../../../../../../shared/utils/qla-utils.class";
import {Constant} from "../../../../../../shared/constants/constant.class";
import {NzTableQueryParams} from "ng-zorro-antd/table";

@Component({
  selector: 'app-law',
  templateUrl: './law.component.html',
  styleUrls: ['./law.component.scss']
})
export class LawComponent implements OnInit {
  @Input() filterItem: any;
  /* Show Dialogs*/
  isVisibleDetail: boolean;
  isVisiblePopupLaw: boolean;
  /*page*/
  page: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;
  total: any;
  loading: boolean;
  enabledAutoLoadData = false;

  /*search filter*/
  datas: any[];
  selectedItem: any;
  sppId: any;
  data: any;

  /* Button display*/
  isUpdBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isBtnUpdDisabled: boolean;

  lstSpps: any;
  lstLawGroup: any;
  atxResultLaws: any;

  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private datechangeService: DateChangeService,
    private categoriesService: CategoriesService,
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.resetBtn();
    this.resetPage();
    this.onInputLawGroup();
  }

  resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 10;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  resetBtn() {
    this.selectedItem = null;
  }

  doSearch() {
    this.enabledAutoLoadData = true;
    this.resetBtn();
    this.resetPage();
    this.loadDataFromServer();
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.filterItem.pageSize = this.defaultPage;
      this.filterItem.rowIndex = this.defaultPage * (this.pageIndex - 1);
      this.filterItem.sortOrder = 'ASC';
      const payload = {
        ...this.filterItem,
        sppidList: this.filterItem?.sppid,
        sppid: '',
      }
      this.loading = true;
      this.generalService.searchLookupLaw(payload).subscribe(res => {
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

  onRowSelect(item) {
    this.selectedItem = item;
    this.clearSelection(false);
  }


  clearSelection(opt: boolean) {
    this.isDeleteBtn = opt;
    this.isUpdBtn = opt;
    this.isDetailBtn = opt;
    this.isBtnUpdDisabled = opt;
  }

  onValueFDate(event: any) {
    this.filterItem.fromdatecen = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.todatecen = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  showPopupLaw(): void {
    this.isVisiblePopupLaw = true;
  }

  closeDetail(isClose: boolean): void {
    this.isVisibleDetail = isClose;
  }

  showDetail(): void {
    this.data = this.selectedItem;
    this.isVisibleDetail = true;
  }

  closePopupLaw = ($event: boolean) => {
    this.isVisiblePopupLaw = $event;
  }

  submitPopupLaw = ($event) => {
    this.isVisiblePopupLaw = false;
    let law = $event;
    this.filterItem.lawid = law.LAWID;
    this.filterItem.item = law.ITEM;
    this.filterItem.point = law.POINT;
  }

  getListLawWithCode(value: any): void {
    if (value === ' ') {
      value = '0';
    }
    this.categoriesService.getListLawAutoComplete(value, this.filterItem.codeid).subscribe(res => {
      this.atxResultLaws = res;
    });
  }

  onInputLawGroup(): void {
    this.generalService.searchCode('').subscribe(res => {
      if (res) {
        this.lstLawGroup = res.datas;
      } else {
        this.lstLawGroup = [];
      }
    });
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);
}
