import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-detail-view-join',
  templateUrl: './detail-view-join.component.html',
  styleUrls: ['./detail-view-join.component.scss']
})
export class DetailViewJoinComponent implements OnInit {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  constructor() {
    //nothing
   }

  ngOnInit(): void {
    //nothing
  }

  handleCancel=()=> this.closeModal.emit(false);
}
