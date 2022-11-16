import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ReviewCaseAccusedModel, ReviewCaseModel} from '../model/review-case-model';
import {ReviewCaseAccusedListComponent} from '../review-case-accused-list/review-case-accused-list.component';
import {ReviewCaseRequestListComponent} from '../review-case-request-list/review-case-request-list.component';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../shared/constants/constant.class';
import {CategoriesService} from '../../../../service/categories.service';
import {ApParamService} from '../../../../service/apparam.service';
import {DatePipe} from '@angular/common';
import {DenouncementService} from '../../../../service/denouncement.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {LoaderService} from '../../../../service/loader.service';
import {ConstantService} from '../../../../service/constant.service';
import {CustomValidator} from '../../../../shared/custom-validator/custom-validator.class';
import {DateService} from '../../../../common/util/date.service';
import {Conclusion} from '../../../../manage/model/quan-ly-an.model';

@Component({
  selector: 'app-review-case-update',
  templateUrl: './review-case-update.component.html',
  styleUrls: ['./review-case-update.component.scss']
})
export class ReviewCaseUpdateComponent implements OnInit, OnChanges {

  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.VIEW;
  @Input() selectedCase: ReviewCaseModel;
  @Input() isVisibleUpdate: boolean;
  @Output() closeModal: EventEmitter<string> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @ViewChild(ReviewCaseAccusedListComponent, {static: false}) reviewCaseAccusedList: ReviewCaseAccusedListComponent;
  @ViewChild(ReviewCaseRequestListComponent, {static: false}) reviewCaseRequestList: ReviewCaseRequestListComponent;
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;
  userInfo: any;

  formReviewCase: FormGroup;
  police: any;
  defaultIaHandlingOfficer: string;
  procurators = [];
  arrCollapse = [];
  accesses = Constant.ACCESSES;
  desAccessLevel: string;
  isSpinning: boolean;
  selectedAccusedList = [];
  selectedRequestList = [];
  theFirstClick: boolean;
  fullAccusedList: ReviewCaseAccusedModel[];
  loading: boolean;
  pageSize: number[] = [5, 10, 15];
  conclusionList: Conclusion[];


  disabledEndDate = (dateValue: Date): boolean => {
    if (!dateValue) {
      return false;
    }
    return dateValue.getTime() > new Date().getTime();
  };

