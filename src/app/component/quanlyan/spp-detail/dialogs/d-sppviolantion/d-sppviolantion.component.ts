import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {ViolantionModel} from '../../../../../model/violantion.model';
import {Constant} from '../../../../../shared/constants/constant.class';
import {Subscription} from 'rxjs';
import {DateChangeService} from '../../../../../service/date-change.service';

@Component({
  selector: 'app-d-sppviolantion',
  templateUrl: './d-sppviolantion.component.html',
  styleUrls: ['./d-sppviolantion.component.scss']
})
export class DSppviolantionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isVisible: boolean;
  @Input() violantion: ViolantionModel;
  @Input() index: number;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  subscription: Subscription = new Subscription();
  selectedVio: ViolantionModel;
  isSubmited: boolean;
  titleName: string;
  loading: boolean;
  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private datechangeSerivce: DateChangeService
  ) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.isSubmited = false;
    this.selectedVio = {
      typeOfViolations: 1,
      typeName: '',
      dateOfViolation: '',
      timeOfViolation: 1,
      contentViolations: '',
      processing: '',
      violcode: ''
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible){
      this.loading = false;
    }
    if (this.violantion != null) {
      this.titleName = 'Cập nhật hành vi vi phạm';
      this.selectedVio.id = this.violantion.id;
      this.selectedVio.typeOfViolations = this.violantion.typeOfViolations;
      this.selectedVio.typeName = this.violantion.typeName;
      this.selectedVio.dateOfViolation = this.violantion.dateOfViolation;
      this.selectedVio.timeOfViolation = this.violantion.timeOfViolation;
      this.selectedVio.contentViolations = this.violantion.contentViolations;
      this.selectedVio.processing = this.violantion.processing;
      this.selectedVio.caseCode = this.violantion.caseCode;
      this.selectedVio.accuCode = this.violantion.accuCode;
      this.selectedVio.index = this.index;
    } else {
      this.titleName = 'Thêm mới hành vi vi phạm';
      this.selectedVio = {
        typeOfViolations: 1,
        typeName: '',
        dateOfViolation: '',
        timeOfViolation: 1,
        contentViolations: '',
        processing: '',
        violcode: ''
      };
    }
    this.isSubmited = false;
  }

  handleCancelViolation() {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleSubmitViolation(data: ViolantionModel) {
    this.loading = true;
    this.isSubmited = true;
    let valid = true;
    if (!this.selectedVio.dateOfViolation) {
      this.notificationService.showNotification(Constant.ERROR, 'Yêu cầu bắt buộc nhập');
      valid = false;
    }
    if (valid) {
      this.isVisible = false;
      this.closeModal.emit(false);
      this.submitForm.emit(data);
    }else{
      this.loading = false;
    }
  }

  onValueDateOfViolation(event: any){
    this.selectedVio.dateOfViolation = this.datechangeSerivce.onDateValueChange(event);
  }

	validateOnlyNumbers(event: KeyboardEvent): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

}
