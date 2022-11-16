import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CategoriesService } from 'src/app/service/categories.service';
import { GeneralService } from 'src/app/service/general-service';
import { NotificationService } from 'src/app/service/notification.service';
import { Constant } from 'src/app/shared/constants/constant.class';
import { WebUtilities } from 'src/app/shared/utils/qla-utils.class';

@Component({
  selector: 'app-d-cent-conclu',
  templateUrl: './d-cent-conclu.component.html',
  styleUrls: ['./d-cent-conclu.component.scss']
})
export class DCentConcluComponent implements OnInit, OnChanges{

  @Input() isVisible: boolean;
  @Input() isVisibleDisable: boolean;
  @Input() userfor: string;
  @Input() accuCode: string;
  @Input() lstAccu: any;
  @Input() centence: any;
  @Input() register: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  lstConclu: any[] // Kết Luận / Quan điểm
  data:any;
  legalper: string;
  isBtnDelete:boolean;

  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
  ) { }

  ngOnChanges(): void {
    if(this.isVisible) {
      this.getCentAccu();
      this.lstAccu.find(acc => {
        if (acc.ACCUCODE === this.accuCode) this.legalper === acc.LEGALPER;
      });
    }
  }

  ngOnInit(): void {
    this.resetData();
    this.getLstConclu(this.userfor);
  }

  async resetData() {
    this.data = {};
    this.data.concid = null;
    this.data.concidspp = null;
    this.isBtnDelete = true;
  }

  async getCentAccu() {
    this.generalService.getCentAccuDetail({centcode: this.centence.centcode, accucode: this.accuCode}).subscribe(res => {
      if (res?.CENTCODE) {
        this.isBtnDelete = false;
        this.data = WebUtilities.toLowercaseFields(res);
      } else {
        this.resetData();
      }
    },err=> console.log(err));
  }

  async handleDeleteCentAccu() {
    this.generalService.deleteCentAccu({centcode: this.centence.centcode, accucode: this.accuCode, regicode: this.register?.regicode}).subscribe(res => {
      this.resetData();
      this.notificationService.showNotification(Constant.ERROR,'Xóa thành công');
    },err=> console.log(err));
  }

  async handleSaveCentAccu() {
    const payload = {
      ...this.data,
      centcode: this.centence.centcode,
      accucode: this.accuCode,
      regicode: this.register?.regicode
    }
    this.generalService.saveCentAccu(payload).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS,'Thêm mới thành công')
      this.getCentAccu();
    },err=> console.log(err));
  }

  async getLstConclu(userfor) {
    this.categoriesService.getListConclution(userfor).subscribe(res => {
      this.lstConclu = res;
    })
  }

  handleCancel=()=> this.closeModal.emit(false);

}
