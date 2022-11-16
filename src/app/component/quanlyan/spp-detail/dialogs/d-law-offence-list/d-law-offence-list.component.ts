import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {LawOffenseModel} from '../../../../../model/law-offense.model';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../shared/constants/constant.class';
import {NzTableComponent} from 'ng-zorro-antd/table';
import {NotificationService} from '../../../../../service/notification.service';

@Component({
  selector: 'app-d-law-offence-list',
  templateUrl: './d-law-offence-list.component.html',
  styleUrls: ['./d-law-offence-list.component.scss']
})
export class DLawOffenceListComponent implements OnInit, OnChanges {

  @Input() visibleLawOffenceList: LawOffenseModel[];
  @Input() mode:ComponentMode=ComponentMode.CREATE;
  @Input() arresteeId:number;
  isVisibleDialog:boolean;
  @ViewChild('basicTable') basicTable:NzTableComponent;
  isCollapse = true;
  pageSize: number[] = [5, 10, 15];
  indexForEdit:number;
  modeEnum=ComponentMode;
  loading:boolean;
  deletedOffenceList: LawOffenseModel[]=[];

  constructor(
    private notification: NotificationService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['visibleLawOffenceList']&&this.visibleLawOffenceList){
      this.visibleLawOffenceList=[...this.visibleLawOffenceList];
      this.deletedOffenceList=[];
    }
  }

  ngOnInit(): void {
    this.visibleLawOffenceList=[];
    this.deletedOffenceList=[];
  }

  cancelDelete(){

  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
}
