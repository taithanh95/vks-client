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
import {ReviewCaseAccusedModel} from '../model/review-case-model';
import {ConstantService} from '../../../../service/constant.service';
import {NotificationService} from '../../../../service/notification.service';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-review-case-accused-detail',
  templateUrl: './review-case-accused-detail.component.html',
  styleUrls: ['./review-case-accused-detail.component.scss']
})
export class ReviewCaseAccusedDetailComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('reviewCaseAccusedFormTag') reviewCaseAccusedFormTag;
  @ViewChild('confirmHeader') confirmHeaderTemplate: TemplateRef<any>;
  confirmModalRef: NzModalRef<any>;
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
  @Input() isVisibleDialog: boolean;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() reviewCaseAccused: ReviewCaseAccusedModel;
  @Input() fullAccusedList: ReviewCaseAccusedModel[] = [];
  @Output() onSave: EventEmitter<ReviewCaseAccusedModel> = new EventEmitter<ReviewCaseAccusedModel>();
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  isCollapse = true;
  modeEnum = ComponentMode;
  reviewCaseAccusedForm: FormGroup = this.fb.group({
    accusedCode: ['', [CustomValidator.validateNoFullSpace,
      Validators.maxLength(200),
    ]],
    stage: ['', Validators.maxLength(500)],
    judgmentCode: ['', [CustomValidator.validateNoFullSpace, Validators.maxLength(500)]],
    judgmentNum: ['', Validators.maxLength(500)],
    dJudgmentDate: [null, [CustomValidator.checkDateAndCurrentDate]],
    judgmentContent: ['', Validators.maxLength(500)]
  });
  theFirstClick: boolean;
  defaultIaHandlingOfficer: string;

  subscription: Subscription = new Subscription();

  disabledEndDate = (dateValue: Date): boolean => {
    if (!dateValue) {
      return false;
    }
    return dateValue.getTime() > new Date().getTime();
  };

  constructor(private notificationService: NotificationService,
              private fb: FormBuilder,
              private constantService: ConstantService,
              private modalService: NzModalService,) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisibleDialog) {
      this.reviewCaseAccusedForm.reset();
    }
    if (changes.isVisibleDialog && this.isVisibleDialog) {
      this.theFirstClick = true;
      this.reviewCaseAccusedForm.reset();
      if (this.reviewCaseAccused) {
        switch (this.mode) {
          case ComponentMode.VIEW:
          case ComponentMode.VIEW_FROM_PARENT:
            this.reviewCaseAccusedForm.disable();
            this.reviewCaseAccusedForm.patchValue({
              ...this.reviewCaseAccused
            });
            break;
          case ComponentMode.UPDATE:
            this.reviewCaseAccusedForm.enable();
            this.reviewCaseAccusedForm.patchValue({
              ...this.reviewCaseAccused
            });
            break;
          case ComponentMode.CREATE:
            this.reviewCaseAccusedForm.enable();
            break;
        }
      } else {
        this.reviewCaseAccusedForm.enable();
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
    for (const key in this.reviewCaseAccusedForm.controls) {
      this.reviewCaseAccusedForm.controls[key].markAsDirty();
      this.reviewCaseAccusedForm.controls[key].updateValueAndValidity();
    }
    // this.checkDateOfBirth();
    this.reviewCaseAccusedForm.updateValueAndValidity();
    if (this.reviewCaseAccusedForm.invalid) {
      // this.onSave.emit(null);
      for (const control in this.reviewCaseAccusedForm.controls) {
        const error = this.reviewCaseAccusedForm.controls[control].errors;
        if (error) {
          // console.log(error);
        }
      }
    } else {

      const denouncedPersonModel: ReviewCaseAccusedModel = {...this.reviewCaseAccused, ...this.reviewCaseAccusedForm.value}
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
    this.reviewCaseAccusedFormTag.nativeElement.submit();
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
