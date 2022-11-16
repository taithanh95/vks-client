import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {ResponseBody} from '../../../../../../component/so-thu-ly/model/response-body';
import {SoThuLyService} from '../../../../../../component/so-thu-ly/service/so-thu-ly.service';
import {LstPrison} from '../../../../../../component/thi-hanh-an/model/lstPrison';
import {Penalty} from '../../../../../../component/thi-hanh-an/model/penalty';
import {SppAccAdditionInfo} from '../../../../../../component/thi-hanh-an/model/spp-acc-addition-info';
import {SppExecution} from '../../../../../../component/thi-hanh-an/model/spp-execution';
import {SppViolantion} from '../../../../../../component/thi-hanh-an/model/spp-violantion';
import {DateChangeService} from '../../../../../../service/date-change.service';
import {GeneralService} from "../../../../../../service/general-service";
import {NotificationService} from '../../../../../../service/notification.service';
import {Constant} from '../../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-penalty-create',
  templateUrl: './penalty-create.component.html',
  styleUrls: ['./penalty-create.component.scss']
})

export class PenaltyCreateComponent implements OnChanges{
  @Input() isVisible: boolean;
  @Input() isVisibleDisable: boolean;
  @Input() data: any;
  @Output() realoadForm: EventEmitter<boolean> = new EventEmitter();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  modalType: string;
  lstPrisons: LstPrison[] = [];
  sppExecution: SppExecution;
  sppAccAdditionInfo: SppAccAdditionInfo;
  isCuongChe = false;
  collapse = [true, true, true, true, true];
  penalties: Penalty[];

  LIST_CUONG_CHE_PN =  ['61','62','63','64','65','66','67'];
  LIST_CHECK =  ['11', '12','13', '14', '15', '16', '17','51','52','53','61','62','63','64','65','66','67'];

  formatterYear = (value: number) => `${value} Năm`;
  parserYear = (value: string) => value.replace(' Năm', '');
  formatterMonth = (value: number) => `${value} Tháng`;
  parserMonth = (value: string) => value.replace(' Tháng', '');
  formatterDay = (value: number) => `${value} Ngày`;
  parserDay = (value: string) => value.replace(' Ngày', '');

  constructor(
    private notificationService: NotificationService,
    private dateChangeService: DateChangeService,
    private soThuLyService: SoThuLyService,
    private generalService: GeneralService) {
  }

  reset(): void {
    this.sppExecution = {
      theConvictIsOutOnBail: false,
      numDay: 0, numMonth: 0, numYear: 0, setNum: null, penaltyId: null, sppViolantion: []
    };
    this.sppAccAdditionInfo = {
      movedToAnotherPlace: false,
      moveToOtherPlace: false, fled: false, dead: false
    };
    this.penalties = [
      {penaltyId: '11', isCheck: false, numDay: 0, numMonth: 0, numYear: 0},
      {penaltyId: '12', isCheck: false, numDay: 0, numMonth: 0, numYear: 0},
      {penaltyId: '13', isCheck: false, numDay: 0, numMonth: 0, numYear: 0},
      {penaltyId: '14', isCheck: false, numDay: 0, numMonth: 0, numYear: 0, disinherit: null},
      {penaltyId: '15', isCheck: false, tichThuTaiSan: false, confiscation: null},
      {penaltyId: '16', isCheck: false, numMoney: null},
      {penaltyId: '17', isCheck: false, trucXuat: false},
      {penaltyId: '51', isCheck: false, numMoney: null},
      {penaltyId: '52', isCheck: false },
      {penaltyId: '53', isCheck: false },
      {penaltyId: '61', isCheck: false ,isCuongChe: false},
      {penaltyId: '62', isCheck: false ,isCuongChe: false},
      {penaltyId: '63', isCheck: false ,isCuongChe: false},
      {penaltyId: '64', isCheck: false ,isCuongChe: false},
      {penaltyId: '65', isCheck: false ,isCuongChe: false},
      {penaltyId: '66', isCheck: false ,isCuongChe: false},
      {penaltyId: '67', isCheck: false ,isCuongChe: false}
    ];
  }

  ngOnChanges() {
    if (this.isVisible) {
      this.reset();
      this.modalType = this.data.isEdit ? 'update' : 'create';
      this.getData();
      this.loadLstPrison();
      }
  }

  getData(){
    this.generalService.getExecutionG6({ accuCode: this.data.accucode }).subscribe(resp => {
      if (resp.responseCode === '0000') {
        this.setPenalties(resp.responseData.penalties);
        this.sppExecution = {
          ...resp.responseData,
            sppAccAdditionInfo: this.convertSppAccAdditionInfo(resp.responseData.sppAccAdditionInfo),
            sppViolantion: resp.responseData.sppViolantion ?
            this.convertSppViolantion(resp.responseData.sppViolantion) : []
        };
        this.sppExecution.penaltyId = !this.LIST_CHECK.includes(this.sppExecution.penaltyId) ? this.sppExecution.penaltyId : null ;
        this.sppAccAdditionInfo = this.sppExecution?.sppAccAdditionInfo;
      }
    }, () => {
      this.notificationService.showNotification(Constant.ERROR, 'Lỗi hệ thống');
    });
  }

