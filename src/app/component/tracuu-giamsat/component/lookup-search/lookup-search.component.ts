import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {NotificationService} from '../../../../service/notification.service';
import {Router} from '@angular/router';
import {ConstantService} from '../../../../service/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from '../../../../service/date-change.service';
import {GeneralService} from '../../../../service/general-service';
import {AppConfigService} from '../../../../../app-config.service';
import {WebUtilities} from '../../../../shared/utils/qla-utils.class';
import {Constant} from '../../../../shared/constants/constant.class';
import {NzTableQueryParams} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-lookup-search',
  templateUrl: './lookup-search.component.html',
  styleUrls: ['./lookup-search.component.scss']
})
export class LookupSearchComponent implements OnInit {

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
  filterItem: any;
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
    this.resetFilter();
    this.getListSpp();
  }

  ngOnInit(): void {
    this.resetPage();
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
      applyfor: 'C',
      sppspc: 'SPP',
      usefor: 'G4',
      select: 'CQDT-VKS',
      casetype: '',
      userfor: ''
    };
  }

  closeDetail(isClose: boolean): void {
    this.isVisibleDetail = isClose;
  }

  showDetail(): void {
    this.isVisibleDetail = true;
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

  onValueFDate(event: any) {
    this.filterItem.fromdate = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.todate = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onValueDate(event, item) {
    this.data[item] = this.datechangeService.onDateValueChange(event);
  }

  checkDate(): void {
    if (this.filterItem.fromdate && this.filterItem.todate) {
      const fromdate = new Date(this.filterItem.fromdate);
      const todate = new Date(this.filterItem.todate);
      const count = WebUtilities.calculateDiff(fromdate, todate);
      if (count > 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày khởi tố đến ngày phải lớn hơn hoặc bằng Ngày khởi tố từ ngày');
        this.filterItem.toDate = null;
      }
    }
  }

  getListSpp(): void {
    this.generalService.getChildSPPSearch('').subscribe(res => {
      this.lstSpp = res;
      this.filterItem.sppid = [this.sppid];
    })
  }

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpp = [];
    } else {
      this.generalService.getChildSPPSearch(value).subscribe(res => {
        this.lstSpp = res;
      });
    }
  }

}
