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
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
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
  lstPolice: any[];
  lstSpp: any[];
  lstSpc: any[];
  userfor: any;
  sppid: any;
  data: any;
  isSpinning: boolean;
  transfromS: any;
  transToS: any;

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
      if (this.filterItem?.select == 'CQDT-VKS') {
        this.transfromS = this.filterItem?.transfrom?.POLICEID;
        this.transToS = this.filterItem?.transto?.SPPID;
      } else if (this.filterItem?.select == 'TA-VKS') {
        this.transfromS = this.filterItem?.transfrom?.SPCID;
        this.transToS = this.filterItem?.transto?.SPPID;
      } else if (this.filterItem?.select == 'VKS-CQDT') {
        this.transfromS = this.filterItem?.transfrom?.SPPID;
        this.transToS = this.filterItem?.transto?.POLICEID;
      } else if (this.filterItem?.select == 'VKS-TA') {
        this.transfromS = this.filterItem?.transfrom?.SPPID;
        this.transToS = this.filterItem?.transto?.SPCID;
      } else {
        this.transfromS = this.filterItem?.transfrom?.SPPID;
        this.transToS = this.filterItem?.transto?.SPPID;
      }
      const payload = {
        ...this.filterItem,
        sppidList: this.filterItem?.sppid,
        transfrom: this.transfromS,
        transto: this.transToS,
        sppid: '',
      }
      this.loading = true;
      this.generalService.searchLookupTransfer(payload).subscribe(res => {
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
    this.data.todatecen = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onValueFDate(event: any) {
    this.filterItem.fromdatetrans = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.todatetrans = this.datechangeService.onDateValueChange(event);
  }

  checkDate(): void {
    if (this.filterItem.fromdatetrans && this.filterItem.todatetrans) {
      const fromdate = new Date(this.filterItem.fromdatetrans);
      const todate = new Date(this.filterItem.todatetrans);
      const count = WebUtilities.calculateDiff(fromdate, todate);
      if (count > 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày bàn giao đến ngày phải lớn hơn hoặc bằng Ngày bàn giao từ ngày');
        this.filterItem.todatetrans = null;
      }
    }
  }

  onInputPolice(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstPolice = [];
    } else {
      this.generalService.getLstPolice(value).subscribe(res => {
        this.lstPolice = res;
      });
    }
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

  onInputSpc(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpc = [];
    } else {
      this.generalService.getListSpcByQuery({
        query: value
      }).subscribe(res => {
        this.lstSpc = res;
      });
    }
  }

  resetParam(): void {
    this.lstPolice = [];
    this.lstSpp = [];
    this.lstSpc = [];
    this.filterItem.transfrom = '';
    this.filterItem.transto = '';
  }

  selectChange(value: string): void {
    this.isSpinning = true;
    this.resetParam();
    if (value) {
      switch (value) {
        case 'CQDT-VKS' || 'VKS-CQDT':
          this.generalService.getLstPolice('').subscribe(res => {
            this.lstPolice = res;
            this.isSpinning = false;
          });
          this.generalService.getChildSPPSearch('').subscribe(res => {
            this.lstSpp = res;
            this.isSpinning = false;
          });
          break;

        case 'TA-VKS' || 'VKS-TA':
          this.generalService.getChildSPPSearch('').subscribe(res => {
            this.lstSpp = res;
            this.isSpinning = false;
          });
          this.generalService.getListSpcByQuery({query: ''}).subscribe(res => {
            this.lstSpc = res;
            this.isSpinning = false;
          });
          break;
        case 'VKS-VKS':
          this.generalService.getChildSPPSearch('').subscribe(res => {
            this.lstSpp = res;
            this.isSpinning = false;
          });
          break;
      }
    } else {
      this.isSpinning = false;
    }
  }
}
