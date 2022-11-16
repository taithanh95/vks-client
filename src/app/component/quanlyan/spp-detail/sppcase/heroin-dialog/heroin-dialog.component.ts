import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-heroin-dialog',
  templateUrl: './heroin-dialog.component.html',
  styleUrls: ['./heroin-dialog.component.scss']
})
export class HeroinDialogComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean;
  @Input() law: any;
  @Input() casecode: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  isCollapse: boolean;
  isCollapseHeroin: boolean;
  datas: any[];
  loading: boolean;
  lstHeroins: any[];
  lstHeroinUnit: any[];
  item: any;
  selectedItem: any;
  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.item = {UNIT: 'G'};
    this.isCollapse = true;
    this.isCollapseHeroin = true;
    this.generalService.readErrorFile();
    this.lstHeroins = [
      {HEROINNAME: '(+) - Lysergide (LSD)', HEROINID: '027'},
      {HEROINNAME: '4 - Methylaminorex', HEROINID: '031'}
    ];
    this.lstHeroinUnit = [
      {name: 'g', value: 'G'},
      {name: 'lít', value: 'L'},
      {name: 'millilit', value: 'ML'},
      {name: 'kg', value: 'KG'},
      {name: 'ống', value: 'O'},
      {name: 'viên', value: 'V'},
      {name: 'đơn vị khác', value: 'K'},
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible) {
      this.getListHeroin();
      this.getListStatics();
    }
  }
  getListHeroin(){
    this.loading = true;
    const search  = { lawcode: this.law.LAWCODE, casecode: this.casecode };
    this.generalService.searchHeroin(search).subscribe(res => {
      if (res) {
        this.loading = false;
        this.datas = res;
      }
      // alert(res.length);
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }
  getListStatics(){
    this.generalService.getAllHeroin(null).subscribe(res => {
      if (res) {
        this.lstHeroins = res;
      }
      // alert(res.length);
    }, error => {
      alert('Lỗi dữ liệu');
    });
  }
  handleCancel() {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
  toggleCollapseHeroin() {
    this.isCollapseHeroin = !this.isCollapseHeroin;
  }
  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  handleOk() {
    this.item.LAWCODE = this.law.LAWCODE;
    this.item.CASECODE = this.casecode;
    let payload = {
      LAWCODE: this.law.LAWCODE,
      CASECODE: this.casecode,
      heroin: this.item
    }
    if (this.selectedItem && this.item.HEROINID === this.selectedItem.HEROINID) // update
    {
      this.generalService.updateCaseHeroin(payload).subscribe(res => {
        if (!res) {
          this.getListHeroin();
          this.resetValue();
          this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật chỉ tiêu thành công');
        }
        else {
          const lstErrors = res.split('|');
          lstErrors.forEach(en => {
            if (en) {
              const errorText = this.generalService.jsonError[en];
              this.notificationService.showNotification(Constant.ERROR, errorText);
            }
          });
        }
        // alert(res.length);
      }, error => {
        alert('Lỗi dữ liệu: ' + error);
      });
    }
    else{
      this.generalService.insertCaseHeroin(payload).subscribe(res => {
        if (!res) {
          this.getListHeroin();
          this.notificationService.showNotification(Constant.SUCCESS, 'Thêm mới chỉ tiêu thành công');
          this.resetValue();
        }
        else {
          const lstErrors = res.split('|');
          lstErrors.forEach(en => {
            if (en) {
              const errorText = this.generalService.jsonError[en];
              this.notificationService.showNotification(Constant.ERROR, errorText);
            }
          });
        }
        // alert(res.length);
      }, error => {
        alert('Lỗi dữ liệu: ' + error);
      });
    }

  }
  resetValue(){
    this.item = {UNIT: 'G'};
  }
  onRowSelect(item): void{
    this.item = item;
    this.selectedItem = item;
  }
  toUnitName(unitVal){
    const unit = this.lstHeroinUnit.find(en => en.value === unitVal);
    return unit ? unit.name : '';
  }

  confirm() {
      alert('do delete');
  }
  cancel() {
  }
}