  loadLstPrison(query?: string) {
     this.soThuLyService.postRequest(this.soThuLyService.QLAHS_URL + 'lstPrison/autocomplete/'
      , {
        query: query ? query : ''
      }).toPromise().then((resp: ResponseBody) => {
      if (resp.responseCode === '0000') {
        this.lstPrisons = resp.responseData;
      } else {
        this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
      }
    }, err => {
      this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
    });
  }

  handleCancel = () => this.closeModal.emit(true);

  handleOk(): void {
    if (!this.sppExecution.setNum) {
      this.notificationService.showNotification(Constant.ERROR, 'Quyết định số bắt buộc nhập');
      return;
    }
    if (!this.sppExecution.inDate) {
      this.notificationService.showNotification(Constant.ERROR, 'Ngày quyết định bắt buộc nhập');
      return;
    }
    if (this.getPenalties().length === 0 && !this.sppExecution.penaltyId ) {
      this.notificationService.showNotification(Constant.ERROR, 'Chưa chọn hình phạt chính');
      return;
    }
    if (this.sppExecution.penaltyId === '02' && (!this.sppExecution.fromDate && !this.sppExecution.toDate)) {
      this.notificationService.showNotification(Constant.ERROR, 'Từ ngày/Đến ngày bắt buộc nhập');
      return;
    }
    if (this.isCuongChe && 
      !this.penalties[10].isCheck &&
      !this.penalties[11].isCheck && 
      !this.penalties[12].isCheck && 
      !this.penalties[13].isCheck && 
      !this.penalties[14].isCheck ){
      this.notificationService.showNotification(Constant.ERROR, 'Chưa chọn hình phạt tư pháp đối với pháp nhân');
      return;
    }
    this.handleSubmid();
  }

