import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges, TemplateRef,
  ViewChild
} from '@angular/core';
import {ComponentMode} from '../../../../shared/constants/constant.class';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from '../../../../shared/custom-validator/custom-validator.class';
import {Subscription} from 'rxjs';
import {ReviewCaseAccusedModel, ReviewCaseRequestModel} from '../model/review-case-model';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-review-case-request-detail',
  templateUrl: './review-case-request-detail.component.html',
  styleUrls: ['./review-case-request-detail.component.scss']
})
export class ReviewCaseRequestDetailComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('reviewCaseRequestFormTag') reviewCaseRequestFormTag;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @Input() isVisibleDialog: boolean;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() reviewCaseRequest: ReviewCaseRequestModel;
  @Input() fullAccusedList: ReviewCaseAccusedModel[] = [];
  @Output() onSave: EventEmitter<ReviewCaseRequestModel> = new EventEmitter<ReviewCaseRequestModel>();
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  isCollapse = true;
  modeEnum = ComponentMode;
  reviewCaseRequestForm: FormGroup = this.fb.group({
    accusedCode: ['', [CustomValidator.validateNoFullSpace,
      Validators.maxLength(200),
    ]],
    requestNum: ['', [CustomValidator.validateNoFullSpace,
      Validators.maxLength(200),
    ]],
    dRequestDate: [null, [CustomValidator.checkDateAndCurrentDate]],
    requestOffice: ['', Validators.maxLength(500)]
  });
  subscription: Subscription = new Subscription();

  theFirstClick: boolean;
  defaultIaHandlingOfficer: string;

  disabledEndDate = (dateValue: Date): boolean => {
    if (!dateValue) {
      return false;
    }
    return dateValue.getTime() > new Date().getTime();
  };

  constructor(private fb: FormBuilder,
              private modalService: NzModalService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisibleDialog) {
      this.reviewCaseRequestForm.reset();
    }
    if (changes['isVisibleDialog'] && this.isVisibleDialog) {
      this.theFirstClick = true;
      this.reviewCaseRequestForm.reset();
      if (this.reviewCaseRequest) {
        switch (this.mode) {
          case ComponentMode.VIEW:
          case ComponentMode.VIEW_FROM_PARENT:
            this.reviewCaseRequestForm.disable();
            this.reviewCaseRequestForm.patchValue({
              ...this.reviewCaseRequest
            });
            break;
          case ComponentMode.UPDATE:
            this.reviewCaseRequestForm.enable();
            this.reviewCaseRequestForm.patchValue({
              ...this.reviewCaseRequest
            });
            break;
          case ComponentMode.CREATE:
            this.reviewCaseRequestForm.enable();
            break;
        }
      } else {
        this.reviewCaseRequestForm.enable();
      }
    }
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
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
            this.handleOk();
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

  onSubmit(){
    switch (this.mode) {
      case ComponentMode.UPDATE:
        this.showConfirmSave();
        break;
      case ComponentMode.CREATE:
        this.handleOk();
        break
    }
  }

  handleOk() {
    for (const key in this.reviewCaseRequestForm.controls) {
      this.reviewCaseRequestForm.controls[key].markAsDirty();
      this.reviewCaseRequestForm.controls[key].updateValueAndValidity();
    }
    this.reviewCaseRequestForm.updateValueAndValidity();
    if (this.reviewCaseRequestForm.invalid) {
      // this.onSave.emit(null);
      for (const control in this.reviewCaseRequestForm.controls) {
        const error = this.reviewCaseRequestForm.controls[control].errors;
        if (error) {
          // console.log(error);
        }
      }
    } else {

      const denouncedPersonModel: ReviewCaseRequestModel = {...this.reviewCaseRequest, ...this.reviewCaseRequestForm.value}
      for (const prop in denouncedPersonModel) {
        if (denouncedPersonModel.hasOwnProperty(prop) && denouncedPersonModel[prop] && typeof denouncedPersonModel[prop] === 'string') {
          denouncedPersonModel[prop] = denouncedPersonModel[prop]?.trim();
        }
      }
      this.onSave.emit(denouncedPersonModel);
      this.isVisibleDialog = false;
    }
  }

  handleCancel() {
    this.onCancel.emit();
  }

  submit() {
    this.reviewCaseRequestFormTag.nativeElement.submit();
  }

  ngOnDestroy(): void {
    // if (this.dateSub) {
    //   this.dateSub.unsubscribe();
    // }
    this.subscription.unsubscribe();
  }

  onSearchAccused(e) {
    // chặn lần click đầu tiên search empty
    if (this.theFirstClick) {
      e = this.defaultIaHandlingOfficer;
      this.theFirstClick = false;
    }
  }
}
