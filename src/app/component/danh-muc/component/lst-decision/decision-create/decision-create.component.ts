import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralService } from '../../../../../service/general-service';
import { NotificationService } from '../../../../../service/notification.service';
import { Constant } from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-decision-create',
  templateUrl: './decision-create.component.html',
  styleUrls: ['./decision-create.component.scss']
})
export class DecisionCreateComponent implements OnInit {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Input() lstDecitype: [];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() reloadModal: EventEmitter<boolean> = new EventEmitter();

  isSubmited: boolean;

  updateapplyfor: boolean;

  titleName = 'Thêm mới';

  isForArr = [false,false,false,false,false,false,false];

  constructor(
    private generalService: GeneralService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.doReset();
  }

  ngOnChanges() {
    if(this.isVisible) {
      this.isSubmited = false;
      if (this.data.isEdit) {
        this.titleName = 'Cập nhật';
        this.updateapplyfor = true;
        this.handleArrUserFor(this.data?.userfor)
      } else {
        this.updateapplyfor = false;
        this.doResetArr()
        this.titleName = 'Thêm mới';
      }
    }
  }

  handleArrUserFor(user: string) {
    const arrU = user.split(",");
    for(let i = 0; i < arrU.length; i++) {
      if (arrU[i] === "G1") this.isForArr[0] = true;
      if (arrU[i] === "G2") this.isForArr[1] = true;
      if (arrU[i] === "G3") this.isForArr[2] = true;
      if (arrU[i] === "G4") this.isForArr[3] = true;
      if (arrU[i] === "G5") this.isForArr[4] = true;
      if (arrU[i] === "G6") this.isForArr[5] = true;
      if (arrU[i] === "Tbtg") this.isForArr[6] = true;
    }
  }

  handleArruserfortempl(isForArr): string {
    let userforTempl = "";
    if (isForArr[0] === true) userforTempl += "G1,";
    if (isForArr[1] === true) userforTempl += "G2,";
    if (isForArr[2] === true) userforTempl += "G3,";
    if (isForArr[3] === true) userforTempl += "G4,";
    if (isForArr[4] === true) userforTempl += "G5,";
    if (isForArr[5] === true) userforTempl += "G6,";
    if (isForArr[6] === true) userforTempl += "Tbtg,";
    return userforTempl;
  }

  handleOk(){
    let valid = true;
    this.isSubmited = true;
    if (!this.data.deciname) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Tên quyết định')
      valid = false;
    }
    if (this.data.limittime) {
      if (!this.data.settime) {
        this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Thời hạn')
        valid = false;
      }
    }
    const userfortempl = this.handleArruserfortempl(this.isForArr);
    if (!userfortempl) {
      this.notificationService.showNotification(Constant.ERROR, 'Bạn phải nhập giá trị cho trường Giai đoạn áp dụng')
      return;
    }
    if (valid) this.doSave(this.data, userfortempl);  
  }

  doSave(data,userfortempl) {
    let msg, action;
    if (this.data.isEdit) {
      msg = 'Cập nhật';
      action = 'U';
    } else {
      msg = 'Thêm mới';
      action = 'I';
    }
    const payload = {
      ...data,
      action: action,
      userfortempl: userfortempl.substring(0, userfortempl.length - 1)
    }
    this.generalService.saveLstDecision(payload).subscribe(res => {
      if (res) {
        this.handleErr(res);
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, `${msg} thành công`);
        this.handleReload();
      }
    }, error => {
      this.handleErr(error.error.text)
    });
  }

  handleErr(err: string){
    if (err === "error") {
      this.notificationService.showNotification(Constant.ERROR, "Quyết định này đã tồn tại, hãy thêm mới quyết định khác");
      return;
    }

    const msgErr = this.generalService.jsonErrorDM[err];
    this.notificationService.showNotification(Constant.ERROR, msgErr ? msgErr : err);
  }

  doReset() {
    this.data = {
      type_ins: "CHA",
      deciid: '',
      deciname: '',
      limittime: false,
      settime: '',
      setunit: 'D',
      applyfor: 'A',
      applyfinish: 'Y',
      status: 'Y',
      decitypeid: 'KXD',
      isEdit : false
    }
    this.doResetArr();
  }

  doResetArr() {
    this.isForArr = [false,false,false,false,false,false];
  }

  updApplyfor(){
    if (this.data.type_ins === "CHA")
      this.updateapplyfor = false;
    else
      this.updateapplyfor = true;

    if (+this.data.decitemp >= 50)
      this.data.applyfor = "A"
    else
      this.data.applyfor = "C";
  }

  handleReload(){this.reloadModal.emit(false), this.isVisible = false}

  handleCancel() {this.closeModal.emit(false), this.isVisible = false}
}
