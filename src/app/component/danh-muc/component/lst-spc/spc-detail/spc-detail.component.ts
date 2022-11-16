import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-spc-detail',
  templateUrl: './spc-detail.component.html',
  styleUrls: ['./spc-detail.component.scss']
})
export class SpcDetailComponent implements OnInit {
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
