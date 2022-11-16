import {Component, OnInit, ViewChild} from '@angular/core';
import {RegisterDecision} from '../../../model/register-decision';
import {Spp} from '../../../model/so-thu-ly.model';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../../service/notification.service';
import {DatePipe, Location} from '@angular/common';
import {ConstantService} from '../../../../../service/constant.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {ResponseBody} from '../../../model/response-body';
import * as moment from 'moment';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {GeneralService} from "../../../../../service/general-service";

@Component({
  selector: 'app-register-decision-denouncement-lists',
  templateUrl: './register-decision-denouncement-lists.component.html',
  styleUrls: ['./register-decision-denouncement-lists.component.scss']
})
export class RegisterDecisionDenouncementListsComponent implements OnInit {
  formSearch = this.fb.group({
    denouncementType: [''],
    reporterName: [''],
    decisionCode: [''],
    fromDate: [''],
    toDate: [''],
    denouncementId: [null],
    sppid: ['']
  });
  loading = true;
  selectedItem?: RegisterDecision;
  listOfOption: Array<{ value: string; text: string }> = [];
  scroll = null;
  lstSpp: any[];
  cols = [
    {
      title: 'Chọn',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '50px'
    },
    {
      title: 'Số QĐ',
      sortOrder: null,
      sortFn: (a: RegisterDecision, b: RegisterDecision) => a.decisionNum - b.decisionNum,
      sortDirections: ['ascend', 'descend', null],
      width: '50px'
    },
    {
      title: 'Tên quyết định',
      sortOrder: null,
      sortFn: (a: RegisterDecision, b: RegisterDecision) => a.decisionCode.localeCompare(b.decisionCode),
      sortDirections: ['ascend', 'descend', null],
      width: '200px'
    },
    {
      title: 'Mã tin báo',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '60px'
    },
    {
      title: 'Người báo tin',
      sortOrder: null,
      sortFn: (a: RegisterDecision, b: RegisterDecision) => a.sreporter.localeCompare(b.sreporter),
      sortDirections: ['ascend', 'descend', null],
      width: '80px'
    },
    {
      title: 'Ngày cấp số',
      sortOrder: null,
      sortFn: (a: RegisterDecision, b: RegisterDecision) => a.issuesDate.toString().localeCompare(b.issuesDate.toString()),
      sortDirections: ['ascend', 'descend', null],
      width: '60px'
    },
    {
      title: 'Thời hạn/ hiệu lực từ ngày',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '80px'
    },
    {
      title: 'Thời hạn/ hiệu lực đến ngày',
      sortOrder: null,
      sortFn: null,
      sortDirections: null,
      width: '80px'
    }
  ];
  listOfItem: RegisterDecision[] = [];
  totalPages = 1;
  totalElements = 0;
  pageNumber = 1;
  pageSize = 20;
  collapse = true;
  setOfCheckedId = new Set<number>();

