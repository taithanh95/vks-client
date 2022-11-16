import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Constant} from "../../../../../shared/constants/constant.class";
import {CategoriesService} from "../../../../../service/categories.service";
import {GeneralService} from "../../../../../service/general-service";
import {NotificationService} from "../../../../../service/notification.service";

@Component({
  selector: 'app-d-cent-statis-case',
  templateUrl: './d-cent-statis-case.component.html',
  styleUrls: ['./d-cent-statis-case.component.scss']
})
export class DCentStatisCaseComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean;
  @Input() sppCase: any;
  @Input() register: any;
  @Input() centence: any;
  @Input() userfor: any;
  @Input() accuCode: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  selectedLaw: any;
  isCollapse: any;
  lstData: any[] = [];
  loading: boolean;

  /* CASE STATISTICS*/
  isVisibleCaseStatisDetail: boolean;

  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.getListLawByCase();
    }
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  handleCancel(): void {
    this.closeModal.emit(false);
  }

  getListLawByCase(): void {
    const filter = {
      casecode: this.sppCase.CASECODE,
      userfor: 'G1'
    };
    this.generalService.searchLawByCase(filter).subscribe(res => {
      this.lstData = res;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error.error.text);
    });
  }

  lawType(value) {
    return value === 'L4' ? 'Đặt biệt nghiêm trọng' : value === 'L3' ?
      'Rất nghiêm trọng' : value === 'L2' ? 'Nghiêm trọng' : 'Ít nghiêm trọng';
  }


  showCaseStatisDetail(data: any) {
    this.selectedLaw = data;
    this.isVisibleCaseStatisDetail = true;
  }

  closePopupCaseStatisDetail(){
    this.isVisibleCaseStatisDetail = false;
  }
}
