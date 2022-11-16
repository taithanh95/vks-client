import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-against-detail',
  templateUrl: './against-detail.component.html',
  styleUrls: ['./against-detail.component.scss']
})
export class AgainstDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
