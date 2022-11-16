import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-lawgroupchap-create',
  templateUrl: './lawgroupchap-create.component.html',
  styleUrls: ['./lawgroupchap-create.component.scss']
})
export class LawgroupchapCreateComponent implements OnInit {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() reloadModal: EventEmitter<boolean> = new EventEmitter();

  datas: any[];
  loading = false;

  isSubmited: boolean;

  titleName = 'Thêm mới';

  /* selection */
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<any>();
  defaultCheckedId = new Set<any>();

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.doReset();
  }

  ngOnChanges() {
    if(this.isVisible) {
      this.isSubmited = false;
      if (this.data.isEdit) {
        this.titleName = 'Cập nhật';
        this.getLstDatas(this.data?.id)
      } else {
        this.titleName = 'Thêm mới';
        this.getLstDatas(null)
      }
    }
  }

  getLstDatas(id) {
    this.loading = true;
    this.generalService.searchLstLawGroupChapById(id).subscribe(res => {
      if (res) this.datas = res;
      this.handleCheck();
      this.loading = false;
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, error);
    });
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  onRowSelect(item): void {
    this.onItemChecked(item.groupid, !this.setOfCheckedId.has(item.groupid))
  }

  handleOk(){
    let valid = true;
    this.isSubmited = true;
    if (!this.data.fullname) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên nhóm tội')
      valid = false;
    }

    if (!this.datas.some(item => this.setOfCheckedId.has(item.groupid))) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập ít nhất một chương luật')
      valid = false;
    }
  
    if (valid) this.doSave();  
  }

  doSave() {
    let msg, action;
    if (this.data.isEdit) {
      msg = 'Cập nhật';
      action = 'U';
    } else {
      msg = 'Thêm mới';
      action = 'I';
    }
    const payload = {
      ...this.data,
      lstGroupid: Array.from(this.setOfCheckedId.values()),
      action: action
    }
    this.generalService.saveLstLawGroupChap(payload).subscribe(res => {
      if (!res || res.length === 2) {
        this.notificationService.showNotification(Constant.SUCCESS, `${msg} thành công`);
        this.handleReload();
      } else {
        this.handleErr(res);
      }
    }, error => {
      this.handleErr(error.error.text)
    });
  }

  handleErr(err: string){
    const msgErr = this.generalService.jsonErrorDM[err];
    this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
  }

  doReset() {
    this.data = {
      id: '',
      fullname: '',
      isEdit : false
    }
  }

  handleReload(){this.reloadModal.emit(false), this.isVisible = false}

  handleCancel() {this.closeModal.emit(false), this.isVisible = false}

  handleCheck() {
    this.setOfCheckedId = new Set<any>();
    this.defaultCheckedId = new Set<any>();
    this.datas.forEach(item => this.updateAvaiable(item,this.data.id));
    this.datas.forEach(item => this.defaultSelected(item,this.data.id));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: any, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  updateAvaiable(item: any, id){
    if (item.id === id){
      this.setOfCheckedId.add(item.groupid);
    }
  }

  defaultSelected(item: any,id){
    if (item.id === id){
      this.defaultCheckedId.add(item.groupid);
    }
  }

  onItemChecked(id: any, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.datas.forEach(item => this.updateCheckedSet(item.groupid, value));
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    this.checked = this.datas.every(item => this.setOfCheckedId.has(item.groupid));
    this.indeterminate = this.datas.some(item => this.setOfCheckedId.has(item.groupid)) && !this.checked;
  }

  convert(f): any {
    return f === '01' ? 'BLTTHS  2004' : (f === '02' ? 'BLHS 1999' : ((f === '03' ? 'BLDS 1995' :
      (f === '04' ? 'BLHC' : (f === '05' ? 'BLHS 1985' : (f === '06' ? 'BLHS 2015' : 'BLHS 2015'))))));
  }
}
