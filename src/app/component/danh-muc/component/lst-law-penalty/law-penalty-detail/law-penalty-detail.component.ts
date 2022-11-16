import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-law-penalty-detail',
  templateUrl: './law-penalty-detail.component.html',
  styleUrls: ['./law-penalty-detail.component.scss']
})
export class LawPenaltyDetailComponent implements OnInit {
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

  f(value): any {
    return value === 'L4' ? 'Đặt biệt nghiêm trọng' : value === 'L3' ?
      'Rất nghiêm trọng' : value === 'L2' ? 'Nghiêm trọng' : 'Ít nghiêm trọng';
  }
}
