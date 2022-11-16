import {
  Component,
  EventEmitter,
  Input,
  OnChanges, OnInit,
  Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ComponentMode, Constant} from '../../../../../shared/constants/constant.class';
import {DisciplineViolationModel} from '../../../../../model/discipline-violation.model';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {DateService} from '../../../../../common/util/date.service';
import * as moment from 'moment';
import {NzNotificationService} from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-discipline-violation',
  templateUrl: './discipline-violation.component.html',
  styleUrls: ['./discipline-violation.component.scss']
})
export class DisciplineViolationComponent implements OnChanges, OnInit {
  @ViewChild('autoProcuratorList') autoProcuratorList: NzAutocompleteComponent;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() isVisibleDialog: boolean;
  @Input() disciplineViolationModel: DisciplineViolationModel;
  @Input() listViolationIndex: number;
  @Output() cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<string> = new EventEmitter();
  @Output() saveEmitter: EventEmitter<DisciplineViolationModel> = new EventEmitter<DisciplineViolationModel>();
  disciplineViolationForm: FormGroup = this.fb.group({
    violationDate: [null, [Validators.required]],
    punishmentType: [null, [Validators.maxLength(500)]],
    violationContent: [null, [Validators.maxLength(1000)]]
  });
  isCollapse = true;
  modeEnum = ComponentMode;
  violationOutput: DisciplineViolationModel;
  userInfo: any;
  isConfirmLoading = false;

  constructor(private fb: FormBuilder,
              private dateService: DateService,
              private notificationService: NzNotificationService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisibleDialog) {
      this.disciplineViolationForm.reset();
    }
    if (changes.isVisibleDialog && this.isVisibleDialog) {
      this.disciplineViolationForm.reset();
      if (this.disciplineViolationModel) {
        switch (this.mode) {
          case ComponentMode.VIEW:
          case ComponentMode.VIEW_FROM_PARENT:
            this.disciplineViolationForm.disable();
            this.disciplineViolationForm.patchValue({
              ...this.disciplineViolationModel
            });
            break;
          case ComponentMode.UPDATE:
            this.disciplineViolationForm.enable();
            this.disciplineViolationForm.patchValue({
              ...this.disciplineViolationModel
            });
            break;
          case ComponentMode.CREATE:
            this.disciplineViolationForm.enable();
            break;
        }
      } else {
        this.disciplineViolationForm.enable();
      }
      this.disciplineViolationForm.patchValue({
        violationDate: new Date(),
      })
      this.changeValue();
    }
  }

  changeValue() {
    // this.disciplineViolationForm.patchValue({
    //
    // })
  }

  validateForm() {
    if (this.disciplineViolationForm.invalid) {
      Object.keys(this.disciplineViolationForm.controls).forEach(key => {
        this.disciplineViolationForm.get(key).markAsDirty();
        this.disciplineViolationForm.get(key).updateValueAndValidity();
      });
    }
  }

  handleSave() {
    this.isConfirmLoading = true;
    this.validateForm();
    if (this.disciplineViolationForm.invalid) {
      this.isConfirmLoading = false;
      return;
    }
    setTimeout(() => {
      this.violationOutput = this.disciplineViolationForm.value;
      switch (this.mode) {
        case ComponentMode.UPDATE: {
          if (this.disciplineViolationModel) {
            this.violationOutput.createdBy = this.disciplineViolationModel.createdBy;
            this.violationOutput.createdAt = this.disciplineViolationModel.createdAt;
            this.violationOutput.updatedBy = this.userInfo.userid;
            this.violationOutput.updatedAt = this.convertDate(new Date());
          }
          break;
        }
        case ComponentMode.CREATE: {
          this.violationOutput.createdBy = this.userInfo.userid;
          this.violationOutput.createdAt = this.convertDate(new Date());
          break;
        }
      }
      this.saveEmitter.emit(this.violationOutput);
      this.isConfirmLoading = false;
    }, 500);
  }

  handleCancel() {
    this.isVisibleDialog = false;
    this.closeModal.emit('closeViolation');
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  convertDate(inputDate: any) {
    return this.dateService.convertDateToStringByPattern(inputDate, 'HH:mm:ss dd/MM/yyyy');
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  onDateValueChange(event: any, formControl: AbstractControl): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.error('Lỗi', 'Sai định dạng ngày tháng dd/MM/yyyy.');
        formControl.setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.error('Lỗi', 'Ngày tháng không hợp lệ.');
        formControl.setValue(null);
        return;
      } else {
        formControl.setValue(date);
      }
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}
