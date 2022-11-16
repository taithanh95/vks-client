import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ComponentMode, Constant, GeneralModelStatus} from "../../../../../shared/constants/constant.class";
import {LawOffenseModel} from "../../../../../model/law-offense.model";
import {NotificationService} from "../../../../../service/notification.service";
import {NzTableComponent} from "ng-zorro-antd/table";

@Component({
  selector: 'app-law-offence-list',
  templateUrl: './law-offence-list.component.html',
  styleUrls: ['./law-offence-list.component.scss']
})
export class LawOffenceListComponent implements OnInit, OnChanges {

  @Input() visibleLawOffenceList: LawOffenseModel[];
  @Input() mode:ComponentMode=ComponentMode.CREATE;
  @Input() arresteeId:number;
  isVisibleDialog:boolean;
  @ViewChild('basicTable') basicTable:NzTableComponent;
  isCollapse = true;
  pageSize: number[] = [5, 10, 15];
  indexForEdit:number;
  modeLawOffense:ComponentMode;
  modeEnum=ComponentMode;
  loading:boolean;
  lawOffenceForEdit: LawOffenseModel;
  deletedOffenceList: LawOffenseModel[]=[];

  constructor(
    private notification: NotificationService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('onchange visibleLawOffenceList')
    if(changes['visibleLawOffenceList']&&this.visibleLawOffenceList){
      this.visibleLawOffenceList=[...this.visibleLawOffenceList];
      this.deletedOffenceList=[];
    }
  }

  getActualLawOffenceList():LawOffenseModel[]{
    return [...this.visibleLawOffenceList,...this.deletedOffenceList];
  }

  deleteLawOffence(index:number){
    index = index + (this.basicTable.nzPageIndex-1)*this.basicTable.nzPageSize;
    const deleteItem=this.visibleLawOffenceList.splice(index,1)[0];
    this.visibleLawOffenceList = [...this.visibleLawOffenceList];
    this.notification.showNotification(Constant.SUCCESS,'Xóa thành công!')
    if(deleteItem && deleteItem.id){
      deleteItem.status=GeneralModelStatus.INACTIVE;
      this.deletedOffenceList.push(deleteItem);
    }
  }

  ngOnInit(): void {
    this.visibleLawOffenceList=[];
    this.deletedOffenceList=[];
  }

  cancelDelete(){

  }

  addOrUpdateLawOffence(lawOffenseModel: LawOffenseModel) {
    if (this.modeLawOffense === ComponentMode.CREATE) {
      lawOffenseModel.status = GeneralModelStatus.ACTIVE;
      this.visibleLawOffenceList = [...this.visibleLawOffenceList, lawOffenseModel];
    } else if (this.modeLawOffense === ComponentMode.UPDATE) {
      this.visibleLawOffenceList[this.indexForEdit] = lawOffenseModel;
      this.visibleLawOffenceList = [...this.visibleLawOffenceList];
    }
    this.isVisibleDialog = false;
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  openDetailDialog(mode: ComponentMode, index?: number){
    index = index + (this.basicTable.nzPageIndex-1)*this.basicTable.nzPageSize;
    this.modeLawOffense = mode;
    switch (this.modeLawOffense) {
      case ComponentMode.VIEW:
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.lawOffenceForEdit = this.visibleLawOffenceList[this.indexForEdit];
          this.isVisibleDialog = true;
        }
        break;
      case ComponentMode.VIEW_FROM_PARENT:
      case ComponentMode.UPDATE:
        if (index !== undefined && index !== null) {
          this.indexForEdit = index;
          this.lawOffenceForEdit = this.visibleLawOffenceList[this.indexForEdit];
          this.isVisibleDialog = true;
        }
        break;
      case ComponentMode.CREATE:
        this.isVisibleDialog = true;
        this.lawOffenceForEdit = null;
    }
  }

}
