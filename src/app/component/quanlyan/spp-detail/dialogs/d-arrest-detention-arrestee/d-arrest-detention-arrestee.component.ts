import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SearchUser} from '../../../../../model/searchUser.class';
import {CategoriesService} from '../../../../../service/categories.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {AppConfigService} from '../../../../../../app-config.service';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {Constant} from '../../../../../shared/constants/constant.class';
import {DateService} from '../../../../../common/util/date.service';
import {ConstantService} from '../../../../../service/constant.service';
import {PageResponse} from '../../../../../common/model/base.model';
import {ArresteeModel} from '../../../../../model/arrestee.model';
import {DateChangeService} from '../../../../../service/date-change.service';
import * as moment from 'moment';

@Component({
  selector: 'app-d-arrest-detention-arrestee',
  templateUrl: './d-arrest-detention-arrestee.component.html',
  styleUrls: ['./d-arrest-detention-arrestee.component.scss']
})
export class DArrestDetentionArresteeComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  arresteeModelForEdit: ArresteeModel;
  arrestee: ArresteeModel;
  isArresteeDetail: boolean;
  law: any;
  loading: boolean;
  datas: any[] = [];
  total: number;
  search: SearchUser = new SearchUser();
  pageSize: any;
  page: any;
  defaultPage: any;
  pageIndex: any;
  pageResponse: PageResponse;
  nzParams: NzTableQueryParams;
  filterItem : any;
  arresteeModel: any;
  spp: any;

  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private configService: AppConfigService,
    private constantService: ConstantService,
    private dateService: DateService,
    private datechangeService: DateChangeService
  ) {
    this.spp = JSON.parse(localStorage.getItem(Constant.SPP));
  }

  ngOnInit(): void {
    this.loading = false;
    this.pageSize = this.configService.getConfig().pageSize;
    this.pageResponse = {
      pageNumber: 1,
      pageSize: 20
    };
    this.filterItem = {
      dataRequest: {
        fromDate: null,
        toDate: null,
        fullName: '',
        id: null
      }
    };
  }

  doSearch() {
    this.getListData(1, 20, '');
  }

  async ngOnChanges() {
    if (this.isVisible) this.doSearch();
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

  chooseArresteeDetail(data: any) {
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'arrestee/findById'
      , {
        id: data.id
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (resJson.responseData) {
            this.arresteeModelForEdit = resJson.responseData;
          } else {
            this.arresteeModelForEdit = null;
          }
        } else {
          // tslint:disable-next-line:max-line-length
          this.arresteeModelForEdit = null;
          // this.notificationService.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      });
      
    this.isArresteeDetail = true;
  }

  getListData(page, size, sort) {
    this.loading = true;
    // this.filterItem.dataRequest.sppId = this.userInfo.sppid;
    if(this.filterItem.dataRequest.fromDate && this.filterItem.dataRequest.toDate 
      && moment(this.filterItem.dataRequest.fromDate).isAfter(this.filterItem.dataRequest.toDate)){
      this.notificationService.showNotification(Constant.ERROR, 'Thời gian bắt giữ từ ngày phải nhỏ hơn hoặc bằng Thời gian bắt giữ đến ngày');
      this.datas = [];
      this.filterItem.dataRequest.fromDate = '';
      this.filterItem.dataRequest.toDate = '';
      this.loading = false;
      return ;
    }

    let ifromDate = '';
    if (this.filterItem.dataRequest.fromDate) {
      ifromDate = this.dateService.convertDateToStringByPattern(this.filterItem.dataRequest.fromDate, 'dd/MM/yyyy');
    }
    let itoDate = '';
    if (this.filterItem.dataRequest.toDate) {
      itoDate = this.dateService.convertDateToStringByPattern(this.filterItem.dataRequest.toDate, 'dd/MM/yyyy');
    }
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'arrestee/search'
      , {
        pageNumber: page,
        pageSize: size,
        dataRequest: {
          fullName: this.filterItem.dataRequest.fullName,
          fromDate: ifromDate,
          toDate: itoDate,
          id: this.filterItem.dataRequest.id,
          arrestingUnitId: this.spp.SPPID
        }
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (resJson.responseData) {
            this.pageResponse = resJson.responseData;
            this.datas = resJson.responseData.data;
          } else {
            this.datas = [];
          }
        } else {
          // tslint:disable-next-line:max-line-length
          this.datas = [];
          // this.notificationService.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
        this.loading = false;
      });
      
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.nzParams = params;
    const {pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.getListData(params.pageIndex, params.pageSize, sortOrder);
  }

  closePopupArresteeDetail(): void {
    this.isArresteeDetail = false;
  }

  submitArresteeDetail(data): void {
    this.isArresteeDetail = false;
  }

  submitArrestee(data): void {
    let arresteeModel: ArresteeModel;
    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'arrestee/findById'
      , {
        id: data.id
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (resJson.responseData) {
            arresteeModel = resJson.responseData;
            this.submitForm.emit(arresteeModel);
            this.checkCasecodeAccu(arresteeModel.id);
          } else {
            arresteeModel = null;
            this.submitForm.emit(arresteeModel);
          }
        } else {
          // tslint:arresteeModel-next-line:max-line-length
          arresteeModel = null;
          this.submitForm.emit(arresteeModel);
          // this.notificationService.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      });

    this.isVisible = false;
    this.closeModal.emit(false);
  }

  checkCasecodeAccu(arresteeId: any){
    this.generalService.getLstCaseCodeAccu(arresteeId).subscribe(res =>{
      if(res.length > 0){
        this.notificationService.showNotification(Constant.WARNING,`Người bị bắt giữ đã được chọn tại vụ án ${res} , yêu cầu kiểm tra lại`);
      }
    });
  }

  onValueFromDate(event: any){
    this.filterItem.dataRequest.fromDate = this.datechangeService.onDateValueChange(event);
  }

  onValueToDate(event: any){
    this.filterItem.dataRequest.toDate = this.datechangeService.onDateValueChange(event);
  }

	validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}
