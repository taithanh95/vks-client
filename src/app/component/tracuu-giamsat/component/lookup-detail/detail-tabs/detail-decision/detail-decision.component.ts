import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../../../../../service/notification.service';
import {Router} from '@angular/router';
import {ConstantService} from '../../../../../../service/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from '../../../../../../service/date-change.service';
import {GeneralService} from '../../../../../../service/general-service';
import {AppConfigService} from '../../../../../../../app-config.service';
import {NzTabPosition} from 'ng-zorro-antd/tabs';
import {Constant} from '../../../../../../shared/constants/constant.class';
import {PageResponse} from '../../../../../../common/model/base.model';
import {NzTableQueryParams} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-detail-decision',
  templateUrl: './detail-decision.component.html',
  styleUrls: ['./detail-decision.component.scss']
})
export class DetailDecisionComponent implements OnInit {
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
  lstDecision: any;
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
    this.getListDecision();
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
    this.getListDecision();
  }


  getListDecision(): void {
    const payload = {
      pageSize: this.defaultPage,
      rowIndex: this.defaultPage * (this.rowIndex - 1),
      regicode: this.tabs.REGICODE,
      userfor: this.tabs.USERFOR
    };
    this.generalService.getListLookupDecision(payload).subscribe(res => {
      this.loading = false;
      this.lstDecision = res;
      if (this.lstDecision.length != 0)
        this.total = this.lstDecision[0].ROWCOUNT;
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
