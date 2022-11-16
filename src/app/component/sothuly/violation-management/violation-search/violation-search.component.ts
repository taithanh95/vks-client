import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ComponentMode, Constant} from '../../../../shared/constants/constant.class';
import {NotificationService} from '../../../../service/notification.service';
import {ConstantService} from '../../../../service/constant.service';
import * as moment from 'moment';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {ViolationLaw} from '../model/violation-law';
import {PageResponse} from '../../../../common/model/base.model';
import {CategoriesService} from '../../../../service/categories.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {ViolationCreateComponent} from '../violation-create/violation-create.component';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';
import {Accused} from '../../../so-thu-ly/model/so-thu-ly.model';
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {WebUtilities} from "../../../../shared/utils/qla-utils.class";

interface LstPolices {
  POLICEID: string;
  NAME: string;
}

interface LstArmies {
  ARMYID: string;
  NAME: string;
}

interface LstCustoms {
  CUSTOMID: string;
  NAME: string;
}

interface LstRangers {
  RANGID: string;
  NAME: string;
}

interface LstBorderGuards {
  BORGUAID: string;
  NAME: string;
}

interface LstSpps {
  sppid: string;
  name: string;
}

interface LstSpcs {
  SPCID: string;
  NAME: string;
}

@Component({
  selector: 'app-violation-search',
  templateUrl: './violation-search.component.html',
  styleUrls: ['./violation-search.component.scss']
})
export class ViolationSearchComponent implements OnInit {
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  @ViewChild('violationCreate') violationCreate: ViolationCreateComponent;
  popupMode: ComponentMode = ComponentMode.CREATE;
  popupModeEnum = ComponentMode;
  confirmModalRef: NzModalRef<any>;
  isVisibleCreateForm: boolean;
  isVisibleUpdateForm: boolean;
  isVisibleDetailForm: boolean;
  formSearch = this.fb.group({
    violationCode: [''],
    violatedAgency: [''],
    violatedUnitsId: [''],
    fromDate: [''],
    toDate: [''],
    documentCode: ['']
  });
  resultCodeList = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private constantService: ConstantService,
    private modalService: NzModalService,
	private cookieService: CookieService
  ) {
  }

  listOfData: any[] = [];
  pageResponse: PageResponse = {
    totalElements: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 20
  };
  collapse = true;
  scroll = null;
  loading = true;
  isSpinning: boolean;
  selectedItem: ViolationLaw;
  lstPolices: LstPolices[]; // 02 - Công an
  lstPolicesChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  lstArmies: LstArmies[]; // 04 - Quân đội
  lstArmiesChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  lstCustoms: LstCustoms[]; // 06 - Hải quan
  lstCustomsChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  lstRangers: LstRangers[]; // 08 - Kiểm lâm
  lstRangersChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  lstBorderGuards: LstBorderGuards[]; // 09 - Bộ đội biên phòng
  lstBorderGuardsChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  // lstArmies: any[]; // 10 - Cảnh sát biển
  // lstArmies: any[]; // 12 - Cơ quan khác
  lstSpps: LstSpps[]; // SPP - Viện kiểm sát
  lstSppsChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  lstSpcs: LstSpcs[]; // SPC - Tòa án
  lstSpcsChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  myForm: FormGroup;
  username: string;
  sppId: string;
  userInfo: any;
  selectedSpp: any;

  ngOnInit(): void {
    if (localStorage.getItem(Constant.USER_INFO) === null
      || localStorage.getItem(Constant.USERID) !== this.cookieService.get(Constant.USERNAME)) {
      localStorage.clear();
      this.router.navigate(['login'], {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
    }
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.selectedSpp = JSON.parse(localStorage.getItem(Constant.SPP));
    this.doSearch()
    this.lstPolicesChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListPolice(value).subscribe(res => {
          this.lstPolices = res;
        });
      });

    this.lstArmiesChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListArmy(value).subscribe(res => {
          this.lstArmies = res;
        });
      });

    this.lstCustomsChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListCustoms(value).subscribe(res => {
          this.lstCustoms = res;
        });
      });

    this.lstRangersChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListRangers(value).subscribe(res => {
          this.lstRangers = res;
        });
      });

    this.lstBorderGuardsChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListBorderGuards(value).subscribe(res => {
          this.lstBorderGuards = res;
        });
      });

    this.lstSppsChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListVKS(value).subscribe(res => {
          this.lstSpps = res;
        });
      });

    this.lstSpcsChange$.asObservable().pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.categoriesService.getListToaAn(value).subscribe(res => {
          this.lstSpcs = res;
        });
      });
  }

  doSearch() {
    this.loadDataFromServer();
  }

  loadDataFromServer(): void {
    this.listOfData = [];
    this.pageResponse.totalElements = 0;
    this.pageResponse.totalPages = 1;
    this.scroll = null;
    this.loading = true;
    const fromDate = new DatePipe('en-US').transform(this.fromDate().value, 'dd/MM/yyyy');
    const toDate = new DatePipe('en-US').transform(this.toDate().value, 'dd/MM/yyyy');

    if (fromDate > toDate) {
      this.notificationService.showNotification(Constant.ERROR, 'Từ ngày phải nhỏ hơn hoặc bằng đến ngày');
      return;
    }
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'violation/getPage/'
      , {
        pageNumber: this.pageResponse.pageNumber,
        pageSize: this.pageResponse.pageSize,
        dataRequest: {
          id: this.formSearch.get('violationCode').value,
          fromDate,
          toDate,
          violatedAgency: this.formSearch.get('violatedAgency').value,
          violatedUnitsId: this.formSearch.get('violatedUnitsId').value ? this.getViolatedUnitsId() : null,
          documentCode: this.formSearch.get('documentCode').value,
          resultCodeList: this.resultCodeList,
          sppid: WebUtilities.getLoggedSppId(),
        }
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0007') {
          // Không tìm thấy dữ liệu thì không làm gì cả
        } else if (resJson.responseCode === '0000') {
          this.pageResponse = resJson.responseData;
          this.listOfData = resJson.responseData.data;
          this.scroll = {x: '1200px', y: '240px'};
        } else {
          this.notificationService.showNotification(Constant.ERROR, resJson.responseMessage);
        }
        this.loading = false;
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  toggleCollapse(): void {
    this.collapse = !this.collapse;
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

  get violatedAgency(): AbstractControl {
    return this.formSearch.get('violatedAgency');
  }

  get violatedUnitsId(): AbstractControl {
    return this.formSearch.get('violatedUnitsId');
  }

  onCloseCreateForm(event: boolean) {
    this.isVisibleCreateForm = event;
    this.loadDataFromServer();
  }

  violatedAgencyChange(value: string): void {
    this.isSpinning = true;
    this.violatedUnitsId.setValue(null);
    if (value) {
      switch (value) {
        case '02':
          this.categoriesService.getListPolice(' ').subscribe(res => {
            this.lstPolices = res;
            this.isSpinning = false;
          });
          break;
        case '04':
          this.categoriesService.getListArmy('0').subscribe(res => {
            this.lstArmies = res;
            this.isSpinning = false;
          });
          break;
        case '06':
          this.categoriesService.getListCustoms('0').subscribe(res => {
            this.lstCustoms = res;
            this.isSpinning = false;
          });
          break;
        case '08':
          this.categoriesService.getListRangers('0').subscribe(res => {
            this.lstRangers = res;
            this.isSpinning = false;
          });
          break;
        case '09':
          this.categoriesService.getListBorderGuards('0').subscribe(res => {
            this.lstBorderGuards = res;
            this.isSpinning = false;
          });
          break;
        case '10':
        case '12':
          this.myForm.get('violatedUnitsId').clearValidators();
          this.myForm.get('violatedUnitsId').updateValueAndValidity();
          break;
        case 'SPP':
          this.categoriesService.getListVKS(' ').subscribe(res => {
            this.lstSpps = res;
            this.isSpinning = false;
          });
          break;
        case 'SPC':
          this.categoriesService.getListToaAn(' ').subscribe(res => {
            this.lstSpcs = res;
            this.isSpinning = false;
          });
          break;
      }
    } else {
      this.lstPolices = [];
      this.lstArmies = [];
      this.lstCustoms = [];
      this.lstRangers = [];
      this.lstBorderGuards = [];
      this.lstSpps = [];
      this.lstSpcs = [];
    }
  }

  showModalUpdate(event: boolean) {
    this.isVisibleUpdateForm = event;
    this.loadDataFromServer();
  }

  onDelete() {
    if (!this.validSelected()) {
      return;
    }
    this.showConfirmDelete();
  }

  showModalDetail(event: boolean) {
    this.isVisibleDetailForm = event;
  }

  onSelect(data: any): void {
    this.selectedItem = data;
    this.onItemChecked(data, true);
  }

  onItemChecked(item: any, checked: boolean): void {
    this.listOfData.forEach(e => {
      e.checked = false
    });
    item.checked = checked;
    if (checked) {
      this.selectedItem = item;
    } else {
      this.selectedItem = null;
    }
  }

  validSelected() {
    if (!this.selectedItem) {
      this.notificationService.showNotification(Constant.ERROR, 'Chưa chọn bản ghi nào');
      return false;
    }
    return true;
  }

  showConfirmDelete(): void {
    this.confirmModalRef = this.modalService.create({
      nzTitle: this.confirmHeaderTemplate,
      nzContent: this.confirmTemplate,
      nzClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: 'Có', onClick: () => {
            this.deleteData();
            this.confirmModalRef.close();
          }
        },
        {
          label: 'Không', onClick: () => {
            this.confirmModalRef.close();
          }
        }
      ]
    });
  }

  deleteData(): any {
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'violation/delete/',
      {
        id: this.selectedItem.id
      }).toPromise().then(() => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
      this.listOfData.forEach(e => {
        e.checked = false
      });
      this.selectedItem = null;
      this.doSearch();
    }).catch(err => {
      this.notificationService.showNotification(Constant.ERROR, 'Xóa thất bại' + err);
    });
    this.loading = false;
  }

  onInputPolice(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstPolices = [];
    } else {
      this.lstPolicesChange$.next(value);
    }
  }

  onInputArmy(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstArmies = [];
    } else {
      this.lstArmiesChange$.next(value);
    }
  }

  onInputCustoms(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstCustoms = [];
    } else {
      this.lstCustomsChange$.next(value);
    }
  }

  onInputRangers(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstRangers = [];
    } else {
      this.lstRangersChange$.next(value);
    }
  }

  onInputBorderGuards(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstBorderGuards = [];
    } else {
      this.lstBorderGuardsChange$.next(value);
    }
  }

  onInputSpp(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpps = [];
    } else {
      this.lstSppsChange$.next(value);
    }
  }

  onInputSpc(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstSpcs = [];
    } else {
      this.lstSppsChange$.next(value);
    }
  }

  onFocusViolatedUnitsId(e: any) {
    if (!this.violatedAgency.value) {
      this.notificationService.showNotification(Constant.ERROR, 'Yêu cầu chọn Cơ quan vi phạm trước');
    }
  }

  getViolatedUnitsId(): string {
    switch (this.violatedAgency.value) {
      case '02':
        return this.violatedUnitsId.value.POLICEID;
      case '04':
        return this.violatedUnitsId.value.ARMYID;
      case '06':
        return this.violatedUnitsId.value.CUSTOMID;
      case '08':
        return this.violatedUnitsId.value.RANGID;
      case '09':
        return this.violatedUnitsId.value.BORGUAID;
      case '10':
      case '12':
        return this.violatedAgency.value;
      case 'SPC':
        return this.violatedUnitsId.value.SPCID;
      case 'SPP':
        return this.violatedUnitsId.value.sppid;
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex, sort, filter} = params;
    this.pageResponse.pageNumber = params.pageIndex;
    this.pageResponse.pageSize = params.pageSize;
    this.loadDataFromServer();
  }
}

