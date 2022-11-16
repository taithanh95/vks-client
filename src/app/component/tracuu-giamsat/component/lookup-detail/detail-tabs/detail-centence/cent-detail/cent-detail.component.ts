import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Constant} from "../../../../../../../shared/constants/constant.class";
import {PageResponse} from "../../../../../../../common/model/base.model";
import {NotificationService} from "../../../../../../../service/notification.service";
import {Router} from "@angular/router";
import {ConstantService} from "../../../../../../../service/constant.service";
import {CookieService} from "ngx-cookie-service";
import {DateChangeService} from "../../../../../../../service/date-change.service";
import {GeneralService} from "../../../../../../../service/general-service";
import {AppConfigService} from "../../../../../../../../app-config.service";

@Component({
  selector: 'app-cent-detail',
  templateUrl: './cent-detail.component.html',
  styleUrls: ['./cent-detail.component.scss']
})
export class CentDetailComponent implements OnInit {
  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  loading = false;
  /** PAGE */
  page: any;
  total: any;
  pageSize: any;
  defaultPage: any;
  rowIndex: any;
  pageResponse: PageResponse;
  /** Data*/
  lstCentence: any;
  lstCentLaw: any;
  lstStatistica: any;
  lstStatisticc: any;
  value: any;

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
    this.doSearch();
    this.resetPage();
  }

  resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 10;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.rowIndex = 1;
  }

  doSearch() {
    this.getListCentence();
    this.getListCentLaw();
    this.getListStatistica();
    this.getListStatisticc();
  }

  getListCentence(): void {
    this.loading = true;
    const payload = {
      pageSize: 10,
      rowIndex: 0,
      centcode: this.data.CENTCODE
    };
    this.generalService.getListCentenceDetail(payload).subscribe(res => {
      this.loading = false;
      this.lstCentence = res;
      this.value = this.lstCentence[0];
      console.log('value:  ', this.value);
      if (this.lstCentence.length != 0)
        this.total = this.lstCentence[0].ROWCOUNT;
      else
        this.total = 0;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error);
    });
  }

  getListCentLaw(): void {
    this.loading = true;
    const payload = {
      pageSize: 10,
      rowIndex: 0,
      centcode: this.data.CENTCODE
    };
    this.generalService.getListCentLawDetail(payload).subscribe(res => {
      this.loading = false;
      this.lstCentLaw = res;
      if (this.lstCentLaw.length != 0)
        this.total = this.lstCentLaw[0].ROWCOUNT;
      else
        this.total = 0;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error);
    });
  }

  getListStatistica(): void {
    this.loading = true;
    const payload = {
      pageSize: 10,
      rowIndex: 0,
      centcode: this.data.CENTCODE
    };
    this.generalService.getListStatisticaDetail(payload).subscribe(res => {
      this.loading = false;
      this.lstStatistica = res;
      if (this.lstStatistica.length != 0)
        this.total = this.lstStatistica[0].ROWCOUNT;
      else
        this.total = 0;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error);
    });
  }

  getListStatisticc(): void {
    this.loading = true;
    const payload = {
      pageSize: 10,
      rowIndex: 0,
      centcode: this.data.CENTCODE
    };
    this.generalService.getListStatisticcDetail(payload).subscribe(res => {
      this.loading = false;
      this.lstStatisticc = res;
      if (this.lstStatisticc.length != 0)
        this.total = this.lstStatisticc[0].ROWCOUNT;
      else
        this.total = 0;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error);
    });
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);
}
