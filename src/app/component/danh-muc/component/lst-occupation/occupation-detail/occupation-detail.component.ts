import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-occupation-detail',
  templateUrl: './occupation-detail.component.html',
  styleUrls: ['./occupation-detail.component.scss']
})
export class OccupationDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
