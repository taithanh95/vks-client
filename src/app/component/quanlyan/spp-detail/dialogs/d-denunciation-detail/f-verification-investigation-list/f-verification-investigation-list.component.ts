import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {VerificationInvestigationModel} from '../../../../../../model/verification-investigation.model';
import {GeneralModelStatus, ComponentMode} from '../../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-f-verification-investigation-list',
  templateUrl: './f-verification-investigation-list.component.html',
  styleUrls: ['./f-verification-investigation-list.component.scss']
})
export class FVerificationInvestigationListComponent implements OnChanges {
  modeEnum = ComponentMode;
  @Input() mode: ComponentMode = ComponentMode.VIEW_FROM_PARENT;
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

  openDetailDialog(mode: ComponentMode, index?: number) {
    this.mode = mode;
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.verificationInvestigationForEdit = this.visibleInvestigationList[this.indexForEdit];
          this.isDialogVisible = true;
        };
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  cancelDelete() {
    // to do
  }
}
