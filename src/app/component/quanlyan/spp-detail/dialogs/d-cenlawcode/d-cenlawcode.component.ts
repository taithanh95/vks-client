import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {CategoriesService} from '../../../../../service/categories.service';
import {DateChangeService} from '../../../../../service/date-change.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-d-cenlawcode',
  templateUrl: './d-cenlawcode.component.html',
  styleUrls: ['./d-cenlawcode.component.scss']
})
export class DCenlawcodeComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() accuCode: any;
  @Input() userfor: any;
  @Input() centence: any;
  @Input() register: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  lstLaw: any[];
  law: any;
  data: any;
  loading: boolean;
  lstCode: any[];
  lstGroup: any[];

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
    this.isSelected = false;
    this.isLstLaw = false;
    this.lstLaw = [];
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleOk(): void {
    if (this.data) {
      const payload = {
        regicode: this.register.regicode,
        centcode: this.centence.centcode,
        lawcode: this.data.LAWCODE,
        accucode: this.accuCode,
        userfor: this.userfor,
      }
      this.generalService.saveCentLaw(payload).subscribe(res => {
        if (res) {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + res);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới thành công');
        }
        this.handleSearch();
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
      });
    } else {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tội danh');
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
    const payloadLaw = {
      sortOrder: 'ASC',
      law: this.law,
      regicode: this.register.regicode,
      centcode: this.centence.centcode,
      accucode: this.accuCode,
      userfor: this.userfor,
      pageindex: this.pageIndex,
      pagesize: this.pageSize
    };
    this.categoriesService.searchCenLaw(payloadLaw).subscribe(res => {
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
    this.data = selectedItem;
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
