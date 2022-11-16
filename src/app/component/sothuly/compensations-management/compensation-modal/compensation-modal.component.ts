import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {CategoriesService} from '../../../../service/categories.service';
import {NotificationService} from '../../../../service/notification.service';
import {SoThuLyService} from '../../../so-thu-ly/service/so-thu-ly.service';
import {ParsePipe} from 'ngx-moment';
import {DatePipe} from '@angular/common';
import {ComponentMode, Constant} from '../../../../shared/constants/constant.class';
import * as moment from 'moment';
import {ResponseBody} from '../../../so-thu-ly/model/response-body';
import {Compensation} from '../model/compensation';
import {Spp} from '../../../so-thu-ly/model/so-thu-ly.model';
import {BehaviorSubject} from 'rxjs';
import {CompensationDetail} from '../model/compensation-detail';
import {CompensationDocument} from '../model/compensation-document';
import {CookieService} from 'ngx-cookie-service';
import {CompensationDamage} from '../compensation-damage/compensation-damages-list/compensation-damages-list.component';
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {WebUtilities} from "../../../../shared/utils/qla-utils.class";
import {StringService} from "../../../../common/util/string.service";

export function dateValidator(isErr: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return isErr ? {wrongDate: {value: control.value}} : null;
  };
}

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
  selector: 'app-compensation-modal',
  templateUrl: './compensation-modal.component.html',
  styleUrls: ['./compensation-modal.component.scss']
})
export class CompensationModalComponent implements OnInit, OnChanges, OnDestroy {
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() isVisible: boolean
  isVisibleDocument: boolean
  @Input() popupMode: ComponentMode = ComponentMode.CREATE;
  @Input() selectedItem: Compensation;
  confirmModalRef: NzModalRef<any>;
  userInfo: any;
  selectedSpp: any;
  myForm: FormGroup;
  isSpinning: boolean;
  listSpp: Spp[] = [];
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
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  arrCollapse = [true, true, true, true, true, true, true];
  compensationDocumentList: CompensationDocument[] = [];
  compensationDetailList: CompensationDetail[] = [];
  compensationDamagesList: CompensationDamage[] = [];
  popupModeEnum = ComponentMode;
  compensationDateErrorMsg: string;
  resultDateErrorMsg: string;
  decisionCompensationDateErrorMsg: string;
  decisionCompensationIndateErrorMsg: string;
  verificationFromDateErrorMsg: string;
  verificationToDateErrorMsg: string;
  negotiateFromDateErrorMsg: string;
  negotiateToDateErrorMsg: string;
  decisionEnforcementIndateErrorMsg: string;
  judgmentCompensationDateErrorMsg: string;

  lstInpectors: any[]
  inspectorOpions: any[]
  sppId: any;

