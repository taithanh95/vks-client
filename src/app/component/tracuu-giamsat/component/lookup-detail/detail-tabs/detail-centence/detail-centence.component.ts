import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageResponse} from "../../../../../../common/model/base.model";
import {NzTabPosition} from "ng-zorro-antd/tabs";
import {NotificationService} from "../../../../../../service/notification.service";
import {Router} from "@angular/router";
import {ConstantService} from "../../../../../../service/constant.service";
import {CookieService} from "ngx-cookie-service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {GeneralService} from "../../../../../../service/general-service";
import {AppConfigService} from "../../../../../../../app-config.service";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Constant} from "../../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-detail-centence',
  templateUrl: './detail-centence.component.html',
  styleUrls: ['./detail-centence.component.scss']
})
export class DetailCentenceComponent implements OnInit {
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
  lstCent: any;
  col_title: any;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private constantService: ConstantService,
    private cookieService: CookieService,
    private datechangeService: DateChangeService,
    private generalService: GeneralService,
    private configService: AppConfigService,
  ) {
  }

  ngOnInit(): void {
    this.resetPage();
    this.getList();
    this.col_title = this.tabs.USERFOR == 'G1' ? 'Số kết luận' :  this.tabs.USERFOR == 'G2' ? 'Số bản cáo trạng' : 'Số bản án';
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
    this.getList();
  }

  getList(): void {
    const payload = {
      pageSize: this.defaultPage,
      rowIndex: this.defaultPage * (this.rowIndex - 1),
      regicode: this.tabs.REGICODE
    };
    this.generalService.getListLookupCentence(payload).subscribe(res => {
      this.loading = false;
      this.lstCent = res;
      if (this.lstCent.length != 0)
        this.total = this.lstCent[0].ROWCOUNT;
      else
        this.total = 0;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error);
    });
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  showDetail(data): void {
    this.isVisibleDetail = true;
    this.data = data;
  }

  closeModalDetail = ($event: boolean) => this.isVisibleDetail = $event;
}
