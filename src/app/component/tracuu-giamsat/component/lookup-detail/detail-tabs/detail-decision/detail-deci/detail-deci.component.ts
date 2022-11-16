import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-detail-deci',
  templateUrl: './detail-deci.component.html',
  styleUrls: ['./detail-deci.component.scss']
})
export class DetailDeciComponent implements OnInit {
  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }

}
