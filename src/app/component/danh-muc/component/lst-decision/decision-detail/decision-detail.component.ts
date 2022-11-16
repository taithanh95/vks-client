import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-decision-detail',
  templateUrl: './decision-detail.component.html',
  styleUrls: ['./decision-detail.component.scss']
})
export class DecisionDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
}