  constructor(private fb: FormBuilder,
              private categoriesService: CategoriesService,
              private notificationService: NotificationService,
              private soThuLyService: SoThuLyService,
              private parsePipe: ParsePipe,
              private datePipe: DatePipe,
              private modalService: NzModalService,
              private stringService: StringService,
              private cookieService: CookieService
  ) {
    this.sppId = WebUtilities.getLoggedSppId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisible && this.isVisible) {
      this.myForm.enable();
      this.myForm.get('id').disable();
      this.compensationDetailList = [];
      this.compensationDocumentList = [];
      this.compensationDamagesList = [];
      if (this.selectedItem && this.popupMode !== ComponentMode.CREATE) {
        if (this.popupMode === ComponentMode.VIEW) {
          this.myForm.disable();
        }
        this.isSpinning = true;
        this.soThuLyService.postRequest(this.soThuLyService.SOTHULY_URL + 'compensation/detail/', {id: this.selectedItem.id})
          .subscribe((resp: ResponseBody) => {
            if (resp.responseCode === '0000') {
              this.myForm.patchValue(
                {
                  ...resp.responseData,
                  compensationDate: this.stringToDate(resp.responseData.compensationDate),
                  petitionDate: resp.responseData.petitionDate ? this.stringToDate(resp.responseData.petitionDate) : null,
                  claimantBirthday: resp.responseData.claimantBirthday ? this.stringToDate(resp.responseData.claimantBirthday) : null,
                  damagesBirthday: resp.responseData.damagesBirthday ? this.stringToDate(resp.responseData.damagesBirthday) : null,
                  decisionCompensationDate: resp.responseData.decisionCompensationDate ?
                    this.stringToDate(resp.responseData.decisionCompensationDate) : null,
                  decisionCompensationIndate: resp.responseData.decisionCompensationIndate ?
                    this.stringToDate(resp.responseData.decisionCompensationIndate) : null,
                  verificationFromDate: resp.responseData.verificationFromDate ?
                    this.stringToDate(resp.responseData.verificationFromDate) : null,
                  verificationToDate: resp.responseData.verificationToDate ?
                    this.stringToDate(resp.responseData.verificationToDate) : null,
                  negotiateFromDate: resp.responseData.negotiateFromDate ?
                    this.stringToDate(resp.responseData.negotiateFromDate) : null,
                  negotiateToDate: resp.responseData.negotiateToDate ?
                    this.stringToDate(resp.responseData.negotiateToDate) : null,
                  decisionEnforcementIndate: resp.responseData.decisionEnforcementIndate ?
                    this.stringToDate(resp.responseData.decisionEnforcementIndate) : null,
                  judgmentCompensationDate: resp.responseData.judgmentCompensationDate ?
                    this.stringToDate(resp.responseData.judgmentCompensationDate) : null,
                  resultDate: resp.responseData.resultDate ? this.stringToDate(resp.responseData.resultDate) : null,
                  resultUnitsId: resp.responseData.resultUnitsName
                });
              this.compensationDocumentList = [
                ...resp.responseData.compensationDocumentList
              ];
              this.compensationDetailList = [
                ...resp.responseData.compensationDetailList
              ];
              this.compensationDamagesList = [
                ...resp.responseData.compensationDamagesList
              ];
              this.compensationDocumentList = [...this.convertStringToDateFromObject1()];
              this.compensationDetailList = [...this.convertStringToDateFromObject2()];
              this.compensationDamagesList = [...this.convertStringToDateFromObject3()]
            } else {
              this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
            }
            this.isSpinning = false;
          }, error => {
            this.notificationService.showNotification(Constant.ERROR, error);
            this.isSpinning = false;
          });
      }
    }
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.selectedSpp = JSON.parse(localStorage.getItem(Constant.SPP));
    this.getVienKiemSatByUsername();
    this.myForm = this.fb.group({
      id: [{value: null, disabled: true}],
      compensationDate: [null, [Validators.required]],
      petitionDate: [null],
      claimantName: [null],
      claimantBirthday: [null],
      claimantAddress: [null],
      claimantCccd: [null, [Validators.maxLength(12), Validators.minLength(9)]],
      damagesName: [null],
      damagesBirthday: [null],
      damagesAddress: [null],
      damagesContent: [null],
      decisionCompensationDate: [null],
      decisionCompensationNumber: [null],
      decisionCompensationIndate: [null],
      detentionInNumberOfDays: [null],
      verificationFromDate: [null],
      verificationToDate: [null],
      negotiateFromDate: [null],
      negotiateToDate: [null],
      decisionEnforcementNumber: [null],
      decisionEnforcementContent: [null],
      decisionEnforcementIndate: [null],
      decisionEnforcementSppid: [this.cookieService.get(Constant.ID_SPP)],
      decisionEnforcementSigner: [null],
      decisionEnforcementPosition: [null],
      judgmentCompensationNumber: [null],
      judgmentCompensationDate: [null],
      judgmentCompensationContent: [null],
      resultCode: [null],
      resultNumber: [null],
      resultDate: [null],
      resultAgency: [null],
      resultUnitsId: [null],
      resultUnitsName: [null],
      resultHandler: [null],
      resultPositionHandler: [null],
      note: [null],
      centenceCompensationSppid: [this.cookieService.get(Constant.ID_SPP)],
      levelCompensation: [null],
      indemnifyEnforcement: [null],
      indemnifyEnforcementNumber: [null],
      indemnifyCompensation: [null],
      indemnifyCompensationNumber: [null]
    });
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

  getVienKiemSatByUsername(): void {
    this.soThuLyService.postRequest(this.soThuLyService.MANAGE_URL + 'spp/findByUsername/'
      , {
        username: this.cookieService.get(Constant.USERNAME)
      }).subscribe((resp: ResponseBody) => {
      if (resp.responseCode === '0000') {
        this.listSpp = resp.responseData;
      } else {
        this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
      }
    }, err => {
      this.notificationService.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
    });
  }

  ngOnDestroy(): void {
    console.log('onDestroy');
  }

  handleCancel(): void {
    this.clearForm();
    this.closeChange.emit(false);
  }

