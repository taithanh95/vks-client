import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-detail-view-split',
  templateUrl: './detail-view-split.component.html',
  styleUrls: ['./detail-view-split.component.scss']
})
export class DetailViewSplitComponent implements OnInit {

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