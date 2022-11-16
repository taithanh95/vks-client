import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CategoriesService} from "../../../../../../../service/categories.service";
import {GeneralService} from "../../../../../../../service/general-service";
import {DateChangeService} from "../../../../../../../service/date-change.service";
import {NotificationService} from "../../../../../../../service/notification.service";
import {NzTableQueryParams} from "ng-zorro-antd/table";

@Component({
  selector: 'app-grouplaw-search',
  templateUrl: './grouplaw-search.component.html',
  styleUrls: ['./grouplaw-search.component.scss']
})
export class GrouplawSearchComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() submitModal = new EventEmitter<any>();
  law: any;
  selectedLaw: any;
  loading: boolean;

  // GRID VIEW
  lstLaw: any[];
  total: number;
  pageSize: any;
  page: any;
  defaultPage: any;
  pageIndex: any;
  showSearch = false;
  isCollapse = true;
  isSelected = false;
  isLstLaw = false;

  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private datechangeService: DateChangeService,
    private notificationService: NotificationService
  ) {
    this.law = {codeid: '', groupid: '', lawid: '', item: '', point: '', lawname: '', fromdate: null, todate: null};
  }

  ngOnInit(): void {
    this.total = 1000;
    this.pageSize = 50;
    this.pageIndex = 1;
  }

  ngOnChanges() {
    if (this.isVisible) {
      this.law = {codeid: '', groupid: '', lawid: '', item: '', point: '', lawname: '', fromdate: null, todate: null};
      this.isSelected = false;
      this.isLstLaw = false;
      this.lstLaw = [];
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleOk(): void {
    this.isVisible = false;
    this.submitModal.emit(this.selectedLaw);
  }

  handleSearch() {
    this.showSearch = true;
    this.loading = true;
    this.isLstLaw = true;
    this.isSelected = false;
    const payloadLaw = {
      sortOrder: 'ASC',
      law: this.law,
      pageindex: this.pageSize * (this.pageIndex - 1),
      pagesize: this.pageSize
    };
    this.generalService.searchListCaseLaw(payloadLaw).subscribe(res => {
      this.lstLaw = res;
      if (res && res.length > 0) {
        this.total = res[0].ROWCOUNT;
      }
      this.loading = false;
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex, sort, filter} = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    if (this.showSearch) {
      this.handleSearch();
    }
  }

  f(data, f): any {
    return data[f.toUpperCase()];
  }

  lawType(value) {
    return value === 'L4' ? 'Đặt biệt nghiêm trọng' : value === 'L3' ?
      'Rất nghiêm trọng' : value === 'L2' ? 'Nghiêm trọng' : 'Ít nghiêm trọng';
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);


  onRowSelect(selectedItem): void {
    for (const item of this.lstLaw) {
      item.selected = false;
    }
    selectedItem.selected = true;
    this.selectedLaw = selectedItem;
    this.isSelected = true;
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
}
