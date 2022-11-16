import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reason-detail',
  templateUrl: './reason-detail.component.html',
  styleUrls: ['./reason-detail.component.scss']
})
export class ReasonDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
