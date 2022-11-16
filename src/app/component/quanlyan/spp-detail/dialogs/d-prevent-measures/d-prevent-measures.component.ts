import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {ViolantionModel} from "../../../../../model/violantion.model";
import {Subscription} from "rxjs";
import {CategoriesService} from "../../../../../service/categories.service";
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";
import {DateChangeService} from "../../../../../service/date-change.service";
import {Constant} from "../../../../../shared/constants/constant.class";

@Component({
  selector: 'app-d-prevent-measures',
  templateUrl: './d-prevent-measures.component.html',
  styleUrls: ['./d-prevent-measures.component.scss']
})
export class DPreventMeasuresComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() index: number;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  preventMeasures: any;
  subscription: Subscription = new Subscription();
  selectedPreventMeasures: any;
  isSubmited: boolean;
  titleName: string;
  loading: boolean;

  /** LIST PREVENTIVE MEASURES */
  lstPreventiveMeasuresId: string[];
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
    this.resetData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible){
      this.loading = false;
      if (this.data) {
        this.titleName = 'Cập nhật biện pháp ngăn chặn';
        this.selectedPreventMeasures = this.data;
        this.selectedPreventMeasures.index = this.index;
      } else {
        this.titleName = 'Thêm mới biện pháp ngăn chặn';
        this.resetData();
      }
      this.isSubmited = false;
    }
  }

  resetData() {
    this.selectedPreventMeasures = {};
    this.selectedPreventMeasures.id = null;
    this.selectedPreventMeasures.measuresName = null;
    this.selectedPreventMeasures.measuresDate = null;
    this.selectedPreventMeasures.reason = null;
    this.selectedPreventMeasures.accuCode = null;
  }

  handleCancel() {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  handleSubmit(data: any) {
    this.loading = true;
    this.isSubmited = true;
    let valid = true;
    if (!this.selectedPreventMeasures.measuresDate) {
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
    this.selectedPreventMeasures.measuresDate = this.datechangeSerivce.onDateValueChange(event);
  }

  validateOnlyNumbers(event: KeyboardEvent): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

}
