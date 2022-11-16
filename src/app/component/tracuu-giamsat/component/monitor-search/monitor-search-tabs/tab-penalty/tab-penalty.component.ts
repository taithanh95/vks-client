import {Component, Input, OnInit} from '@angular/core';
import {NotificationService} from "../../../../../../service/notification.service";
import {GeneralService} from "../../../../../../service/general-service";
import {AppConfigService} from "../../../../../../../app-config.service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {CategoriesService} from "../../../../../../service/categories.service";
import {DateService} from "../../../../../../common/util/date.service";
import {WebUtilities} from "../../../../../../shared/utils/qla-utils.class";

@Component({
  selector: 'app-tab-penalty',
  templateUrl: './tab-penalty.component.html',
  styleUrls: ['./tab-penalty.component.scss']
})
export class TabPenaltyComponent implements OnInit {
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
  lstPenalty: any;

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
    this.getListPenalty();
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
      userforPenalty: 'G3',
      fdatePenalty: this.dateService.getDayOfPreviousYear(),
      tdatePenalty: this.dateService.getCurrentDate(),
      penaltyid: ''
    };
  }

  resetBtn() {
    this.selectedItem = null;
  }

  onValueFDate(event: any) {
    this.filterItem.fdatePenalty = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.tdatePenalty = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  showResult(): void {
    this.isVisibleResult = true;
  }

  closeModalResult = ($event: boolean) => this.isVisibleResult = $event;

  onInputPenalty(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstPenalty = [];
    } else {
      this.generalService.getListPenaltyByQuery({
        query: value,
      }).subscribe(res => {
        this.lstPenalty = res;
      });
    }
  }

  getListPenalty(): void {
    this.generalService.getListPenaltyByQuery({
      query: ' ',
    }).subscribe(res => {
      this.loading = false;
      this.lstPenalty = res;
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }
}