  onSubmit(): void {
    if (this.compensationDate.value) {
      const compensationDate = this.convertTimeToBeginningOfTheDay(this.compensationDate.value);
      if (compensationDate.getTime() > new Date().getTime()) {
        this.compensationDateErrorMsg = `Ngày tiếp nhận không lớn hơn ngày hiện tại`;
        this.notificationService.showNotification(Constant.ERROR, this.compensationDateErrorMsg);
        this.compensationDate.setValue(null);
        this.compensationDate.setValidators([dateValidator(true)]);
        this.compensationDate.updateValueAndValidity();
        return;
      } else {
        this.compensationDate.setValidators(null);
        this.compensationDate.updateValueAndValidity();
      }
    }
    if (this.resultDate.value) {
      const resultDate = this.convertTimeToBeginningOfTheDay(this.resultDate.value);
      const compensationDate = this.convertTimeToBeginningOfTheDay(this.compensationDate.value);
      if (resultDate.getTime() > new Date().getTime()) {
        this.resultDateErrorMsg = `Ngày xử lý không lớn hơn ngày hiện tại`;
        this.notificationService.showNotification(Constant.ERROR, this.resultDateErrorMsg);
        this.resultDate.setValue(null);
        this.resultDate.setValidators([dateValidator(true)]);
        this.resultDate.updateValueAndValidity();
        return;
      } else if (resultDate.getTime() < compensationDate.getTime()) {
        this.resultDateErrorMsg = `Ngày xử lý phải lớn hơn hoặc bằng Ngày tiếp nhận`;
        this.notificationService.showNotification(Constant.ERROR, this.resultDateErrorMsg);
        this.resultDate.setValue(null);
        this.resultDate.setValidators([dateValidator(true)]);
        this.resultDate.updateValueAndValidity();
        return;
      } else {
        this.resultDate.setValidators(null);
        this.resultDate.updateValueAndValidity();
      }
    }

    if (this.decisionCompensationDate.value) {
      const decisionCompensationDate = this.convertTimeToBeginningOfTheDay(this.decisionCompensationDate.value);
      const resultDate = this.convertTimeToBeginningOfTheDay(this.resultDate.value);
      if (decisionCompensationDate.getTime() > new Date().getTime()) {
        this.decisionCompensationDateErrorMsg = `Ngày thụ lý không lớn hơn ngày hiện tại`;
        this.notificationService.showNotification(Constant.ERROR, this.decisionCompensationDateErrorMsg);
        this.decisionCompensationDate.setValue(null);
        this.decisionCompensationDate.setValidators([dateValidator(true)]);
        this.decisionCompensationDate.updateValueAndValidity();
        return;
      } else if (decisionCompensationDate.getTime() < resultDate.getTime()) {
        this.decisionCompensationDateErrorMsg = `Ngày thụ lý phải lớn hơn hoặc bằng Ngày xử lý`;
        this.notificationService.showNotification(Constant.ERROR, this.decisionCompensationDateErrorMsg);
        this.decisionCompensationDate.setValue(null);
        this.decisionCompensationDate.setValidators([dateValidator(true)]);
        this.decisionCompensationDate.updateValueAndValidity();
        return;
      } else {
        this.decisionCompensationDate.setValidators(null);
        this.decisionCompensationDate.updateValueAndValidity();
      }
    }

    if (this.decisionCompensationIndate.value) {
      const decisionCompensationIndate = this.convertTimeToBeginningOfTheDay(this.decisionCompensationIndate.value);
      const decisionCompensationDate = this.convertTimeToBeginningOfTheDay(this.decisionCompensationDate.value);
      if (decisionCompensationIndate.getTime() > new Date().getTime()) {
        this.decisionCompensationDateErrorMsg = `Ngày ra QĐ/BA không lớn hơn ngày hiện tại`;
        this.notificationService.showNotification(Constant.ERROR, this.decisionCompensationDateErrorMsg);
        this.decisionCompensationIndate.setValue(null);
        this.decisionCompensationIndate.setValidators([dateValidator(true)]);
        this.decisionCompensationIndate.updateValueAndValidity();
        return;
      } else if (decisionCompensationIndate.getTime() < decisionCompensationDate.getTime()) {
        this.decisionCompensationDateErrorMsg = `Ngày ra QĐ/BA phải lớn hơn hoặc bằng Ngày thụ lý`;
        this.notificationService.showNotification(Constant.ERROR, this.decisionCompensationDateErrorMsg);
        this.decisionCompensationIndate.setValue(null);
        this.decisionCompensationIndate.setValidators([dateValidator(true)]);
        this.decisionCompensationIndate.updateValueAndValidity();
        return;
      } else {
        this.decisionCompensationIndate.setValidators(null);
        this.decisionCompensationIndate.updateValueAndValidity();
      }
    }

    if (this.verificationFromDate.value) {
      const verificationFromDate = this.convertTimeToBeginningOfTheDay(this.verificationFromDate.value);
      const decisionCompensationIndate = this.convertTimeToBeginningOfTheDay(this.decisionCompensationIndate.value);
      if (verificationFromDate.getTime() > new Date().getTime()) {
        this.verificationFromDateErrorMsg = `Ngày bắt đầu xác minh không lớn hơn ngày hiện tại`;
        this.notificationService.showNotification(Constant.ERROR, this.verificationFromDateErrorMsg);
        this.verificationFromDate.setValue(null);
        this.verificationFromDate.setValidators([dateValidator(true)]);
        this.verificationFromDate.updateValueAndValidity();
        return;
      }else if (verificationFromDate.getTime() > decisionCompensationIndate.getTime()) {
        this.decisionCompensationDateErrorMsg = `Ngày bắt đầu xác minh phải bé hơn hoặc bằng Ngày ra QĐ/BA`;
        this.notificationService.showNotification(Constant.ERROR, this.decisionCompensationDateErrorMsg);
        this.verificationFromDate.setValue(null);
        this.verificationFromDate.setValidators([dateValidator(true)]);
        this.verificationFromDate.updateValueAndValidity();
        return;
      } else {
        this.verificationFromDate.setValidators(null);
        this.verificationFromDate.updateValueAndValidity();
      }
    }

    if (this.verificationFromDate.value) {
      const verificationFromDate = this.convertTimeToBeginningOfTheDay(this.verificationFromDate.value);
      const verificationToDate = this.convertTimeToBeginningOfTheDay(this.verificationToDate.value);
      const decisionCompensationIndate = this.convertTimeToBeginningOfTheDay(this.decisionCompensationIndate.value);
      if (verificationToDate.getTime() < verificationFromDate.getTime()) {
        this.verificationToDateErrorMsg = `Ngày kết thúc xác minh phải lớn hơn hoặc bằng Ngày bắt đầu xác minh`;
        this.notificationService.showNotification(Constant.ERROR, this.verificationToDateErrorMsg);
        this.verificationToDate.setValue(null);
        this.verificationToDate.setValidators([dateValidator(true)]);
        this.verificationToDate.updateValueAndValidity();
        return;
      } else if (verificationToDate.getTime() > decisionCompensationIndate.getTime()) {
        this.verificationToDateErrorMsg = `Ngày kết thúc xác minh phải nhỏ hơn hoặc bằng Ngày ra QĐ/BA`;
        this.notificationService.showNotification(Constant.ERROR, this.verificationToDateErrorMsg);
        this.verificationToDate.setValue(null);
        this.verificationToDate.setValidators([dateValidator(true)]);
        this.verificationToDate.updateValueAndValidity();
        return;
      } else {
        this.verificationToDate.setValidators(null);
        this.verificationToDate.updateValueAndValidity();
      }
    }

    if (this.negotiateFromDate.value) {
      const negotiateFromDate = this.convertTimeToBeginningOfTheDay(this.negotiateFromDate.value);
      const verificationFromDate = this.convertTimeToBeginningOfTheDay(this.verificationFromDate.value);
      if (negotiateFromDate.getTime() > new Date().getTime()) {
        this.negotiateFromDateErrorMsg = `Thương lượng từ ngày không lớn hơn ngày hiện tại`;
        this.notificationService.showNotification(Constant.ERROR, this.negotiateFromDateErrorMsg);
        this.negotiateFromDate.setValue(null);
        this.negotiateFromDate.setValidators([dateValidator(true)]);
        this.negotiateFromDate.updateValueAndValidity();
        return;
      } else if (negotiateFromDate.getTime() < verificationFromDate.getTime()) {
        this.negotiateFromDateErrorMsg = `Thương lượng từ ngày phải lớn hơn hoặc bằng Xác minh từ ngày`;
        this.notificationService.showNotification(Constant.ERROR, this.negotiateFromDateErrorMsg);
        this.negotiateFromDate.setValue(null);
        this.negotiateFromDate.setValidators([dateValidator(true)]);
        this.negotiateFromDate.updateValueAndValidity();
        return;
      } else {
        this.negotiateFromDate.setValidators(null);
        this.negotiateFromDate.updateValueAndValidity();
      }
    }

    if (this.negotiateToDate.value) {
      const negotiateToDate = this.convertTimeToBeginningOfTheDay(this.negotiateToDate.value);
      const verificationToDate = this.convertTimeToBeginningOfTheDay(this.verificationToDate.value);
      const decisionCompensationIndate = this.convertTimeToBeginningOfTheDay(this.decisionCompensationIndate.value);
      if (negotiateToDate.getTime() < verificationToDate.getTime()) {
        this.negotiateToDateErrorMsg = `Ngày kết thúc thương lượng phải lớn hơn hoặc bằng Ngày kết thúc xác minh`;
        this.notificationService.showNotification(Constant.ERROR, this.negotiateToDateErrorMsg);
        this.negotiateToDate.setValue(null);
        this.negotiateToDate.setValidators([dateValidator(true)]);
        this.negotiateToDate.updateValueAndValidity();
        return;
      } else if (negotiateToDate.getTime() > decisionCompensationIndate.getTime()) {
        this.negotiateToDateErrorMsg = `Ngày kết thúc thương lượng phải nhỏ hơn hoặc bằng Ngày ra QĐ/BA`;
        this.notificationService.showNotification(Constant.ERROR, this.negotiateToDateErrorMsg);
        this.negotiateToDate.setValue(null);
        this.negotiateToDate.setValidators([dateValidator(true)]);
        this.negotiateToDate.updateValueAndValidity();
        return;
      } else {
        this.negotiateToDate.setValidators(null);
        this.negotiateToDate.updateValueAndValidity();
      }
    }

    if (this.decisionEnforcementIndate.value) {
      const decisionEnforcementIndate = this.convertTimeToBeginningOfTheDay(this.decisionEnforcementIndate.value);
      const decisionCompensationDate = this.convertTimeToBeginningOfTheDay(this.decisionCompensationDate.value);
      if (decisionEnforcementIndate.getTime() > new Date().getTime()) {
        this.decisionEnforcementIndateErrorMsg = `Ngày ra quyết định không lớn hơn ngày hiện tại`;
        this.notificationService.showNotification(Constant.ERROR, this.decisionEnforcementIndateErrorMsg);
        this.decisionEnforcementIndate.setValue(null);
        this.decisionEnforcementIndate.setValidators([dateValidator(true)]);
        this.decisionEnforcementIndate.updateValueAndValidity();
        return;
      } else if (decisionEnforcementIndate.getTime() < decisionCompensationDate.getTime()) {
        this.decisionEnforcementIndateErrorMsg = `Ngày ra quyết định phải lớn hơn hoặc bằng Ngày thụ lý`;
        this.notificationService.showNotification(Constant.ERROR, this.decisionEnforcementIndateErrorMsg);
        this.decisionEnforcementIndate.setValue(null);
        this.decisionEnforcementIndate.setValidators([dateValidator(true)]);
        this.decisionEnforcementIndate.updateValueAndValidity();
        return;
      } else {
        this.decisionEnforcementIndate.setValidators(null);
        this.decisionEnforcementIndate.updateValueAndValidity();
      }
    }

    if (this.judgmentCompensationDate.value) {
      const judgmentCompensationDate = this.convertTimeToBeginningOfTheDay(this.judgmentCompensationDate.value);
      const decisionCompensationDate = this.convertTimeToBeginningOfTheDay(this.decisionCompensationDate.value);
      if (judgmentCompensationDate.getTime() > new Date().getTime()) {
        this.judgmentCompensationDateErrorMsg = `Ngày ra bản án không lớn hơn ngày hiện tại`;
        this.notificationService.showNotification(Constant.ERROR, this.judgmentCompensationDateErrorMsg);
        this.judgmentCompensationDate.setValue(null);
        this.judgmentCompensationDate.setValidators([dateValidator(true)]);
        this.judgmentCompensationDate.updateValueAndValidity();
        return;
      } else if (judgmentCompensationDate.getTime() < decisionCompensationDate.getTime()) {
        this.judgmentCompensationDateErrorMsg = `Ngày ra bản án phải lớn hơn hoặc bằng Ngày thụ lý`;
        this.notificationService.showNotification(Constant.ERROR, this.judgmentCompensationDateErrorMsg);
        this.judgmentCompensationDate.setValue(null);
        this.judgmentCompensationDate.setValidators([dateValidator(true)]);
        this.judgmentCompensationDate.updateValueAndValidity();
        return;
      } else {
        this.judgmentCompensationDate.setValidators(null);
        this.judgmentCompensationDate.updateValueAndValidity();
      }
    }
    if (this.myForm.invalid) {
      for (const key in this.myForm.controls) {
        if (this.myForm.controls.hasOwnProperty(key)) {
          this.myForm.controls[key].markAsDirty();
          this.myForm.controls[key].updateValueAndValidity();
        }
      }
      this.notificationService.showNotification(Constant.ERROR, 'Vui lòng nhập các trường bắt buộc đánh dấu *');
      return;
    }
    this.showConfirmSave();
  }

