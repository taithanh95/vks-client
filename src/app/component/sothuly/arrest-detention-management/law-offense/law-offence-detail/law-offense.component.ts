import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ComponentMode, Constant} from '../../../../../shared/constants/constant.class';
import {LawOffenseModel} from '../../../../../model/law-offense.model';
import {CategoriesService} from '../../../../../service/categories.service';
import {ConstantService} from '../../../../../service/constant.service';
import {NotificationService} from '../../../../../service/notification.service';
import {LoaderService} from '../../../../../service/loader.service';
import {DateService} from '../../../../../common/util/date.service';
import * as moment from 'moment';

@Component({
  selector: 'app-law-offense',
  templateUrl: './law-offense.component.html',
  styleUrls: ['./law-offense.component.scss']
})
export class LawOffenseComponent implements OnChanges, OnInit {

  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() isVisibleDialog: boolean;
  @Input() lawOffenseModel: LawOffenseModel;
  @Input() lawOffenceListIndex: number;
  @Output() closeModal: EventEmitter<string> = new EventEmitter();
  @Output() saveEmitter: EventEmitter<LawOffenseModel> = new EventEmitter<LawOffenseModel>();
  isCollapse = true;
  modeEnum = ComponentMode;
  selectedCodeId = '06';
  groupLaws: any[] = [];
  lstLaws = [];
  userInfo: any;
  lawOffenseOutput: LawOffenseModel;
  filterItem = {
    pageSize: 10,
    pageNumber: 1,
    rowIndex: 0,
    sortField: 'codeId',
    sortOrder: '',
    createUser: '',
    dataRequest: {
      codeName: ''
    }
  };

