import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../../../../service/categories.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {WebUtilities} from '../../../../../shared/utils/qla-utils.class';

@Component({
  selector: 'app-d-centapped',
  templateUrl: './d-centapped.component.html',
  styleUrls: ['./d-centapped.component.scss']
})
export class DCentappedComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isVisible: boolean;
  @Input() register: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  // LIST DATAS
  lstCentences: any;
  lstAccu: any;
  lstDecitions: any;

  // FIELDSET
  arrCollapse = [true, true];

  // DATAS
  centapped: any;
  decidata: any;
  centence: any;
  accuCode: string;
  userforOld: string;
  registerOld: any;

  // ISVISABLE
  isVisibleCent: boolean;
  isVisibleDeci: boolean;
  openTable = [true,false]
  isVisibleCenLaw: boolean;
  isVisibleDisableCenLaw: boolean;

  // INFO LOGIN
  sppid: string;

  constructor(
    private generalService: GeneralService,
    private categoriesService: CategoriesService,
    private notificationService: NotificationService
  ) { 
    this.sppid = WebUtilities.getLoggedSppId();
  }
  ngOnDestroy(): void {
    this.handleReset();
  }

  ngOnChanges(): void {
    if(this.isVisible) {
      this.handleReset();
      this.resetOpenTable(0,'C');
    }
  }

  ngOnInit(): void {
    //nothing
  }

  
  handleReset() {
    this.lstCentences = [];
    this.lstAccu = [];
    this.lstDecitions = [];
    this.centapped = {};
    this.decidata = {};
    this.centence = {};
  }

  resetOpenTable(index,type) {
    this.isVisibleCent = false;
    this.isVisibleDeci = false;
    this.openTable = [false,false];
    this.openTable[index] = true;
    this.getLstCentences(type);
  }

  async getLstCentences(type:string) {
    this.generalService.searchCentApped({regicode: this.register?.regicode, type: type}).subscribe(res =>{
      if(type === 'C')this.lstCentences = res;
      else this.lstDecitions = res;
    }, err => console.log(err));
  }

  handleCancel = () => this.closeModal.emit(true);

  toggleCollapse=(index:number)=> this.arrCollapse[index] = !this.arrCollapse[index];

  toUseforName=(useFor:string)=> useFor === 'G3' ? 'Sơ thẩm' : useFor === 'G4' ? 'Phúc thẩm' : 'GĐT/TT';

  async openDetails(centapped) {
    this.centapped = WebUtilities.toLowercaseFields(centapped);
    await this.getCentDetail(this.centapped?.centcode);
  }

  async openDeciDetail(decidata) {
    this.centapped = WebUtilities.toLowercaseFields(decidata);
    await this.getDeciDetail(this.centapped?.decicode);
  }

  async getCentDetail(centcode:string) {
    this.generalService.getCentDetail({centcode: centcode, sppid: this.sppid}).subscribe(res=>{
      this.isVisibleCent = true;
      this.centence = res ? WebUtilities.toLowercaseFields(res) : {};
      this.centence.movement = this.centence.movement === 'Y' ? 'Phiên tòa xét xử lưu động' : 'Phiên tòa không xét xử lưu động';
      this.getConclution(this.centence?.concid);
      this.getListAccuByCent(this.centence?.centcode)
    }, err => console.log(err));
  }

  async getDeciDetail(decicode:string) {
    this.generalService.getDeciDetail(decicode).subscribe(res=>{
      this.isVisibleDeci = true;
      this.decidata = res ? WebUtilities.toLowercaseFields(res) : {};
    }, error => this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text));
  }

  async getConclution(concid) {
    this.categoriesService.getConclution(concid).subscribe(res => {
      this.centence.concname = res ? res?.concname : '';
    })
  }

  async getListAccuByCent(centcode) {
    this.generalService.getListAccuByCentCode(centcode).subscribe(res => {
      this.lstAccu = res ? res : [];
    }, error => this.notificationService.showNotification(Constant.ERROR, 'Lỗi: ' + error.error.text));
  }

  openPopup(accucode){
    this.accuCode = accucode;
    this.userforOld = this.centence?.userfor;
    this.registerOld = {regicode: this.centence?.regicode};
    this.isVisibleCenLaw = true;
    this.isVisibleDisableCenLaw = true;
  }

  closePopupCenlaw(){
    this.isVisibleCenLaw = false;
    this.isVisibleDisableCenLaw = false;
  }

  toSpcDiffName(userfor) {
    return userfor === 'G3' ? 'Số bị cáo Tòa xử theo khoản khác với khoản mà Viện kiểm sát đã truy tố' : 
           userfor === 'G4' ? 'Số bị cáo Tòa xử khác với mức đề nghị của Viện kiểm sát' : 
          'Số bị cáo tòa xử khác với mức đề nghị của Viện kiểm sát';
  }

  toSppNextName(userfor) {
    return userfor === 'G3' ? 'Số bị cáo Tòa xử khác với mức đề nghị của Viện kiểm sát' : 
           userfor === 'G4' ? 'Số bị cáo có báo cáo đề nghị GĐT, TT' : 
          'Số bị cáo có báo cáo đề nghị GĐT, TT tiếp';
  }

  toSppBackName(userfor) {
    return userfor === 'G3' ? 'Số bị cáo Viện kiểm sát kháng nghị' : 
           'Số bị cáo Viện kiểm sát rút kháng nghị';
  }
  
  toLabelName(userfor?,checka?) {
    if (!userfor && !checka) {
      return this.centapped.userfor === 'G3' ? 'kháng nghị' : 'đề nghị';
    }
    if (!checka && userfor) {
      return userfor === 'G3' ? 'Kháng nghị số' : 'Đề nghị số';
    }
    if (checka === "0")
      return userfor === 'G3' ? 'Kháng nghị' : 'Đề nghị';
    else
      return 'Kháng cáo';
  }
}