  handleSubmid(): void {
    const request = {
      ...this.sppExecution,
      accuCode: this.data.accucode,
      regiCode: this.data.regicode,
      caseCode: this.data.casecode,
      penalties: this.getPenalties(),
      sppViolantion: this.sppExecution.sppViolantion,
      sppAccAdditionInfo: this.data.legalper === 'Y'? null : this.sppAccAdditionInfo
    }
    this.soThuLyService.postRequest(`${this.soThuLyService.QLAHS_URL}sppExecution/${this.modalType}/`, request)
    .pipe(debounceTime(1000))
      .subscribe((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.notificationService.showNotification(Constant.SUCCESS,
            (this.modalType === 'create') ? Constant.MESSAGE_ADD_SUCCESS : Constant.MESSAGE_UPDATE_SUCCESS);
            this.isVisible = false;
            this.closeModal.emit(true);
            this.realoadForm.emit(true);
        } else {
          this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
        }
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, error);
      });
  }

  setPenalties(penalties: Penalty[]): void {
    penalties.forEach(obj => {
        const index = this.penalties.findIndex(e => e.penaltyId === obj.penaltyId);
        if (index !== -1) {
          if (obj.penaltyId === '17') {
            obj.trucXuat = true;
        }
        if (obj.penaltyId === '15') {
            obj.tichThuTaiSan = true;
        }
        if (!this.isCuongChe && this.LIST_CUONG_CHE_PN.some(e => e == obj.penaltyId) && obj.isCuongChe) {
          this.isCuongChe = true;
        }
        if (this.LIST_CHECK.some(e => e == obj.penaltyId)){
          obj.isCheck = true;
        }
        this.penalties[index] = obj;
        }
    }, [])
  }

  checkAllObjectHasAValue(obj: Penalty): boolean {
    return !!(obj.trucXuat
      || obj.tichThuTaiSan
      || obj.isCheck === true);
  }

  /*
   * Danh sách những Penalties được lấy từ giao diện
   */
  getPenalties(): Penalty[] {
    const data: Penalty[] = [];
    if (this.sppExecution.penaltyId) {
      // Luôn lấy hình phạt chính vào mảng
      data.push({
        penaltyId: this.sppExecution.penaltyId,
        numYear: this.sppExecution.numYear,
        numMonth: this.sppExecution.numMonth,
        numDay: this.sppExecution.numDay,
        disinherit: this.sppExecution.disinherit,
        confiscation: this.sppExecution.confiscation,
        numMoney: this.sppExecution.numMoney,
        suspended: this.sppExecution.suspended ? 'Y' : 'N',
        isCuongChe: this.sppExecution.isCuongChe
      });
    }
    // Lọc ra những hình phạt bổ sung
    for (const obj of this.penalties) {
      if (this.checkAllObjectHasAValue(obj)) {
        data.push(this.LIST_CUONG_CHE_PN.some(e => e === obj.penaltyId) ? {...obj,isCuongChe:this.isCuongChe} : obj);
      }
    }
    return data;
  }

  setChangeCuongChe():void {
    this.sppExecution.isCuongChe = null; 
  }

  /*
   * Date
   */
  // disabledInDate = (violationDate: Date): boolean => {
  //   if (!violationDate) {
  //     return false;
  //   }
  //   return violationDate.getTime() > new Date().getTime();
  // };

  onDateValueChange(event: Event): Date {
    const value = (event.target as HTMLInputElement).value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, `Sai định dạng ngày tháng ${Constant.DATE_FMT}.`);
        return;
      }
      const date: Date = this.dateChangeService.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        return;
      } else {
        return date;
      }
    }
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  toggleCollapse(index: number): void {
    this.collapse[index] = !this.collapse[index];
  }

  updateSppViolantion(data: SppViolantion[]): void {
    this.sppExecution.sppViolantion = [...data];
  }

  getSppViolantion(): SppViolantion[] {
    const data: SppViolantion[] = [];
    for (const obj of this.sppExecution.sppViolantion) {
      obj.dateOfViolation = obj.dateOfViolation ? this.dateChangeService.dateToString(obj.dateOfViolation) : null;
      data.push(obj);
    }
    return data;
  }

  convertSppViolantion(list: SppViolantion[]): SppViolantion[] {
    let index = 0;
    list.forEach(e => e.index = index++)
    
    // for (const obj of list) {
    //   obj.index = index;
    //   index++;
    // }
    return list;
  }

  convertSppAccAdditionInfo(obj: SppAccAdditionInfo): SppAccAdditionInfo {
    // if (obj) {
    //   obj.deadDay = obj.deadDay ?
    //     this.dateChangeService.stringToDateWithFormat(obj.deadDay.toString(), 'DD/MM/YYYY') : null;
    //   obj.dayOfHiding = obj.dayOfHiding ?
    //     this.dateChangeService.stringToDateWithFormat(obj.dayOfHiding.toString(), 'DD/MM/YYYY') : null;
    //   obj.reCaptureDate = obj.reCaptureDate ?
    //     this.dateChangeService.stringToDateWithFormat(obj.reCaptureDate.toString(), 'DD/MM/YYYY') : null;
    //   obj.moveOutDate = obj.moveOutDate ?
    //     this.dateChangeService.stringToDateWithFormat(obj.moveOutDate.toString(), 'DD/MM/YYYY') : null;
    //   obj.moveInDate = obj.moveInDate ?
    //     this.dateChangeService.stringToDateWithFormat(obj.moveInDate.toString(), 'DD/MM/YYYY') : null;
    //   obj.ngayHetThoiHanTu = obj.ngayHetThoiHanTu ?
    //     this.dateChangeService.stringToDateWithFormat(obj.ngayHetThoiHanTu.toString(), 'DD/MM/YYYY') : null;
    // } else {
      if (!obj) {
        obj = {
          movedToAnotherPlace: false,
          moveToOtherPlace: false, fled: false, dead: false
        };
      }
    return obj;
  }

  // getSppAccAdditionInfo(): SppAccAdditionInfo {
  //   this.sppAccAdditionInfo.deadDay = this.sppAccAdditionInfo.deadDay ?
  //     this.dateChangeService.dateToString(this.sppAccAdditionInfo.deadDay) : null;

  //   this.sppAccAdditionInfo.dayOfHiding = this.sppAccAdditionInfo.dayOfHiding ?
  //     this.dateChangeService.dateToString(this.sppAccAdditionInfo.dayOfHiding) : null;

  //   this.sppAccAdditionInfo.reCaptureDate = this.sppAccAdditionInfo.reCaptureDate ?
  //     this.dateChangeService.dateToString(this.sppAccAdditionInfo.reCaptureDate) : null;

  //   this.sppAccAdditionInfo.moveOutDate = this.sppAccAdditionInfo.moveOutDate ?
  //     this.dateChangeService.dateToString(this.sppAccAdditionInfo.moveOutDate) : null;

  //   this.sppAccAdditionInfo.moveInDate = this.sppAccAdditionInfo.moveInDate ?
  //     this.dateChangeService.dateToString(this.sppAccAdditionInfo.moveInDate) : null;

  //   this.sppAccAdditionInfo.ngayHetThoiHanTu = this.sppAccAdditionInfo.ngayHetThoiHanTu ?
  //     this.dateChangeService.dateToString(this.sppAccAdditionInfo.ngayHetThoiHanTu) : null;
  //   return this.sppAccAdditionInfo;
  // }
}