  lawOffenseModalForm: FormGroup = this.fb.group({
    lawId: [null],
    lawName: [null],
    enactmentId: [null],
    enactmentName: [null, Validators.required],
    lawOffenseModalTemp: [null],
    point: [null],
    item: [null]
  });
  isConfirmLoading = false;

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private constantService: ConstantService,
    private notification: NotificationService,
    private loaderService: LoaderService,
    private dateService: DateService,
  ) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisibleDialog && this.isVisibleDialog) {
      switch (this.mode) {
        case ComponentMode.VIEW:
        case ComponentMode.VIEW_FROM_PARENT: {
          this.lawOffenseModalForm.disable();
          this.getGroupLaw('');
          this.lstLaws = [{
            lawId: this.lawOffenseModel.enactmentId,
            lawName: this.lawOffenseModel.enactmentName,
            item: this.lawOffenseModel.item,
            point: this.lawOffenseModel.point
          }]
          this.lawOffenseModalForm.patchValue({
            ...this.lawOffenseModel
          });
          const law = this.groupLaws.find(e => e.codeName === this.lawOffenseModalForm.get('lawName').value);
          if (law) {
            this.getControl('lawId').setValue(law.codeId);
            this.onSelectedGroupId();
          }
          this.getLaws('', this.selectedCodeId);
          break;
        }
        case ComponentMode.CREATE: {
          this.lawOffenseModalForm.enable();
          this.lawOffenseModalForm.reset();
          this.getGroupLaw('');
          this.lawOffenseModalForm.patchValue({
            lawName: 'BLHS 2015'
          });
          const law = this.groupLaws.find(e => e.codeName === 'BLHS 2015');
          if (law) {
            this.getControl('lawId').setValue(law.codeId);
            this.onSelectedGroupId();
          }
          this.getLaws('', this.selectedCodeId);
          break;
        }
        case ComponentMode.UPDATE: {
          this.lawOffenseModalForm.enable();
          this.getGroupLaw('');
          this.lawOffenseModalForm.patchValue({
            ...this.lawOffenseModel
          });
          const law = this.groupLaws.find(e => e.codeName === this.lawOffenseModalForm.get('lawName').value);
          if (law) {
            this.getControl('lawId').setValue(law.codeId);
            this.onSelectedGroupId();
          }
          this.getLaws('', this.selectedCodeId);
          break;
        }
        default: {
          this.lawOffenseModalForm.enable();
          this.getGroupLaw('BLHS 2015');
          this.lawOffenseModalForm.patchValue({
            lawName: 'BLHS 2015'
          });
          break;
        }
      }
    }
  }

  getControl(controlName) {
    return this.lawOffenseModalForm.controls[controlName];
  }

  getGroupLaw(groupName: string) {
    this.filterItem.dataRequest.codeName = groupName;
    this.constantService.postRequest(
      this.constantService.MANAGE_URL + 'code/getList/',
      {
        status: 'Y'
      }
    ).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          if (resJson.responseData) {
            this.groupLaws = resJson.responseData;
          } else {
            this.groupLaws = [];
          }
        } else {
          this.notification.showNotification(Constant.ERROR, resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      }).catch(err => {
      this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
    });
  }

  getLaws(name?: string, code?: string) {
    this.loaderService.show();
    const search = {
      LawName: name,
      sortField: 'lawId',
      sortOrder: 'ESC',
      codeId: code,
      size: 20
    };
    this.categoriesService.getListLaw(search).subscribe(res => {
      this.lstLaws = res?.datas || [];
      this.loaderService.hide();
    });
    // this.constantService.postRequest(this.constantService.MANAGE_URL + 'law/getPage/',
    //   {
    //     pageNumber: 0,
    //     pageSize: 20,
    //     dataRequest: {
    //       codeId: code,
    //       lawName: name.toLowerCase()
    //     }
    //   }).toPromise()
    //   .then(res => res.json())
    //   .then(resJson => {
    //     if (resJson.responseCode === '0000') {
    //       if (resJson.responseData) {
    //         this.lstLaws = resJson.responseData.data;
    //       } else {
    //         this.lstLaws = [];
    //       }
    //     }
    //     this.loaderService.hide();
    //   }).catch(err => {
    //   this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
    // });
  }

  onSearchGroupLaw(e) {
    this.getGroupLaw(e);
    this.getControl('lawName').valueChanges.subscribe(
      value => {
        const law = this.groupLaws.find(element => element.codeName === value);
        if (law) {
          this.getControl('lawId').setValue(law.codeId);
          this.onSelectedGroupId();
          this.onSearchLaw('');
        }
      }
    );
  }

  onSearchLaw(e) {
    if (this.groupLaws.length === 0) {
      return;
    }
    this.getLaws(e, this.selectedCodeId);
    this.getControl('enactmentName').valueChanges.subscribe(
      value => {
        const law = this.lstLaws.find(element => element.lawName === value);
        if (law) {
          this.getControl('enactmentId').setValue(law.lawId);
          this.getControl('point').setValue(law.point);
          this.getControl('item').setValue(law.item);
        }
      });
  }

  onSelectedGroupId(): void {
    const codeId = this.lawOffenseModalForm.get('lawId').value;
    if (this.selectedCodeId !== codeId) {
      this.selectedCodeId = codeId;
      this.lawOffenseModalForm.get('enactmentName').setValue(null);
      this.getControl('enactmentId').setValue(null);
      this.getControl('point').setValue(null);
      this.getControl('item').setValue(null);
    }
  }

  validateForm() {
    if (this.lawOffenseModalForm.invalid) {
      Object.keys(this.lawOffenseModalForm.controls).forEach(key => {
        this.lawOffenseModalForm.get(key).markAsDirty();
        this.lawOffenseModalForm.get(key).updateValueAndValidity();
      });
    }
    if (this.lawOffenseModalForm.get('enactmentName').value) {
      const val = this.lawOffenseModalForm.get('enactmentName').value;
      let lawCheckList: any[] = [];
      this.loaderService.show();
      this.constantService.postRequest(this.constantService.MANAGE_URL + 'law/getList/', {
        lawName: val,
        codeId: this.selectedCodeId
      }).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            lawCheckList = resJson.responseData;
            if (!lawCheckList.find(e => e.lawName === val)) {
              this.lawOffenseModalForm.get('enactmentName').setErrors({notInList: true});
            }
          } else {
            this.lawOffenseModalForm.get('enactmentName').setErrors({notInList: true});
          }
          this.loaderService.hide();
        }).catch(err => {
        this.notification.showNotification(Constant.ERROR, 'Hệ thống không có phản hồi.' + err);
      });
    } else {
      this.lawOffenseModalForm.get('enactmentName').setErrors({required: true});
    }
  }

  handleCancel() {
    this.isVisibleDialog = false;
    this.closeModal.emit('closeOffense');
  }

  handleSave() {
    this.isConfirmLoading = true;
    this.validateForm();
    if (this.lawOffenseModalForm.invalid) {
      this.isConfirmLoading = false;
    } else {
      setTimeout(() => {
        this.lawOffenseOutput = this.lawOffenseModalForm.value;
        switch (this.mode) {
          case ComponentMode.UPDATE: {
            if (this.lawOffenseModel) {
              this.lawOffenseOutput.createdBy = this.lawOffenseModel.createdBy;
              this.lawOffenseOutput.createdAt = this.lawOffenseModel.createdAt;
              this.lawOffenseOutput.updatedBy = this.userInfo.userid;
              this.lawOffenseOutput.updatedAt = this.convertDate(new Date());
            }
            break;
          }
          case ComponentMode.CREATE: {
            this.lawOffenseOutput.createdBy = this.userInfo.userid;
            this.lawOffenseOutput.createdAt = this.convertDate(new Date());
            break;
          }
        }

        this.saveEmitter.emit(this.lawOffenseOutput);
        this.isConfirmLoading = false;
      }, 500);
    }
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  convertDate(inputDate: any) {
    return this.dateService.convertDateToStringByPattern(inputDate, 'HH:mm:ss dd/MM/yyyy');
  }
}
