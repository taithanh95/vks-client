import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DenouncedPersonModel} from '../../../../../model/denounced-person.model';
import {ComponentMode, Constant} from '../../../../../shared/constants/constant.class';
import {Subscription} from 'rxjs';
import {CustomValidator} from '../../../../../shared/custom-validator/custom-validator.class';
import * as moment from 'moment';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {ParsePipe} from 'ngx-moment';
import {DatePipe} from '@angular/common';
import {StringService} from "../../../../../common/util/string.service";

@Component({
  selector: 'app-denounced-person-detail',
  templateUrl: './denounced-person-detail.component.html',
  styleUrls: ['./denounced-person-detail.component.scss'],
  providers: [
    ParsePipe
  ]
})
export class DenouncedPersonDetailComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('denouncedPersonFormTag') denouncedPersonFormTag;
  @Input() isVisibleDialog: boolean;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() denouncedPerson: DenouncedPersonModel;
  @Output() saveEmitter: EventEmitter<DenouncedPersonModel> = new EventEmitter<DenouncedPersonModel>();
  @Output() cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
  isCollapse = true;
  modeEnum = ComponentMode;
  denouncedPersonForm: FormGroup = this.fb.group({
    fullName: ['', [CustomValidator.validateNoFullSpace,
      Validators.maxLength(200),
    ]],
    yearOfBirth: [null, [Validators.pattern(Constant.PATTERN_ONLY_NUMBER), Validators.maxLength(4)]],
    dateOfBirth: [null, [CustomValidator.checkDateAndCurrentDate]],
    job: ['', Validators.maxLength(500)],
    workplace: ['', Validators.maxLength(500)],
    address: ['', Validators.maxLength(500)],
    cccd: [null, [Validators.maxLength(12), Validators.minLength(9)]],
  });
  subscription: Subscription = new Subscription();
  isConfirmLoading = false;
  clicked = false;

  constructor(private fb: FormBuilder,
              private parsePipe: ParsePipe,
              private notificationService: NzNotificationService,
              private stringService: StringService,
              ) {
  }

  ngOnInit(): void {
    this.dateOfBirthValueChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisibleDialog) {
      this.denouncedPersonForm.reset();
    }
    if (changes.isVisibleDialog && this.isVisibleDialog) {
      this.denouncedPersonForm.reset();
      if (this.denouncedPerson) {
        switch (this.mode) {
          case ComponentMode.VIEW:
          case ComponentMode.VIEW_FROM_PARENT:
            this.denouncedPersonForm.disable();
            this.denouncedPersonForm.patchValue({
              ...this.denouncedPerson
            });
            break;
          case ComponentMode.UPDATE:
            this.denouncedPersonForm.enable();
            this.denouncedPersonForm.patchValue({
              ...this.denouncedPerson
            });
            break;
          case ComponentMode.CREATE:
            this.denouncedPersonForm.enable();
            break;
        }
      } else {
        this.denouncedPersonForm.enable();
      }
    }
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  handleOk() {
    this.isConfirmLoading = true;
    Object.keys(this.denouncedPersonForm.controls).forEach(key => {
      this.denouncedPersonForm.get(key).markAsDirty();
      this.denouncedPersonForm.get(key).updateValueAndValidity();
      this.denouncedPersonForm.get('fullName').setValue(this.stringService.capitalize(this.denouncedPersonForm.get('fullName').value));
    });
    this.checkDateOfBirth();
    // this.denouncedPersonForm.get('fullName').setValue(this.stringService.capitalize(this.denouncedPersonForm.get('fullName').value));
    if (this.denouncedPersonForm.invalid) {
      this.isConfirmLoading = false;
    } else {
      setTimeout(() => {
        const denouncedPersonModel: DenouncedPersonModel = {...this.denouncedPerson, ...this.denouncedPersonForm.value};
        for (const prop in denouncedPersonModel) {
          if (denouncedPersonModel.hasOwnProperty(prop) && denouncedPersonModel[prop] && typeof denouncedPersonModel[prop] === 'string') {
            denouncedPersonModel[prop] = denouncedPersonModel[prop]?.trim();
          }
        }
        this.saveEmitter.emit(denouncedPersonModel);
        this.isConfirmLoading = false;
        this.isVisibleDialog = false;
      }, 1000);
    }
  }

  dateOfYearValueChange(e) {
    if (e && !isNaN(e) && this.denouncedPersonForm.get('yearOfBirth').valid) {
      this.denouncedPersonForm.get('dateOfBirth').setValue(this.convertYearToDate(e));
    }
  }

  stringToDate(date: string): Date {
    return this.parsePipe.transform(date, 'DD/MM/YYYY').toDate();
  }

  convertYearToDate(year: number) {
    return this.stringToDate(`31/12/${year}`);
  }

  dateOfBirthValueChange() {
    this.denouncedPersonForm.get('dateOfBirth').valueChanges.subscribe(
      value => {
        if (value && this.denouncedPersonForm.get('yearOfBirth').value !== value.getFullYear()) {
          this.denouncedPersonForm.get('yearOfBirth').setValue(value.getFullYear());
        }
      }
    );
  }

  checkDateOfBirth() {
    const yearOfBirth = Object.assign({}, this.denouncedPersonForm.get('yearOfBirth').value);
    const dateOfBirth = this.denouncedPersonForm.get('dateOfBirth').value;
    if (!dateOfBirth && (!yearOfBirth || isNaN(yearOfBirth))) {
      return;
    }

    if (!isNaN(yearOfBirth)) {
      this.denouncedPersonForm.get('yearOfBirth').setValue(Number(yearOfBirth));
    }
    if (dateOfBirth && isNaN(yearOfBirth)) {
      let newDate;
      if (typeof (dateOfBirth) === 'string') {
        newDate = new Date(dateOfBirth);
        this.denouncedPersonForm.get('yearOfBirth').setValue(newDate.getFullYear());
      } else {
        this.denouncedPersonForm.get('yearOfBirth').setValue(dateOfBirth.getFullYear());
      }
    } else if (!dateOfBirth && !isNaN(yearOfBirth)) {
      this.denouncedPersonForm.get('dateOfBirth').setValue(this.convertYearToDate(yearOfBirth));
    }
  }

  handleCancel() {
    this.cancelEmitter.emit();
  }

  submit() {
    this.denouncedPersonFormTag.nativeElement.submit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  onDateValueChange(event: any, formControl: AbstractControl): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.notificationService.error('Lỗi: ', 'Sai định dạng ngày tháng dd/MM/yyyy.');
        formControl.setValue(null);
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.notificationService.error('Lỗi: ', 'Ngày tháng không hợp lệ.');
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

  convertCccd() {
    const ex = this.denouncedPersonForm.get('cccd').value;
    const newC = ex.replace(/[a-z]+/img,'');
    return this.denouncedPersonForm.get('cccd').setValue(newC);
  }
}
