import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-appeal-detail',
  templateUrl: './appeal-detail.component.html',
  styleUrls: ['./appeal-detail.component.scss']
})
export class AppealDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
