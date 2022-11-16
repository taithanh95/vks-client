import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {VerificationInvestigationModel} from '../../../../../model/verification-investigation.model';
import {GeneralModelStatus, ComponentMode} from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-verification-investigation-list',
  templateUrl: './verification-investigation-list.component.html',
  styleUrls: ['./verification-investigation-list.component.scss']
})
export class VerificationInvestigationListComponent implements OnChanges {
  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  deletedInvestigationList: VerificationInvestigationModel[] = [];
  @Input() procurators: any[];
  @Input() visibleInvestigationList: VerificationInvestigationModel[] = [];
  loading: boolean;
  isDialogVisible: boolean;
  indexForEdit: number;
  verificationInvestigationForEdit: VerificationInvestigationModel = {
    contentRequest: '',
    createDate: null,
    createUser: '',
    id: 0,
    note: '',
    procuratorsRequest: '',
    procuratorsRequestId: '',
    result: '',
    status: null,
    type: null,
    updateDate: null,
    updateUser: '',
    verificationDate: null,
    verificationInvestigationCode: ''
  };
  isCollapse = true;
  pageSize: number[] = [5, 10, 15];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.verificationInvestigationList && this.visibleInvestigationList) {
      this.visibleInvestigationList = [...this.visibleInvestigationList];
      this.deletedInvestigationList = [];
    }
  }

  getActualInvestigationRequestList(): VerificationInvestigationModel[] {
    return [...this.visibleInvestigationList, ...this.deletedInvestigationList];
  }

  deleteRequest(index: number) {
    const deletedItem = this.visibleInvestigationList.splice(index, 1)[0];
    this.visibleInvestigationList = [...this.visibleInvestigationList];
    if (deletedItem && deletedItem.id) {
      deletedItem.status = GeneralModelStatus.INACTIVE;
      this.deletedInvestigationList.push(deletedItem);
    }
  }

  addOrEditVerificationInvestigation(verificationInvestigationModel: VerificationInvestigationModel) {
    if (this.mode === ComponentMode.CREATE) {
      verificationInvestigationModel.status = GeneralModelStatus.ACTIVE;
      this.visibleInvestigationList = [...this.visibleInvestigationList, verificationInvestigationModel];
    } else if (this.mode === ComponentMode.UPDATE) {
      this.visibleInvestigationList[this.indexForEdit] = verificationInvestigationModel;
      this.visibleInvestigationList = [...this.visibleInvestigationList];
    }
    this.isDialogVisible = false;
  }

  openDetailDialog(mode: ComponentMode, index?: number) {
    this.mode = mode;
    switch (this.mode) {
      case ComponentMode.VIEW:
      case ComponentMode.VIEW_FROM_PARENT:
      case ComponentMode.UPDATE:
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.verificationInvestigationForEdit = this.visibleInvestigationList[this.indexForEdit];
          this.isDialogVisible = true;
        }
        break;
      case ComponentMode.CREATE:
        this.verificationInvestigationForEdit = {
          contentRequest: '',
          createDate: null,
          createUser: '',
          id: 0,
          note: '',
          procuratorsRequest: '',
          procuratorsRequestId: '',
          result: '',
          status: null,
          type: null,
          updateDate: null,
          updateUser: '',
          verificationDate: null,
          verificationInvestigationCode: ''
        };
        this.isDialogVisible = true;
    }
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  cancelDelete() {
    // to do
  }
}
