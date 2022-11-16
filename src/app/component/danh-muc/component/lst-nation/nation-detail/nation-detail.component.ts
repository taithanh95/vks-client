import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-nation-detail',
  templateUrl: './nation-detail.component.html',
  styleUrls: ['./nation-detail.component.scss']
})
export class NationDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
