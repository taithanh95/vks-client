import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageResponse} from '../../../../../../common/model/base.model';
import {NzTabPosition} from 'ng-zorro-antd/tabs';
import {NotificationService} from '../../../../../../service/notification.service';
import {Router} from '@angular/router';
import {ConstantService} from '../../../../../../service/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from '../../../../../../service/date-change.service';
import {GeneralService} from '../../../../../../service/general-service';
import {AppConfigService} from '../../../../../../../app-config.service';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {Constant} from '../../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-detail-transfer',
  templateUrl: './detail-transfer.component.html',
  styleUrls: ['./detail-transfer.component.scss']
})
export class DetailTransferComponent implements OnInit {
  @Input() tabs: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  /* PAGE */
  page: any;
  total: any;
  pageSize: any;
  defaultPage: any;
  rowIndex: any;
  pageResponse: PageResponse;
  position: NzTabPosition = 'left';

  /* DATA PAGE */
  data: any;
  isVisibleDetail: boolean;
  /* SEARCH FILTER*/
  loading = false;
  selectedItem: any;
  userfor: any;
  lstTransfer1: any;
  lstTransfer2: any;
  lstTransfer3: any;
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private constantService: ConstantService,
    private cookieService: CookieService,
    private datechangeService: DateChangeService,
    private generalService: GeneralService,
    private configService: AppConfigService,
  ) { }

  ngOnInit(): void {
    this.resetPage();
    this.getListTransfer1();
    this.getListTransfer2();
    this.getListTransfer3();
  }

  resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 10;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.rowIndex = 1;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex, sort, filter} = params;
    this.rowIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.getListTransfer1();
    this.getListTransfer2();
    this.getListTransfer3();
  }


  getListTransfer1(): void {
    const payload = {
      pageSize: this.defaultPage,
      rowIndex: this.defaultPage * (this.rowIndex - 1),
      casecode: this.tabs.CASECODE,
      select: 'cqdt_vks'
    };
    this.generalService.getListLookupTransfer(payload).subscribe(res => {
      this.loading = false;
      this.lstTransfer1 = res;
      if (this.lstTransfer1.length != 0)
        this.total = this.lstTransfer1[0].ROWCOUNT;
      else
        this.total = 0;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error);
    });
  }

  getListTransfer2(): void {
    const payload = {
      pageSize: this.defaultPage,
      rowIndex: this.defaultPage * (this.rowIndex - 1),
      casecode: this.tabs.CASECODE,
      select: 'vks_vks'
    };
    this.generalService.getListLookupTransfer(payload).subscribe(res => {
      this.loading = false;
      this.lstTransfer2 = res;
      if (this.lstTransfer2.length != 0)
        this.total = this.lstTransfer2[0].ROWCOUNT;
      else
        this.total = 0;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error);
    });
  }

  getListTransfer3(): void {
    const payload = {
      pageSize: this.defaultPage,
      rowIndex: this.defaultPage * (this.rowIndex - 1),
      casecode: this.tabs.CASECODE,
      select: 'vks_ta'
    };
    this.generalService.getListLookupTransfer(payload).subscribe(res => {
      this.loading = false;
      this.lstTransfer3 = res;
      if (this.lstTransfer3.length != 0)
        this.total = this.lstTransfer3[0].ROWCOUNT;
      else
        this.total = 0;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error);
    });
  }

  onRowSelect(item) {
    this.selectedItem = item;
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  showDetail(data): void {
    this.isVisibleDetail = true;
    this.data = data;
  }

  closeModalDetail = ($event: boolean) => this.isVisibleDetail = $event;

}
