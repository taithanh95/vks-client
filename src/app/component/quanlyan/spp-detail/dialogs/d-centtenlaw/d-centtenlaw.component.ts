import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {debounceTime} from 'rxjs/internal/operators/debounceTime';
import {CategoriesService} from '../../../../../service/categories.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-d-centtenlaw',
  templateUrl: './d-centtenlaw.component.html',
  styleUrls: ['./d-centtenlaw.component.scss']
})
export class DCenttenlawComponent implements OnInit, OnChanges {

  @Input() isVisible: boolean;
  @Input() isVisibleDisable: boolean;
  @Input() centence: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  // GRID VEIW
  lstCentenLaw: any;
  isSelected: boolean;

  // LIST COMBOBOX VEIW
  lstCode: any;
  atxResultLaws: any;

  // ITEM
  codeid: string;
  lawObj: any;

  // ISVISBLE
  isVisibleCentenlaw:boolean;

  // FIELDSET
  isCollapse = true;
  
  //REPORT PDF
  isVisibleModal: boolean

  constructor(
    private generalService: GeneralService,
    private categoriesService: CategoriesService,
    private notificationService: NotificationService
  ) { }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.handleSearchLaw();
    }
  }

  ngOnInit(): void {
    this.getLstCode();
  }

  toggleCollapse=()=> this.isCollapse = !this.isCollapse;

  async handleSearchLaw(){
    this.isSelected = false;
    this.generalService.getCentenLaw(this.centence?.centcode).pipe(debounceTime(500)).subscribe(res => {
      this.lstCentenLaw = res;
    }, err => this.notificationService.showNotification(Constant.ERROR,err.error.text));
  }

  handleOk(){
    if (!this.lawObj) {
      this.notificationService.showNotification(Constant.ERROR,'Bạn phải nhập giá trị cho trường tội danh')
      return;
    }
    this.submitForm();
  }

  async submitForm() {
    const payload = {
      centcode: this.centence.centcode,
      lawcode: this.lawObj.lawcode,
      action: 'I'
    }
    this.generalService.saveCentenLaw(payload).pipe(debounceTime(500)).subscribe(res => {
      if (res) {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + res);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới thành công');
      }
      this.handleSearchLaw();
    }, err => this.notificationService.showNotification(Constant.ERROR,err.error.text));
  }

  openPopupCenlawcode=()=>this.isVisibleCentenlaw = true;

  closePopupCenlawcode($event) {
    this.isVisibleCentenlaw = false;
    this.handleSearchLaw();
  }

  async confirmDeleteCenLaw() {
    const selected = this.lstCentenLaw.find(e => e.selected === true);
    if (selected) {
      const payload = {
        centcode: this.centence.centcode,
        lawcode: selected.LAWCODE,
        action: 'D'
      }
      this.generalService.saveCentenLaw(payload).pipe(debounceTime(500)).subscribe(res => {
        if (res) {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + res);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
        }
        this.handleSearchLaw();
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text);
      });
    }
  }

  onRowSelect(selectedItem): void {
    for (const item of this.lstCentenLaw) {
      item.selected = false;
    }
    selectedItem.selected = true;
    this.isSelected = true;
  }

  async getLstCode() {
    this.categoriesService.getListCode(' ').subscribe(res => {
      this.lstCode = res;
      this.codeid = this.lstCode[0].CODEID;
    });
  }

  onInputAtxLawWithCode(e: any): void {
    let value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.atxResultLaws = [];
    } else {
      if (value === ' ') {
        value = '0';
      }
      this.categoriesService.getListLawAutoComplete(value, this.codeid).subscribe(res => {
        this.atxResultLaws = res;
      });
    }
  }

  toLawOption(l) {
    return `${l.lawid === null ? '' : 'Điều ' + l.lawid}${l.item === null || l.item === 0 ? '' : (' - Khoản ' + l.item)}${l.point === null ? '' : (' - Điểm ' + l.point)}${l.lawid === null ? '' : ' - ' + l.lawname}`;
  }

  handleCancel=()=>this.closeModal.emit(false);

  handleOpenPDFModal=()=>this.isVisibleModal = true;
  handleCancelModal=()=>this.isVisibleModal = false;
}
