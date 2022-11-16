import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SearchUser} from '../../../../../model/searchUser.class';
import {NotificationService} from '../../../../../service/notification.service';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {ComponentMode, Constant} from '../../../../../shared/constants/constant.class';
import {DenouncementService} from '../../../../../service/denouncement.service';
import {DateChangeService} from '../../../../../service/date-change.service';
import {DateService} from '../../../../../common/util/date.service';
import {ConstantService} from '../../../../../service/constant.service';
import {DDenunciationDetailComponent} from '../d-denunciation-detail/d-denunciation-detail.component';
import * as moment from 'moment';
import {AppConfigService} from '../../../../../../app-config.service';

@Component({
  selector: 'app-d-denunciation-list',
  templateUrl: './d-denunciation-list.component.html',
  styleUrls: ['./d-denunciation-list.component.scss']
})
export class DDenunciationListComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @ViewChild(DDenunciationDetailComponent, {static: false})
  denunciationDetailComponent: DDenunciationDetailComponent;
  loading: boolean;
  datas: any[];

  modeEnum = ComponentMode;
  total: number;
  search: SearchUser = new SearchUser();
  pageSize: any;
  page: any;
  defaultPage: any;
  pageIndex: any;
  showSearch = false;

  filterItem: any;
  userInfo: any;
  isVisibleDetail=false;
  selectedItem:any;
  isVisibleYearErr:boolean;
  firstDateCalendar:any;
  endDateCalendar:any;

  constructor(
    private notificationService: NotificationService,
    private denounceService: DenouncementService,
    private datechangeService: DateChangeService,
    private dateService: DateService,
    private constantService: ConstantService,
    private configService: AppConfigService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.filterItem = {
      pageSize: 10,
      rowIndex: 0,
      sortField: '',
      sortOrder: '',
      sppId: '',
      year: '',
      denouncementCode: '',
      toDate: '',
      fromdate: '',
      delatorOrAccused: '',
      createUser:''
    };
  }

  ngOnInit(): void {
    this.total = 1000;
    this.pageIndex = 1;
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.filterItem.year = new Date().getFullYear();
    this.filterItem.sppId = this.denounceService.getSppId();
  }
  
  ngOnChanges():void{
    this.isVisibleYearErr = false;
    this.datas = [];
    this.filterItem = {
      pageSize: 10,
      rowIndex: 0,
      sortField: '',
      sortOrder: '',
      sppId: this.denounceService.getSppId(),
      year: new Date().getFullYear(),
      denouncementCode: '',
      toDate: '',
      fromdate: '',
      delatorOrAccused: '',
      createUser: this.userInfo.userid
    };
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  getEndDayOfYear() {
    const endDay = new Date(this.filterItem.year, 12, 0).getDate();
    return new Date(this.filterItem.year, 11, endDay);
  }

  getFirstDayOfYear() {
    const firstDay = new Date(this.filterItem.year, 0, 1);
    return firstDay;
  }

  getListData() {
    this.showSearch = true;
    this.loading = true
    let fromDate = '';
    let toDate = '';
    this.isVisibleYearErr = false;

    if(!this.filterItem.year){
      this.notificationService.showNotification(Constant.ERROR, 'Yêu cầu bắt buộc nhập');
      this.datas = [];
      this.loading = false;
      this.isVisibleYearErr = true;
      return ;
    }
    if(this.filterItem.year.length < 4){
      this.notificationService.showNotification(Constant.ERROR, 'Độ dài ký tự chưa đủ, yêu cầu kiểm tra lại');
      this.datas = [];
      this.loading = false;
      this.isVisibleYearErr = true;
      return ;
    }
    if(this.filterItem.fromdate && this.filterItem.toDate 
      && moment(this.filterItem.fromdate).isAfter(this.filterItem.toDate)){
      this.notificationService.showNotification(Constant.ERROR, 'Tiếp nhận từ ngày phải nhỏ hơn hoặc bằng Tiếp nhận đến ngày');
      this.datas = [];
      this.filterItem.fromdate = '';
      this.filterItem.toDate = '';
      this.loading = false;
      return ;
    }

    if(this.filterItem.fromdate){
      const yearFromDate = new Date(this.filterItem.fromdate).getFullYear();
      if(yearFromDate < this.filterItem.year || yearFromDate > this.filterItem.year){
        this.filterItem.fromdate = this.getFirstDayOfYear();
      }
      fromDate = this.dateService.convertDateToStringByPattern(this.filterItem.fromdate, 'dd/MM/yyyy');
    }else{
      fromDate = this.dateService.convertDateToStringByPattern(this.getFirstDayOfYear(), 'dd/MM/yyyy');
    }

    if (this.filterItem.toDate) {
      const yearFromDate = new Date(this.filterItem.toDate).getFullYear();
      if(yearFromDate < this.filterItem.year || yearFromDate > this.filterItem.year){
        this.filterItem.toDate = this.getEndDayOfYear();
      }
      toDate = this.dateService.convertDateToStringByPattern(this.filterItem.toDate, 'dd/MM/yyyy');
    }else{
      toDate = this.dateService.convertDateToStringByPattern(this.getEndDayOfYear(), 'dd/MM/yyyy');
    }

    this.constantService.postRequest(this.constantService.SOTHULY_URL + 'denouncedDenouncement/getPage/'
      , {
        pageNumber: this.pageIndex,
        pageSize: this.pageSize,
        dataRequest: {
          fromDate,
          toDate,
          denouncementCode: this.filterItem.denouncementCode,
          reporter: this.filterItem.delatorOrAccused,
          decisionIdList: ['0101'], //khởi tố vụ án
          sppId: this.filterItem.sppId
        }
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.loading = false;
          this.datas = resJson.responseData.data;
          this.pageIndex= resJson.responseData.pageNumber,
          this.pageSize= resJson.responseData.pageSize,
          this.total= resJson.responseData.totalElements,
          this.page= resJson.responseData.totalPages
        } else if (resJson.responseCode === '0007') {
          this.datas = [];
          this.notificationService.showNotification(Constant.ERROR, 'Không có dữ liệu cần tra cứu.');
        } else {
          this.datas = [];
          this.notificationService.showNotification(Constant.ERROR, resJson.responseMessage);
        }
      })
      .catch(err => {
        this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
    this.loading = false;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    if (this.showSearch) {
      this.getListData();
    }
  }
  chooseDenun(data: any) {
    if(data){
      this.submitForm.emit(data);
      this.closeModal.emit(false);
      this.isVisible = false;
    }
  }

  showModalDetail(data: any){
    this.isVisibleDetail = true;
    this.selectedItem = {id: data.id};
  }

  closeModalDetail() {
    this.isVisibleDetail = false;
  }

  onValueFromdate(event: any){
    this.filterItem.fromdate = this.datechangeService.onDateValueChange(event);
  }

  onValueTodate(event: any){
    this.filterItem.toDate = this.datechangeService.onDateValueChange(event);
  }

	validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  checkLengthYear(){
    this.isVisibleYearErr = false;
    if(this.filterItem.year.length && this.filterItem.year.length < 4){
      this.notificationService.showNotification(Constant.ERROR, 'Độ dài ký tự chưa đủ, yêu cầu kiểm tra lại');
      this.isVisibleYearErr = true;
    }else{
      this.firstDateCalendar = this.getFirstDayOfYear();
      this.endDateCalendar = this.getEndDayOfYear();
    }
  }

}
