import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CategoriesService } from '../../../../../service/categories.service';
import { DateChangeService } from '../../../../../service/date-change.service';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { WebUtilities } from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-d-caselawcode',
  templateUrl: './d-caselawcode.component.html',
  styleUrls: ['./d-caselawcode.component.scss']
})
export class DCaselawcodeComponent implements OnInit, OnChanges{
  @Input() isVisible: boolean;
  @Input() casecode: string;
  @Input() userfor: string;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() reloadCaseLaw: EventEmitter<boolean> = new EventEmitter();

  law: any;
  selectedLaw: any;
  loading: boolean;

  // LIST COMBOBOX
  lstCode: any[];
  lstGroup: any[];

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
    this.law = { codeid: '', groupid: '', lawid: '', item: '', point: '',lawname: '', fromdate: null, todate: null };
  }

  ngOnInit(): void {
    this.total = 1000;
    this.pageSize = 50;
    this.pageIndex = 1;
    this.categoriesService.getListCode(' ').subscribe(res => {
      this.lstCode = res;
    });
  }

  ngOnChanges() {
    if (this.isVisible) {
    this.law = { codeid: '', groupid: '', lawid: '', item: '', point: '',lawname: '', fromdate: null, todate: null };
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
    if (this.selectedLaw) {
      const payload = {
        action: 'I',
        lawCode: this.selectedLaw.LAWCODE,
        sppCase: {casecode: this.casecode},
        sppId: WebUtilities.getLoggedSppId(),
        userfor: this.userfor
      }
      this.generalService.insertUpdateDeleteCaseLaw(payload).subscribe(res => {
        if (res && res.result) {
          const msg = this.generalService.readPropertiesJava(res.result);
          if (msg) 
            this.notificationService.showNotification(Constant.WARNING, msg);
          else
            this.notificationService.showNotification(Constant.ERROR, res.result);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới thành công');
        }
        this.reloadCaseLaw.emit(true);
        this.handleSearch();
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
      });
    }
  }

  lawCodeChange(data: any) {
    this.categoriesService.getListLawGroup(data).subscribe(res => {
      this.lstGroup = res;
    });
  }

  handleSearch() {
    this.showSearch = true;
    this.loading = true;
    this.isLstLaw = true;
    this.isSelected = false;
    const payloadLaw = {
      sortOrder: 'ASC',
      law: this.law,
      casecode: this.casecode,
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
    const { pageSize, pageIndex, sort, filter } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    if (this.showSearch) {
      this.handleSearch();
    }
  }

  f(data, f): any {
    return data[f.toUpperCase()];
  }

  lawType(value){
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

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onValueDate(event, item) {
    this.law[item] = this.datechangeService.onDateValueChange(event);
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

}