import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../../../../../service/notification.service";
import {GeneralService} from "../../../../../../service/general-service";
import {AppConfigService} from "../../../../../../../app-config.service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {DateService} from "../../../../../../common/util/date.service";
import {WebUtilities} from "../../../../../../shared/utils/qla-utils.class";
import {CategoriesService} from "../../../../../../service/categories.service";

@Component({
  selector: 'app-tab-decision',
  templateUrl: './tab-decision.component.html',
  styleUrls: ['./tab-decision.component.scss']
})
export class TabDecisionComponent implements OnInit {
  filterItem: any;
  /* Show Dialogs*/
  isVisibleResult: boolean;
  /*page*/
  page: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;
  total: any;
  loading: boolean;

  /*search filter*/
  datas: any[];
  selectedItem: any;
  sppId: any;
  data: any;

  lstDeci: any;
  lstReasons: any[];

  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private datechangeService: DateChangeService,
    private dateService: DateService,
    private categoriesService: CategoriesService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
  }

  ngOnInit(): void {
    this.resetFilter();
    this.resetPage();
  }

  resetPage() {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = 10;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
  }

  resetFilter() {
    this.resetBtn();
    this.filterItem = {
      sppid: this.sppId,
      typeDecision: '1',
      usefor: 'G1',
      fdateDecision: this.dateService.getDayOfPreviousYear(),
      tdateDecision: this.dateService.getCurrentDate(),
      utildate: this.dateService.getCurrentDate()
    };
  }

  resetBtn() {
    this.selectedItem = null;
  }

  onValueFDate(event: any) {
    this.filterItem.fdateDecision = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.tdateDecision = this.datechangeService.onDateValueChange(event);
  }

  onValueUtilDate(event: any) {
    this.filterItem.utildate = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  showResult(): void {
    this.isVisibleResult = true;
  }

  closeModalResult = ($event: boolean) => this.isVisibleResult = $event;

  onInputDeci(e) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstDeci = [];
    } else {
      this.categoriesService.getDeciAutocomplete(value).subscribe(res => {
        this.lstDeci = res;
      });
    }
  }

  deciChange($event: any) {
    this.filterItem.reasonid = '';
    if (!this.filterItem.deciid) {
      this.lstReasons = [];
      return;
    }
    this.getListReason(this.filterItem.deciid);
  }

  getListReason(deciId: any) {
    let payload = {size: 100, deciId: deciId};
    if (!deciId) delete payload.deciId;
    this.categoriesService.getListReason(payload).subscribe(res => {
      this.lstReasons = res ? res.datas : [];
    });
  }
}
