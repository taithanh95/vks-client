  import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
  import {FormBuilder, FormGroup, Validators} from '@angular/forms';
  import {DenouncedPersonModel} from '../../../../../../model/denounced-person.model';
  import {ComponentMode} from '../../../../../../shared/constants/constant.class';
  import {Subscription} from 'rxjs';
  import {ParsePipe} from 'ngx-moment';
  
  @Component({
    selector: 'app-d-denounced-person-detail',
    templateUrl: './d-denounced-person-detail.component.html',
    styleUrls: ['./d-denounced-person-detail.component.scss']
  })
  export class DDenouncedPersonDetailComponent implements OnInit, OnChanges, OnDestroy {
  
    @ViewChild('denouncedPersonFormTag') denouncedPersonFormTag;
    @Input() isVisibleDialog: boolean;
    @Input() mode: ComponentMode = ComponentMode.CREATE;
    @Input() denouncedPerson: DenouncedPersonModel;
    @Output() cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
    isCollapse = true;
    modeEnum = ComponentMode;
    denouncedPersonForm: FormGroup = this.fb.group({
      fullName: [''],
      yearOfBirth: [null],
      dateOfBirth: [null],
      job: [''],
      workplace: [''],
      address: ['']
    });
    subscription: Subscription = new Subscription();
    isConfirmLoading = false;
    clicked = false;
  
    constructor(private fb: FormBuilder,
                private parsePipe: ParsePipe) {
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
              this.denouncedPersonForm.disable();
              this.denouncedPersonForm.patchValue({
                ...this.denouncedPerson
              });
        } else {
          this.denouncedPersonForm.enable();
        }
      }
    }
  
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
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
  
    handleCancel() {
      this.cancelEmitter.emit();
    }
  
    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
  
  }
  