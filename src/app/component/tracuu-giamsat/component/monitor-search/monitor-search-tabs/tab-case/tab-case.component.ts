import {Component, Input, OnInit} from '@angular/core';
import {NotificationService} from "../../../../../../service/notification.service";
import {GeneralService} from "../../../../../../service/general-service";
import {AppConfigService} from "../../../../../../../app-config.service";
import {DateChangeService} from "../../../../../../service/date-change.service";
import {DateService} from "../../../../../../common/util/date.service";
import {WebUtilities} from "../../../../../../shared/utils/qla-utils.class";
import {CategoriesService} from "../../../../../../service/categories.service";

@Component({
  selector: 'app-tab-case',
  templateUrl: './tab-case.component.html',
  styleUrls: ['./tab-case.component.scss']
})
export class TabCaseComponent implements OnInit {
  @Input() filterItem: any;
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
  lstLawGroup: any;
  atxResultLaws: any;
  lstLawGroupChap: any;
  OPTION_CASE_TYPE = ['2', '3', '4', '5', '6', '7'];

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
    this.onInputLawGroup();
    this.onInputLawGroupChap();

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
      caseTypeReport: '1',
      usefor: 'G1',
      regfdate: this.dateService.getDayOfPreviousYear(),
      regtdate: this.dateService.getCurrentDate(),
      typecase: 'L1',
      codeid: '02'
    };
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
    this.filterItem.regfdate = this.datechangeService.onDateValueChange(event);
  }

  onValueTDate(event: any) {
    this.filterItem.regtdate = this.datechangeService.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  showResult(): void {
    this.isVisibleResult = true;
  }

  closeModalResult = ($event: boolean) => this.isVisibleResult = $event;

  onInputLawGroup(): void {
    this.generalService.searchCode('').subscribe(res => {
      if (res) {
        this.lstLawGroup = res.datas;
      } else {
        this.lstLawGroup = [];
      }
    });
  }

  onInputAtxLawWithCode(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.atxResultLaws = [];
    } else {
      if (value === ' ') {
        value = '0';
      }
      this.categoriesService.getListLawAutoComplete(value, this.filterItem.codeid).subscribe(res => {
        this.atxResultLaws = res;
      });
    }
  }

  getListLawWithCode(value: any): void {
    if (value === ' ') {
      value = '0';
    }
    this.categoriesService.getListLawAutoComplete(value, this.filterItem.codeid).subscribe(res => {
      this.atxResultLaws = res;
    });
  }

  toLawOption(l) {
    return `${l.lawid === null ? '' : 'Điều ' + l.lawid}${l.item === null || l.item === 0 ? '' : (' - Khoản ' + l.item)}${l.point === null ? '' : (' - Điểm ' + l.point)}${l.lawid === null ? '' : ' - ' + l.lawname}`;
  }

  onInputLawGroupChap(): void {
    this.generalService.getListLawGroupChap().subscribe(res => {
      this.lstLawGroupChap = res;
    });
  }
}
