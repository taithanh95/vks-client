import {Component, Input, OnInit} from '@angular/core';
import {NotificationService} from "../../../../../../service/notification.service";
import {GeneralService} from "../../../../../../service/general-service";
import {AppConfigService} from "../../../../../../../app-config.service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {CategoriesService} from "../../../../../../service/categories.service";
import {DateService} from "../../../../../../common/util/date.service";
import {WebUtilities} from "../../../../../../shared/utils/qla-utils.class";

@Component({
  selector: 'app-tab-law',
  templateUrl: './tab-law.component.html',
  styleUrls: ['./tab-law.component.scss']
})
export class TabLawComponent implements OnInit {
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

  /* Button display*/
  isUpdBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isBtnUpdDisabled: boolean;

  lstSpps: any;

  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private datechangeService: DateChangeService,
    private categoriesService: CategoriesService,
    private dateService: DateService
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
      userforLaw: 'G1',
      fdateLaw: this.dateService.getDayOfPreviousYear(),
      tdateLaw: this.dateService.getCurrentDate(),
      appliedLaws: ''
    };
  }

  resetBtn() {
    this.selectedItem = null;
  }

  onValueFDate(event: any) {
    this.filterItem.fdateLaw = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.tdateLaw = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  showResult(): void {
    this.isVisibleResult = true;
  }

  closeModalResult = ($event: boolean) => this.isVisibleResult = $event;
}
