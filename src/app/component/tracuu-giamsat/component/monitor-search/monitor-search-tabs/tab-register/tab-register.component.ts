import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../../../../../service/notification.service";
import {GeneralService} from "../../../../../../service/general-service";
import {AppConfigService} from "../../../../../../../app-config.service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {DateService} from "../../../../../../common/util/date.service";
import {WebUtilities} from "../../../../../../shared/utils/qla-utils.class";

@Component({
  selector: 'app-tab-register',
  templateUrl: './tab-register.component.html',
  styleUrls: ['./tab-register.component.scss']
})
export class TabRegisterComponent implements OnInit {
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
  lstInsp: any;

  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private datechangeService: DateChangeService,
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
      typeregister: '1',
      usefor: 'G1',
      fdateRegister: this.dateService.getDayOfPreviousYear(),
      tdateRegister: this.dateService.getCurrentDate(),
      flagdate: this.dateService.getCurrentDate()
    };
  }

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpps = [];
    } else {
      this.generalService.getChildSPPSearch(value).subscribe(res => {
        this.lstSpps = res;
      });
    }
  }

  onInputInspector(value: any): void {
    if (value === ' ') value = '0';
    const underlevel = localStorage.getItem("UNDERLEVEL_TRACUU");
    this.generalService.getLstInspectorByQuery(value, underlevel, this.sppId).subscribe(res => {
      this.lstInsp = res;
    });
  }

  resetBtn() {
    this.selectedItem = null;
  }

  onValueFDate(event: any) {
    this.filterItem.fdateRegister = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.tdateRegister = this.datechangeService.onDateValueChange(event);
  }

  onValueFlagDate(event: any) {
    this.filterItem.flagdate = this.datechangeService.onDateValueChange(event);
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
