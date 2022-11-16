import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-detail-transfer-case',
  templateUrl: './detail-transfer-case.component.html',
  styleUrls: ['./detail-transfer-case.component.scss']
})
export class DetailTransferCaseComponent implements OnInit {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  constructor() {
  }

  ngOnInit(): void {
  }

  handleCancel=()=> this.closeModal.emit(false);
}
