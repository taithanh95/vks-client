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
  selector: 'app-detail-against',
  templateUrl: './detail-against.component.html',
  styleUrls: ['./detail-against.component.scss']
})
export class DetailAgainstComponent implements OnInit {
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
  lstAgainst: any;
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
    this.getListAgianst();
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
    this.getListAgianst();
  }


  getListAgianst(): void {
    const payload = {
      pageSize: this.defaultPage,
      rowIndex: this.defaultPage * (this.rowIndex - 1),
      casecode: this.tabs.CASECODE,
      regicode: this.tabs.REGICODE
    };
    this.generalService.getListLookupAgainst(payload).subscribe(res => {
      this.loading = false;
      this.lstAgainst = res;
      if (this.lstAgainst.length != 0)
        this.total = this.lstAgainst[0].ROWCOUNT;
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

  showDetail(): void {
    this.isVisibleDetail = true;
    this.data = this.selectedItem;
  }

  closeModalDetail = ($event: boolean) => this.isVisibleDetail = $event;

  f(f): any {
    return f === 'G4' ? 'Phúc thẩm' :
            f === 'G5' ? 'Giám đốc thẩm/Tái thẩm' : null
  }
}

