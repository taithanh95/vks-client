import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NotificationService} from '../../../../../../service/notification.service';
import {Router} from '@angular/router';
import {ConstantService} from '../../../../../../service/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from '../../../../../../service/date-change.service';
import {GeneralService} from '../../../../../../service/general-service';
import {AppConfigService} from '../../../../../../../app-config.service';
import {WebUtilities} from '../../../../../../shared/utils/qla-utils.class';
import {Constant} from '../../../../../../shared/constants/constant.class';
import {NzTableQueryParams} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-appeal',
  templateUrl: './appeal.component.html',
  styleUrls: ['./appeal.component.scss']
})
export class AppealComponent implements OnInit {
  @Input() filterItem: any;

  /* PAGE */
  page: any;
  total: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;

  /* DATA PAGE */
  datas = [];

  /* SEARCH FILTER*/
  isCollapse = true;
  loading = false;
  enabledAutoLoadData = false; // Tự động lấy dữ liệu sau khi tải trang
  selectedItem: any;
  lstSpp: any[];
  userfor: any;
  sppid: any;
  data: any;

  isVisibleDetail: boolean;
  /* Button display*/
  isUpdBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isBtnUpdDisabled: boolean;

  /* DIALOG CONFIRM */
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;


  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private constantService: ConstantService,
    private cookieService: CookieService,
    private datechangeService: DateChangeService,
    private generalService: GeneralService,
    private configService: AppConfigService
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.resetPage();
    this.resetBtn();
  }

  resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 20;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  closeDetail(isClose: boolean): void {
    this.isVisibleDetail = isClose;
  }

  showDetail(): void {
    this.data = this.selectedItem;
    this.isVisibleDetail = true;
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
      this.generalService.searchLookupAppeal(payload).subscribe(res => {
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

  onValueTodate(event: any) {
    this.data.todate = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onValueFDate(event: any) {
    this.filterItem.fromdateappeal = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.todateappeal = this.datechangeService.onDateValueChange(event);
  }

  checkDate(): void {
    if (this.filterItem.fromdateappeal && this.filterItem.todateappeal) {
      const fromdate = new Date(this.filterItem.fromdateappeal);
      const todate = new Date(this.filterItem.todateappeal);
      const count = WebUtilities.calculateDiff(fromdate, todate);
      if (count > 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày kháng cáo đến ngày phải lớn hơn hoặc bằng Ngày kháng cáo từ ngày');
        this.filterItem.todateappeal = null;
      }
    }
  }
}