  constructor(private fb: FormBuilder,
              private categoriesService: CategoriesService,
              private apParamService: ApParamService,
              private datePipe: DatePipe,
              private modalService: NzModalService,
              private denouncementService: DenouncementService,
              private notificationService: NzNotificationService,
              private loaderService: LoaderService,
              private constantService: ConstantService,
              private dateService: DateService
  ) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.createFormControl();
    this.getConclusionList();
  }

  getConclusionList() {
    this.constantService.postRequest(this.constantService.MANAGE_URL + 'conclusion/getList/'
      , {}).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.conclusionList = resJson.responseData;
        }
      })
      .catch(err => {
        this.notificationService.error(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisibleUpdate && this.isVisibleUpdate) {
      this.theFirstClick = true;
      this.isSpinning = false;
      this.arrCollapse = [true, true, true, true];
      this.desAccessLevel = this.accesses.find(e => e.value === 0).des || '';
      this.formReviewCase.markAsPristine();
      this.formReviewCase.patchValue({
        shareInfoLevel: 0,
        caseCode: this.selectedCase?.caseCode,
      })
      this.valueChange();
    }
  }

  valueChange() {
    // this.getDefaultLevelShareInfo();
    this.shareInfoLevelValueChange();
    this.caseChange();
    this.getReviewCaseAccused();
  }

  // getDefaultLevelShareInfo() {
  //   if (this.userInfo) {
  //     this.denouncementService.getDefaultLevelShareInfo(this.userInfo.sppid).subscribe(data => {
  //       this.getControl('shareInfoLevel').setValue(data);
  //     })
  //   }
  // }

  createFormControl() {
    const disableInput = this.mode === this.modeEnum.VIEW_FROM_PARENT;
    this.formReviewCase = this.fb.group({
      id: [null],
      shareInfoLevel: [0],
      caseCode: [{value: null, disabled: true}],
      caseName: [{value: null, disabled: true}],
      conclusionNumber: [{value: null, disabled: disableInput}, [Validators.maxLength(12)]],
      dConclusionDate: [{value: null, disabled: disableInput}, [CustomValidator.checkDateAndCurrentDate]],
      conclusionId: [{value: null, disabled: disableInput}, [Validators.maxLength(3000)]],
      note: [{value: null, disabled: disableInput}, [Validators.maxLength(1000)]],
      reviewCaseAccusedList: [],
      reviewCaseRequestList: [],
    });
  }

  handleOk(): void {
  }

  handleCancel(): void {
    this.closeModal.emit('close');
    this.resetPage();
  }

  resetPage() {
    this.formReviewCase.reset();
    this.formReviewCase.patchValue({
      takenOverAgencyCode: Constant.TAKEN_OVER_AGENCY_CQDT,
      crimeReportSource: Constant.DENOUNCEMENT_TYPE_NEW,
      takenOverOfficer: this.userInfo.userid,
      sppid: this.userInfo.sppid,
      shareInfoLevel: 0
    })
    this.closeModal.emit('save');
    this.reviewCaseAccusedList.emptyList();
    this.reviewCaseRequestList.emptyList();
  }

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }

  validForm(): void {
    if (this.formReviewCase.invalid) {
      Object.keys(this.formReviewCase.controls).forEach(key => {
        this.formReviewCase.get(key).markAsDirty();
        this.formReviewCase.get(key).updateValueAndValidity();
      });
    }
    this.formReviewCase.updateValueAndValidity();
  }

  onSearchConclusion(e) {
    // chặn lần click đầu tiên search empty
    if (this.theFirstClick) {
      e = this.defaultIaHandlingOfficer;
      this.theFirstClick = false;
    }
  }

  shareInfoLevelValueChange() {
    const shareInfoLevelControl = this.formReviewCase.get('shareInfoLevel');
    shareInfoLevelControl.valueChanges.subscribe(
      value => {
        this.desAccessLevel = this.accesses.find(e => e.value === value)?.des || '';
      }
    )
  }

  caseChange() {
    this.formReviewCase.controls.caseCode.setValue(this.selectedCase?.caseCode);
    this.formReviewCase.controls.caseName.setValue(this.selectedCase?.caseName);
    this.formReviewCase.controls.conclusionNumber.setValue(this.selectedCase?.conclusionNumber);
    if (this.selectedCase && this.selectedCase.conclusionDate) {
      this.formReviewCase.controls.dConclusionDate.setValue(
        this.dateService.stringToDate(this.selectedCase?.conclusionDate, this.dateService.VN_DATE_FORMAT));
    }
    this.formReviewCase.controls.conclusionId.setValue(this.selectedCase?.conclusionId);
    this.formReviewCase.controls.note.setValue(this.selectedCase?.note);
  }

  getReviewCaseAccused() {
    if (this.selectedCase && this.selectedCase.caseCode) {
      this.constantService.postRequest(this.constantService.MANAGE_URL + 'accused/findByCaseCode/'
        , {
          caseCode: this.selectedCase.caseCode
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
          this.fullAccusedList = resJson.responseData;
          if (this.selectedRequestList && this.fullAccusedList) {
            for (const acc of this.fullAccusedList) {
              const obj = this.selectedAccusedList.filter(x => x.accusedCode === acc.accuCode);
              if (obj && obj.length > 0) {
                acc.isReviewed = true;
              }
            }
          }
        })
        .catch(err => {
          this.notificationService.error(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
        });

      this.selectedAccusedList = this.selectedCase.reviewCaseAccusedList;
      this.selectedRequestList = this.selectedCase.reviewCaseRequestList;
    }

  }

  getControl(controlName) {
    if (this.formReviewCase) {
      return this.formReviewCase.controls[controlName];
    }
  }

  hasError(controlName: string, errorName: string) {
    if (this.formReviewCase && this.formReviewCase.controls[controlName]) {
      return this.getControl(controlName).invalid &&
        (this.getControl(controlName).touched || this.getControl(controlName).dirty) &&
        this.getControl(controlName).hasError(errorName);
    }
  }

  onSubmitForm() {
    this.loaderService.show();
    this.validForm();
    if (this.formReviewCase.invalid) {
      return;
    }
    this.showConfirmSave();
  }

  saveData(): any {
    this.isSpinning = true;
    const objToSubmit = this.formReviewCase.value;
    for (const prop in objToSubmit) {
      if (objToSubmit.hasOwnProperty(prop) && objToSubmit[prop] && typeof objToSubmit[prop] === 'string') {
        objToSubmit[prop] = objToSubmit[prop]?.trim();
      }
    }
    const data: ReviewCaseModel = this.formReviewCase.value;
    data.reviewCaseAccusedList = this.reviewCaseAccusedList?.getActualPersonList();
    data.reviewCaseRequestList = this.reviewCaseRequestList?.getActualPersonList();
    data.status = GeneralModelStatus.ACTIVE;
    data.id = this.selectedCase?.id;
    data.caseCode = this.selectedCase?.caseCode;

    this.convertDate(data);

    this.isSpinning = false;

    setTimeout(() => {
      this.constantService.postRequest(this.constantService.SOTHULY_URL + 'reviewCase/updateReviewCase/'
        , data).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.selectedAccusedList = [...this.selectedAccusedList];
            this.selectedRequestList = [...this.selectedRequestList];
            this.notificationService.success('Cập nhật dữ liệu thành công', null)
          } else {
            // tslint:disable-next-line:max-line-length
            this.notificationService.error(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage)
          }
          this.isSpinning = false;
          this.resetPage();
        })
        .catch(err => {
          this.notificationService.error(Constant.ERROR, 'Hệ thống không có phản hồi.' + err)
        });
    }, 500);
  }

  convertDate(data: ReviewCaseModel) {
    if (data.dConclusionDate) {
      data.conclusionDate = this.dateService.dateToString(data.dConclusionDate, this.dateService.VN_DATE_FORMAT);
    }
    if (data.reviewCaseAccusedList && data.reviewCaseAccusedList.length > 0) {
      for (const r of data.reviewCaseAccusedList) {
        if (r.dJudgmentDate) {
          r.judgmentDate = this.dateService.dateToString(r.dJudgmentDate, this.dateService.VN_DATE_FORMAT);
        }
      }
    }
    if (data.reviewCaseRequestList && data.reviewCaseRequestList.length > 0) {
      for (const r of data.reviewCaseRequestList) {
        if (r.dRequestDate) {
          r.requestDate = this.dateService.dateToString(r.dRequestDate, this.dateService.VN_DATE_FORMAT);
        }
      }
    }
  }

  showConfirmSave(): void {
    this.confirmModalRef = this.modalService.create({
      nzTitle: this.confirmHeaderTemplate,
      nzContent: this.confirmTemplate,
      nzClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: 'Có', onClick: () => {
            this.saveData();
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

}
