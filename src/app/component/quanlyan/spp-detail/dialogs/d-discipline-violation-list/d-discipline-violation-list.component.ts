import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DisciplineViolationModel} from '../../../../../model/discipline-violation.model';
import {ComponentMode, Constant, GeneralModelStatus} from '../../../../../shared/constants/constant.class';
import {NzTableComponent} from 'ng-zorro-antd/table';
import {NotificationService} from '../../../../../service/notification.service';

@Component({
  selector: 'app-d-discipline-violation-list',
  templateUrl: './d-discipline-violation-list.component.html',
  styleUrls: ['./d-discipline-violation-list.component.scss']
})
export class DDisciplineViolationListComponent implements OnInit, OnChanges {
  @Input() visibleViolationList: DisciplineViolationModel[];
  @Input() mode: ComponentMode = ComponentMode.CREATE;
  @Input() arresteeId: number;
  isVisibleDialog: boolean;
  @ViewChild('basicTable') basicTable: NzTableComponent;
  isCollapse = true;
  pageSize: number[] = [5, 10, 15];
  indexForEdit: number;
  modeEnum = ComponentMode;
  loading: boolean;
  deletedViolationList: DisciplineViolationModel[] = [];


  constructor(private notification: NotificationService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visibleViolationList && this.visibleViolationList) {
      this.visibleViolationList = [...this.visibleViolationList];
      this.deletedViolationList = [];
    }
  }

  ngOnInit(): void {
    this.visibleViolationList = [];
    this.deletedViolationList = [];
  }

  cancelDelete() {

  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
}
