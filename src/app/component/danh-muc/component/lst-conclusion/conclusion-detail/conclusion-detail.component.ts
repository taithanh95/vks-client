import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-conclusion-detail',
  templateUrl: './conclusion-detail.component.html',
  styleUrls: ['./conclusion-detail.component.scss']
})
export class ConclusionDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
