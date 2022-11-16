import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {DateChangeService} from 'src/app/service/date-change.service';
import { Constant } from 'src/app/shared/constants/constant.class';
import {CategoriesService} from '../../../../../service/categories.service';
import {GeneralService} from '../../../../../service/general-service';
import {NotificationService} from '../../../../../service/notification.service';

@Component({
  selector: 'app-d-temp',
  templateUrl: './d-temp.component.html',
  styleUrls: ['./d-temp.component.scss']
})
export class DTempComponent implements OnInit, OnChanges{
  // tslint:disable-next-line:variable-name
  position_type: any;
  @Input() sppCase: any;
  @Input() userfor: any;
  @Input() isVisible: boolean;
  @Input() data: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  sppId: any;

  /*DEMO*/
  inputValue?: any;
  inspectorOpions: any[];
  assignInsOptions: any[];
  assignInsValue?: any;
  arrCollapse: any[];

  /*OPTIONS*/
  lstPolices: any[];
  lstArmies: any[];

  lstCustoms: any[];
  lstRangers: any[];
  lstBorderGuard: any[];
  lstSpps: any[]; // Viện kiểm sát
  lstSpcs: any[]; // Tòa án

  lstCountry: any[];
  lstAddress: any[];
  lstNations: any[];
  lstOffices: any[];
  onInputPolice(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstPolices = [];
    } else {
      this.categoriesService.getListPolice(value).subscribe(res => {
        this.lstPolices = res;
      });
    }
  }
  onInputArmy(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstArmies = [];
    } else {
      this.categoriesService.getListArmy(value).subscribe(res => {
        this.lstArmies = res;
      });
    }
  }
  onInputCountry(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstCountry = [];
    } else {
      const payload = {counName: value};
      this.categoriesService.getListCountry(payload).subscribe(res => {
        this.lstCountry = res.datas;
      });
    }
  }
  onInputAddress(e: any): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.lstAddress = [];
    } else {
      this.categoriesService.getListLocation(value).subscribe(res => {
        this.lstAddress = res;
      });
    }
  }
  constructor(
    private categoriesService: CategoriesService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private datechangeService: DateChangeService
  ) {
    this.sppId = this.categoriesService.getSppId();
    if (!this.data) {
      // alert('vao day');
      this.data = {};
      this.data.position_type = 'KS';
      this.data.position_ksv = 'TG';
      this.arrCollapse = [true, true, true, true, true];
    }
  }

  ngOnInit(): void {
  }

  toggleCollapse(index: number) {
    this.arrCollapse[index] = !this.arrCollapse[index];
  }
  getListCategories(){
    this.categoriesService.getListNation({size: 100}).subscribe(res => {
      this.lstNations = res.datas;
    });
    this.categoriesService.getListOffice({size: 100}).subscribe(res => {
      this.lstOffices = res.datas;
    });
  }
  ngOnChanges(): void {
    alert(this.isVisible);
    if (this.data) {
      this.inspectorOpions = [];
      this.assignInsOptions = [];

      let payloadCountry = {};
      if (this.data && this.data.counid) {
        payloadCountry = {counId: this.data.counid};
      } else {
        payloadCountry = {counId: 'VN'};
      }
      if (this.data) {
        this.categoriesService.getListCountry(payloadCountry).subscribe(res => {
          this.lstCountry = res.datas;
          this.data.country = res.datas[0];
        });
      }
      if (this.data && this.data.address) {
        this.categoriesService.getListLocation(this.data.address).subscribe(res => {
          this.lstAddress = res;
          this.data.address = res[0];
        });
      }
      if (this.data && this.data.begin_officeid) {
        switch (this.data.begin_office) {
          case '02':
            this.categoriesService.getListPolice(this.data.begin_officeid).subscribe(res => {
              this.lstPolices = res;
              this.data.police = res[0];
            });
            break;
          case '04':
            this.categoriesService.getListArmy(this.data.begin_officeid).subscribe(res => {
              this.lstArmies = res;
              this.data.army = res[0];
            });
            break;
        }
      }
      this.getListCategories();
    }
  }
  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
  handleOk(): void {
    this.data.phapnhan = 'P';
    this.isVisible = false;
    this.closeModal.emit(false);
    this.data.userfor = this.userfor;
    this.submitForm.emit(this.data);
  }

  onValueBeginIndate(event: any){
    this.data.begin_indate= this.datechangeService.onDateValueChange(event);
  }

	validateOnlyNumbers(event: KeyboardEvent): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}
