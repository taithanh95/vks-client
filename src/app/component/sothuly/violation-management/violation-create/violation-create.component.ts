import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../../../../shared/constants/constant.class';
import * as moment from 'moment';
import {NotificationService} from '../../../../service/notification.service';
import {ViolationLaw} from '../model/violation-law';
import {CategoriesService} from '../../../../service/categories.service';
import {SoThuLyService} from '../../../so-thu-ly/service/so-thu-ly.service';
import {ResponseBody} from '../../../so-thu-ly/model/response-body';
import {ParsePipe} from 'ngx-moment';
import {DatePipe} from '@angular/common';
import {ViolationLegislationDocument} from '../model/violation-legislation-document';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {ViolationResult} from '../model/violation-result';

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
  selector: 'app-violation-create',
  templateUrl: './violation-create.component.html',
  styleUrls: ['./violation-create.component.scss']
})
export class ViolationCreateComponent implements OnInit, OnChanges, OnDestroy {
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isVisible: boolean
  myForm: FormGroup;
  isSpinning: boolean;
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
  userInfo: any;
  selectedSpp: any;
  violationLegislationDocumentList: ViolationLegislationDocument[] = [];
  violationResultList: ViolationResult[] = [];
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;

  constructor(private fb: FormBuilder,
              private categoriesService: CategoriesService,
              private notificationService: NotificationService,
              private soThuLyService: SoThuLyService,
              private parsePipe: ParsePipe,
              private datePipe: DatePipe,
              private modalService: NzModalService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisible && this.isVisible) {
      this.violationLegislationDocumentList = [];
      this.violationResultList = [];
    }
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.selectedSpp = JSON.parse(localStorage.getItem(Constant.SPP));
    this.myForm = this.fb.group({
      id: [{value: null, disabled: true}],
      violationDate: [null, [Validators.required]],
      violatedAgency: [null, [Validators.required]],
      violatedUnitsId: [null, [Validators.required]],
      violatedUnitsName: [null],
      resultCode: [null],
      resultNumber: [null],
      resultDate: [null, [this.resultDateValidator]],
      resultContent: [null],
      note: [null],
      sppId: [null]
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

  handleCancel(): void {
    this.clearForm();
    this.closeChange.emit(false);
  }

  convertDateToStringFromObject(): ViolationLegislationDocument[] {
    let data: ViolationLegislationDocument[] = [];
    if (this.violationLegislationDocumentList) {
      data = JSON.parse(JSON.stringify(this.violationLegislationDocumentList));
      if (data instanceof Array) {
        for (const obj of data) {
          obj.documentDate = obj.documentDate ? this.dateToString(new Date(obj.documentDate)) : null;
        }
      }
    }
    return data;
  }

  convertDateInViolationResult(): ViolationResult[] {
    let data: ViolationResult[] = [];
    if (this.violationResultList) {
      data = JSON.parse(JSON.stringify(this.violationResultList));
      if (data instanceof Array) {
        for (const obj of data) {
          obj.resultDate = obj.resultDate ? this.dateToString(new Date(obj.resultDate)) : null;
        }
      }
    }
    return data;
  }

  onSubmit(): void {
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
    if ( !['10','12'].includes(this.myForm.get('violatedAgency').value) &&
      !this.myForm.get('violatedUnitsId').value.NAME
      && !this.myForm.get('violatedUnitsId').value.name){
      this.isSpinning = true;
      this.notificationService.showNotification(Constant.ERROR, 'Đơn vị vi phạm không hợp lệ');
      return;
    }
    const violationDate = this.convertTimeToBeginningOfTheDay(this.violationDate.value);
    if (violationDate.getTime() > new Date().getTime()) {
      this.notificationService.showNotification(Constant.ERROR,
        `Ngày vi phạm không lớn hơn ngày hiện tại: ${this.dateToString(new Date())}`);
      this.violationDate.setValue(null);
      return;
    }
    this.showConfirm();
  }

  showConfirm(): void {
    this.isSpinning = true;
    this.confirmModalRef = this.modalService.create({
      nzTitle: this.confirmHeaderTemplate,
      nzContent: this.confirmTemplate,
      nzClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: 'Có', onClick: () => {
            this.saveData(this.myForm.value);
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

  saveData(model: ViolationLaw) {
    const request = {
      ...model,
      violationDate: this.dateToString(model.violationDate),
      resultDate: model.resultDate ? this.dateToString(model.resultDate) : null,
      sppId: this.userInfo.sppid,
      violatedUnitsId: this.getViolatedUnitsId(),
      violatedUnitsName: this.getViolatedUnitsName(),
      violationLegislationDocumentList: this.convertDateToStringFromObject(),
      violationResultLists: this.convertDateInViolationResult()
    }

    setTimeout(() => {
      this.soThuLyService.postRequest(this.soThuLyService.SOTHULY_URL + 'violation/create/', request)
      .subscribe((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới dữ liệu thành công!');
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
  violatedAgencyChange(value: string): void {
    this.isSpinning = true;
    if (value) {
      this.myForm.patchValue({violatedUnitsId :null});
      this.myForm.get('violatedUnitsId').clearValidators();
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
      this.violatedUnitsId.setValue(null);
      this.lstPolices = [];
      this.lstArmies = [];
      this.lstCustoms = [];
      this.lstRangers = [];
      this.lstBorderGuards = [];
      this.lstSpps = [];
      this.lstSpcs = [];
    }
  }

  clearForm(): void {
    this.myForm.reset();
  }

  get violatedAgency(): AbstractControl {
    return this.myForm.get('violatedAgency');
  }

  get violatedUnitsId(): AbstractControl {
    return this.myForm.get('violatedUnitsId');
  }

  getViolatedUnitsName(): string {
    if (this.violatedAgency.value === 'SPP') {
      return this.violatedUnitsId.value.name;
    } else if (this.violatedAgency.value === '10') {
      return 'Cảnh sát biển';
    } else if (this.violatedAgency.value === '12') {
      return 'Cơ quan khác';
    } else {
      return this.violatedUnitsId.value.NAME;
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

  get violationDate(): AbstractControl {
    return this.myForm.get('violationDate');
  }

  resultDateValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) return {}

    const resultDate = (control.value) ? this.convertTimeToBeginningOfTheDay(control.value) : null;
    const violationDate = (this.violationDate.value) ? this.convertTimeToBeginningOfTheDay(this.violationDate.value) : null;
    if (resultDate && violationDate && (resultDate.getTime() < violationDate.getTime())) {
      return {error: true};
    }
    return {};
  };

  /*
   * Date
   */
  disabledViolationDate = (violationDate: Date): boolean => {
    if (!violationDate) {
      return false;
    }
    return violationDate.getTime() > new Date().getTime();
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

  onDataChange(listOfItems: ViolationLegislationDocument[]) {
    this.violationLegislationDocumentList = listOfItems;
  }

  onViolationResultDataChange(listOfItems: ViolationResult[]) {
    this.violationResultList = listOfItems;
  }

  ngOnDestroy(): void {
  }

  onFocusViolatedUnitsId(e: any) {
    if (!this.violatedAgency.value) {
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
      this.lstSpcsChange$.next(value);
    }
  }
}
