import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {AppConfigService} from '../../../../../../app-config.service';
import {SearchUser} from '../../../../../model/searchUser.class';
import {NzTableQueryParams} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-d-lawcode',
  templateUrl: './d-lawcode.component.html',
  styleUrls: ['./d-lawcode.component.scss']
})
export class DLawcodeComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  lstLaw: any[];
  law: any;
  loading: boolean;
  lstCode: any[];
  lstGroup: any[];

  total: number;
  search: SearchUser = new SearchUser();
  pageSize: any;
  page: any;
  defaultPage: any;
  pageIndex: any;
  showSearch = false;
  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private configService: AppConfigService
  ) {
    this.law = {code: '', group: '', lawid: '', item: '', point: ''};
  }

  ngOnInit(): void {
    this.total = 1000;
    this.pageSize = 10;
    this.pageIndex = 1;
    this.categoriesService.getListCode(' ').subscribe(res => {
      this.lstCode = res;
    });

  }
  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
  handleOk(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
    this.submitForm.emit(this.law);
  }

  lawCodeChange(data: any) {
    this.categoriesService.getListLawGroup(data).subscribe(res => {
      this.lstGroup = res;
    });
  }

  handleSearch(reset: boolean = false) {
    this.showSearch = true;
    this.loading = true;
    if (reset) {
      this.search.page = 1;
    }
    const payloadLaw = {
      sortOrder: 'ASC',
      'law.checklawcode': true,
      'law.codeid': this.law.code,
      'law.groupid': this.law.group,
      'law.lawid': this.law.lawid,
      'law.item': this.law.item,
      'law.point': this.law.point,
      page: this.pageSize * (this.pageIndex - 1),
      size: this.pageSize
    };
    this.categoriesService.searchLaw(payloadLaw).subscribe(res => {
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
  chooseLaw(data: any) {
    this.isVisible = false;
    this.closeModal.emit(false);
    this.submitForm.emit(data);
  }
}
