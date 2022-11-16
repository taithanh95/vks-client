import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AppConfigService } from '../../../../../../app-config.service';
import { DateChangeService } from '../../../../../service/date-change.service';
import { GeneralService } from '../../../../../service/general-service';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

interface filter {
  casecode?: string;
  casename?: string;
  crimdatef?: Date | string;
  crimdatet?: Date | string;
}

@Component({
  selector: 'app-search-dialogs',
  templateUrl: './search-dialogs.component.html',
  styleUrls: ['./search-dialogs.component.scss']
})
export class SearchDialogsComponent implements OnInit, OnChanges {

  @Input() isVisible: boolean;
  @Input() casecodeout: string;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  filterItem: filter;
  sppid: string;

  // GRIDVIEW
  loading: boolean;
  enabledAutoLoadData: boolean;
  datas: any;
  selected: any;

  // PAGE
  page: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;
  total: any;


  data: any;
  isCollapse = true;
  isSubmited = true;

  constructor(
    private datechangeService: DateChangeService,
    private generalService: GeneralService,
    private configService: AppConfigService
  ) {
    this.sppid = WebUtilities.getLoggedSppId();
  }

  ngOnChanges(): void {
    if(this.isVisible) {
      this.resetPage();
    }
  }

  ngOnInit(): void {
    this.resetPage();
  }

  resetPage() {
    this.datas = null;
    this.isSubmited = true;
    this.pageSize = this.configService.getConfig().pageSize;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.pageIndex = 1;
    this.page = 20;
    this.selected = null;
    this.filterItem = {
      casecode: '',
      casename: '',
      crimdatef: null,
      crimdatet: null,
    };
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.loading = true;
      const payload = {
        ...this.filterItem,
        pageSize: this.defaultPage,
        rowIndex: this.defaultPage * (this.pageIndex - 1),
        sppid: this.sppid,
        temp: 'casedialogout',
        casecodeout: this.casecodeout
      }
      this.generalService.searchListSppSplit(payload).subscribe(res => {
        this.loading = false;
        this.datas = res;
        if (this.datas.length != 0)
          this.total = this.datas[0].ROWCOUNT;
        else
          this.total = 0;
      }, error => {
        alert('Lỗi dữ liệu');
      });
    }
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.loadDataFromServer();
  }

  doSearch() {
    this.pageIndex = 1;
    this.enabledAutoLoadData = true;
    this.isSubmited = true;
    this.loadDataFromServer();
  }

  onRowSelect(selectedItem) {
    for (const item of this.datas) {
      item.selected = false;
    }
    selectedItem.selected = true;
    this.isSubmited = false;
    this.selected = selectedItem;
  }

  toggleCollapse = () => this.isCollapse = !this.isCollapse;

  changeValueDate($event, item) {
    this.data[item] = this.datechangeService.onDateValueChange($event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  handleCancel() {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleOk() {
    if (this.selected) {
      this.submitForm.emit(WebUtilities.toLowercaseFieldsWithoutConvertBoolean(this.selected));
      this.isVisible = false;
    }
  }
}