  spp!: Spp;
  account: any;

  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private location: Location,
    private constantService: ConstantService,
    private generalService: GeneralService
  ) {
  }

  ngOnInit(): void {
    this.getSppByUserId();
    this.getDecision();
    this.getListSpp();
  }

  private getSppByUserId(): void {
    this.account = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.spp = JSON.parse(localStorage.getItem(Constant.SPP));
    const denouncementId = localStorage.getItem(Constant.DENOUNCEMENT_ID);
    this.formSearch.get('denouncementId').setValue(denouncementId);
    if (this.account.userid) {
      this.constantService.postRequest(
        this.constantService.MANAGE_URL + 'spp/findFirstByUsername/', {
          username: this.account.userid
        }).toPromise()
        .then(resp => resp.json())
        .then((resp: ResponseBody) => {
          if (resp.responseCode === '0000') {
            this.spp = resp.responseData;
            this.loadDataFromServer();
          }
        })
        .catch(err => {
          this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi. ' + err.message);
        });
    } else {
      this.notificationService.showNotification(Constant.ERROR, 'Vui lòng đăng nhập trước');
    }
  }

  loadDataFromServer(): void {
    const fromDate: Date = new Date(this.fromDate().value);
    const toDate: Date = new Date(this.toDate().value);

    if (fromDate.getTime() > toDate.getTime()) {
      this.notificationService.showNotification(Constant.ERROR, 'Từ ngày phải nhỏ hơn hoặc bằng đến ngày');
      this.fromDatePicker.open();
      return;
    }
    this.listOfItem = [];
    this.totalPages = 0;
    this.totalElements = 0;
    this.scroll = null;
    this.loading = true;
    const searchObj = this.convertFormToObject(this.formSearch.value);
    this.constantService.postRequest(
      this.constantService.SOTHULY_URL + 'registerDecision/getList/',
      searchObj
    ).toPromise()
      .then(resp => resp.json())
      .then((resp: ResponseBody) => {
        this.loading = false;
        if (resp.responseCode === '0007') {
          // Không tìm thấy dữ liệu thì không làm gì cả
        } else if (resp.responseCode === '0000') {
          this.scroll = {x: '1200px', y: '240px'};
          console.log(resp.responseData);
          this.listOfItem = resp.responseData;
          this.totalPages = this.getTotalPagesOfList();
          this.totalElements = this.getTotalElements();
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseCode + ' - ' + resp.responseMessage);
        }
      }, error => this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi. ' + error.message))
  }

  getTotalPagesOfList(): number {
    return Math.ceil(this.listOfItem.length / this.pageSize);
  }

  getTotalElements(): number {
    return this.listOfItem.length;
  }

  getDecision(): void {
    this.constantService.postRequest(
      this.constantService.MANAGE_URL + 'decision/getListForDropbox/',
      {status: ''}
    ).toPromise()
      .then(resp => resp.json())
      .then((resp: ResponseBody) => {
        const listOfOption: Array<{ value: string; text: string }> = [];
        resp.responseData.forEach(item => {
          listOfOption.push({
            value: item.deciId,
            text: item.name
          });
        });
        this.listOfOption = listOfOption;
      });
  }

  toggleCollapse(): void {
    this.collapse = !this.collapse;
  }

  goToDetails(): void {
    this.router.navigate(['admin/so-thu-ly/dang-ky-lenh-tin-bao/xem', this.selectedItem.denouncementId])
  }

  onChangePageIndex(pageNumber: number): void {
    this.pageNumber = pageNumber;
  }

  onChangePageSize(pageSize: number): void {
    this.pageSize = pageSize;
  }

  onSelect(data: RegisterDecision): void {
    this.selectedItem = data;
    this.onItemChecked(data.id, true);
  }

  onItemChecked(id: number, checked: boolean): void {
    this.listOfItem.forEach(item => {
      if (item.id !== id) {
        this.updateCheckedSet(item.id, false)
      } else {
        if (checked) {
          this.selectedItem = item;
        } else {
          this.selectedItem = null;
        }
        this.updateCheckedSet(item.id, checked);
      }
    });
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onClick() {
    this.router.navigate(['admin/quanlyan/search/truy-to/1']);
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  onFromDateValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        this.fromDate().setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        this.fromDate().setValue(null);
        return;
      } else {
        this.fromDate().setValue(date);
      }
    }
  }

  onToDateValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        this.toDate().setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        this.toDate().setValue(null);
        return;
      } else {
        this.toDate().setValue(date);
      }
    }
  }

  fromDate(): AbstractControl {
    return this.formSearch.get('fromDate');
  }

  toDate(): AbstractControl {
    return this.formSearch.get('toDate');
  }

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.fromDate().value) {
      return false;
    }
    return endValue.getTime() <= this.fromDate().value.getTime();
  };

  goBack(): void {
    this.location.back();
  }

  convertFormToObject(form: any): any {
    form.toDate = new DatePipe('en-US').transform(form.toDate, 'dd/MM/yyyy');
    form.fromDate = new DatePipe('en-US').transform(form.fromDate, 'dd/MM/yyyy');
    form.type = 3;
    form.denouncementType = form.denouncementType ? Number(form.denouncementType) : null;
    form.sppCode = this.spp.isDePart === 'Y' ? this.spp.sppParent : this.spp.sppId
    return form;
  }

  getListSpp() {
    this.generalService.getChildSPPSearch('').subscribe(res => {
      if (res.length > 0) {
        this.lstSpp = res.filter(rs => rs.ISDEPART === 'Y');
      }
    });
  }
}