  showConfirmSave(): void {
    this.isSpinning = true;
    this.confirmModalRef = this.modalService.create({
      nzTitle: this.confirmHeaderTemplate,
      nzContent: this.confirmTemplate,
      nzClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: 'Có', onClick: () => {
            // getRawValue() thì mới lấy được value ở trường bị disable (chẳng hạn id)
            this.saveData(this.myForm.getRawValue());
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

  saveData(model: Compensation) {
    const request = {
      ...model,
      decisionEnforcementSigner: this.stringService.capitalize(model.decisionEnforcementSigner),
      compensationDate: this.dateToString(model.compensationDate),
      petitionDate: model.petitionDate ? this.dateToString(model.petitionDate) : null,
      claimantBirthday: model.claimantBirthday ? this.dateToString(model.claimantBirthday) : null,
      damagesBirthday: model.damagesBirthday ? this.dateToString(model.damagesBirthday) : null,
      decisionCompensationDate: model.decisionCompensationDate ? this.dateToString(model.decisionCompensationDate) : null,
      decisionCompensationIndate: model.decisionCompensationIndate ? this.dateToString(model.decisionCompensationIndate) : null,
      sppId: this.userInfo.sppid,
      resultUnitsId: this.resultUnitsId.value ? this.getResultUnitsId() : null,
      resultUnitsName: this.resultUnitsId.value ? this.getResultUnitsName() : null,
      verificationFromDate: model.verificationFromDate ? this.dateToString(model.verificationFromDate) : null,
      verificationToDate: model.verificationToDate ? this.dateToString(model.verificationToDate) : null,
      negotiateFromDate: model.negotiateFromDate ? this.dateToString(model.negotiateFromDate) : null,
      negotiateToDate: model.negotiateToDate ? this.dateToString(model.negotiateToDate) : null,
      decisionEnforcementIndate: model.decisionEnforcementIndate ? this.dateToString(model.decisionEnforcementIndate) : null,
      judgmentCompensationDate: model.judgmentCompensationDate ? this.dateToString(model.judgmentCompensationDate) : null,
      resultDate: model.resultDate ? this.dateToString(model.resultDate) : null,
      compensationDocumentList: this.convertDateToStringFromObject1(),
      compensationDetailList: this.convertDateToStringFromObject2(),
      compensationDamagesList: this.convertDateToStringFromObject3(),
      claimantName: this.stringService.capitalize(model.claimantName)
    }

    setTimeout(() => {
      let baseURL: string;
      let msg = 'Cập nhật dữ liệu thành công!';
      if (this.selectedItem && this.popupMode === ComponentMode.UPDATE) {
        baseURL = this.soThuLyService.SOTHULY_URL + 'compensation/update/';
      } else {
        msg = 'Thêm mới dữ liệu thành công!';
        baseURL = this.soThuLyService.SOTHULY_URL + 'compensation/create/';
      }
      this.soThuLyService.postRequest(baseURL, request)
        .subscribe((resp: ResponseBody) => {
          if (resp.responseCode === '0000') {
            this.notificationService.showNotification(Constant.SUCCESS, msg);
            this.compensationDocumentList = [];
            this.compensationDetailList = [];
            this.clearForm();
          } else {
            this.notificationService.showNotification(Constant.ERROR, resp.responseMessage);
          }
          this.closeChange.emit(false);
          this.isSpinning = false;
        }, error => {
          this.notificationService.showNotification(Constant.ERROR, error);
          this.closeChange.emit(false);
          this.isSpinning = false;
        });
    }, 500);
  }

  /*
   * Form element & validate
   */
  clearForm(): void {
    this.myForm.reset();
  }

  get indemnifyEnforcement(): AbstractControl {
    return this.myForm.get('indemnifyEnforcement');
  }

  get indemnifyCompensation(): AbstractControl {
    return this.myForm.get('indemnifyCompensation');
  }

  get resultCode(): AbstractControl {
    return this.myForm.get('resultCode');
  }

  get resultDate(): AbstractControl {
    return this.myForm.get('resultDate');
  }

  get compensationDate(): AbstractControl {
    return this.myForm.get('compensationDate');
  }

  get decisionCompensationDate(): AbstractControl {
    return this.myForm.get('decisionCompensationDate');
  }

  get decisionCompensationIndate(): AbstractControl {
    return this.myForm.get('decisionCompensationIndate');
  }

  get verificationToDate(): AbstractControl {
    return this.myForm.get('verificationToDate');
  }

  get verificationFromDate(): AbstractControl {
    return this.myForm.get('verificationFromDate');
  }

  get negotiateFromDate(): AbstractControl {
    return this.myForm.get('negotiateFromDate');
  }

  get negotiateToDate(): AbstractControl {
    return this.myForm.get('negotiateToDate');
  }

  get decisionEnforcementIndate(): AbstractControl {
    return this.myForm.get('decisionEnforcementIndate');
  }

  get judgmentCompensationDate(): AbstractControl {
    return this.myForm.get('judgmentCompensationDate');
  }

  /*
   * Date
   */
  disabledDate = (inputDate: Date): boolean => {
    if (!inputDate) {
      return false;
    }
    return inputDate.getTime() > new Date().getTime();
  };

  convertTimeToBeginningOfTheDay(date: Date | string): Date {
    if (date instanceof Date) {
      date.setHours(0, 0, 0, 0);
    } else {
      date = this.stringToDateWithFormat(date, 'dd/MM/yyyy');
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  dateToString(date: Date | string): string {
    if (date instanceof Date) {
      return this.datePipe.transform(date, 'dd/MM/yyyy');
    } else {
      return this.datePipe.transform(this.convertTimeToBeginningOfTheDay(date), 'dd/MM/yyyy')
    }
  }

  stringToDate(date: string | Date): Date {
    return this.parsePipe.transform(date, 'DD/MM/YYYY').toDate();
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  onDateValueChange(event: any, formControl: AbstractControl): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.showNotification(Constant.ERROR, 'Sai định dạng ngày tháng dd/MM/yyyy.');
        formControl.setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.showNotification(Constant.ERROR, 'Ngày tháng không hợp lệ.');
        formControl.setValue(null);
        return;
      } else {
        formControl.setValue(date);
      }
    }
  }

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  onOpenModalDocument() {
    this.isVisibleDocument = true;
  }

  onCloseModalDocument(data: CompensationDocument[]) {
    this.isVisibleDocument = false;
    this.compensationDocumentList = [...data];
  }

  resultAgencyChange(value: string): void {
    this.isSpinning = true;
    this.resultUnitsId.setValue(null);
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
          this.myForm.get('resultUnitsId').clearValidators();
          this.myForm.get('resultUnitsId').updateValueAndValidity();
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

  get resultAgency(): AbstractControl {
    return this.myForm.get('resultAgency');
  }

  get resultUnitsId(): AbstractControl {
    return this.myForm.get('resultUnitsId');
  }

  onFocusResultUnitsId(e: any) {
    if (!this.resultAgency.value) {
      this.notificationService.showNotification(Constant.ERROR, 'Yêu cầu chọn Cơ quan vi phạm trước');
    }
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

  onDataChange(listOfItems: CompensationDetail[]) {
    this.compensationDetailList = listOfItems;
  }

  onDataDamageChane(listOfItems: CompensationDamage[]) {
    this.compensationDamagesList = listOfItems;
  }

  getResultUnitsName(): string {
    if (this.resultAgency.value === 'SPP') {
      return this.resultUnitsId.value.name;
    } else if (this.resultAgency.value === '10') {
      return 'Cảnh sát biển';
    } else if (this.resultAgency.value === '12') {
      return 'Cơ quan khác';
    } else {
      if (this.resultUnitsId.value.NAME) {
        return this.resultUnitsId.value.NAME;
      } else {
        return  this.resultUnitsId.value;
      }
    }
  }

  getResultUnitsId(): string {
    if (this.resultUnitsId.value) {
      switch (this.resultAgency.value) {
        case '02':
          if (this.resultUnitsId.value.POLICEID) {
            return this.resultUnitsId.value.POLICEID;
          } else {
            const index = this.resultUnitsId.value.indexOf(' - ');
            return this.resultUnitsId.value.substring(0,index);
          }
        case '04':
          if (this.resultUnitsId.value.ARMYID) {
            return this.resultUnitsId.value.ARMYID;
          } else {
            const index = this.resultUnitsId.value.indexOf(' - ');
            return this.resultUnitsId.value.substring(0,index);
          }
        case '06':
          if (this.resultUnitsId.value.CUSTOMID) {
            return this.resultUnitsId.value.CUSTOMID;
          } else {
            const index = this.resultUnitsId.value.indexOf(' - ');
            return this.resultUnitsId.value.substring(0,index);
          }
        case '08':
          if (this.resultUnitsId.value.RANGID) {
            return this.resultUnitsId.value.RANGID;
          } else {
            const index = this.resultUnitsId.value.indexOf(' - ');
            return this.resultUnitsId.value.substring(0,index);
          }
        case '09':
          if (this.resultUnitsId.value.BORGUAID) {
            return this.resultUnitsId.value.BORGUAID;
          } else {
            const index = this.resultUnitsId.value.indexOf(' - ');
            return this.resultUnitsId.value.substring(0,index);
          }
        case '10':
        case '12':
          return this.resultAgency.value;
        case 'SPC':
          if (this.resultUnitsId.value.SPCID) {
            return this.resultUnitsId.value.SPCID;
          } else {
            const index = this.resultUnitsId.value.indexOf(' - ');
            return this.resultUnitsId.value.substring(0,index);
          }
        case 'SPP':
          if (this.resultUnitsId.value.sppid) {
            return this.resultUnitsId.value.sppid;
          } else {
            const index = this.resultUnitsId.value.indexOf(' - ');
            return this.resultUnitsId.value.substring(0,index);
          }
      }
    }
  }

  private convertDateToStringFromObject1() {
    let data: CompensationDocument[] = [];
    if (this.compensationDocumentList) {
      data = JSON.parse(JSON.stringify(this.compensationDocumentList));
      if (data instanceof Array) {
        for (const obj of data) {
          obj.deadlines = obj.deadlines ? this.dateToString(new Date(obj.deadlines)) : null;
        }
      }
    }
    return data;
  }

  private convertDateToStringFromObject2() {
    let data: CompensationDetail[] = [];
    if (this.compensationDetailList) {
      data = JSON.parse(JSON.stringify(this.compensationDetailList));
      if (data instanceof Array) {
        for (const obj of data) {
          obj.documentaryDate = obj.documentaryDate ? this.dateToString(new Date(obj.documentaryDate)) : null;
          obj.financeDate = obj.financeDate ? this.dateToString(new Date(obj.financeDate)) : null;
          obj.compensationEnforceDate = obj.compensationEnforceDate ? this.dateToString(new Date(obj.compensationEnforceDate)) : null;
          obj.restoreHonorDate = obj.restoreHonorDate ? this.dateToString(new Date(obj.restoreHonorDate)) : null;
        }
      }
    }
    return data;
  }

  private convertDateToStringFromObject3() {
    let data: CompensationDamage[] = [];
    if (this.compensationDamagesList) {
      data = JSON.parse(JSON.stringify(this.compensationDamagesList));
      if (data instanceof Array) {
        for (const obj of data) {
          obj.damagesBirthday = obj.damagesBirthday ? this.dateToString(new Date(obj.damagesBirthday)) : null;
        }
      }
    }
    return data;
  }

  private convertStringToDateFromObject1() {
    const data: CompensationDocument[] = this.compensationDocumentList;
    if (data.length > 0) {
      if (data instanceof Array) {
        for (const obj of data) {
          obj.deadlines = obj.deadlines ? this.stringToDate(obj.deadlines) : null;
        }
      }
    }
    return data;
  }

  private convertStringToDateFromObject2() {
    const data: CompensationDetail[] = this.compensationDetailList;
    if (data.length > 0) {
      if (data instanceof Array) {
        for (const obj of data) {
          obj.documentaryDate = obj.documentaryDate ? this.stringToDate(obj.documentaryDate) : null;
          obj.financeDate = obj.financeDate ? this.stringToDate(obj.financeDate) : null;
          obj.compensationEnforceDate = obj.compensationEnforceDate ? this.stringToDate(obj.compensationEnforceDate) : null;
          obj.restoreHonorDate = obj.restoreHonorDate ? this.stringToDate(obj.restoreHonorDate) : null;
        }
      }
    }
    return data;
  }

  private convertStringToDateFromObject3() {
    const data: CompensationDamage[] = this.compensationDamagesList;
    if (data.length > 0) {
      if (data instanceof Array) {
        for (const obj of data) {
          obj.damagesBirthday = obj.damagesBirthday ? this.stringToDate(obj.damagesBirthday) : null;
        }
      }
    }
    return data;
  }
  checkBtnDocument = () => this.resultCode.value === 6 ?  true : false;

  sNote = () => this.resultCode.value === 4 ?  'Lý do' : 'Ghi chú';

  checkIndemnifyCompensation = () => this.indemnifyCompensation.value;

  checkIndemnifyEnforcement = () => this.indemnifyEnforcement.value;

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  convertCccd() {
    const ex = this.myForm.get('claimantCccd').value;
    const newC = ex.replace(/[a-z]+/img,'');
    return this.myForm.get('claimantCccd').setValue(newC);
  }


  onInputInspector(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (value === ' ') value = '0';
    if (!value || value.indexOf('@') >= 0) {
      this.lstInpectors = [];
    } else {
      this.categoriesService.getLstInspectorByQuery(value, 'ALL', this.sppId).subscribe(res => {
        this.lstInpectors = res;
      });
    }
  }

  handleChangeSignname() {
    if (this.lstInpectors) {
      const rs = this.lstInpectors.find(s => s.FULLNAME === this.myForm.get('resultHandler').value);
      if (rs) {
        this.categoriesService.getInspectorByinpcode(rs?.INSPCODE).subscribe(res => {
          this.inspectorOpions = [res];
          this.myForm.get('resultPositionHandler').setValue(res.JOBTITLE);
        }, err => {
          console.log(err.error.text);
        });
      }
    }
  }
}
