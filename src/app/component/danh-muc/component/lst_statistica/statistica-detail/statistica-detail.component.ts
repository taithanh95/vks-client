import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-statistica-detail',
  templateUrl: './statistica-detail.component.html',
  styleUrls: ['./statistica-detail.component.scss']
})
export class StatisticaDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
  
  textYesNo=(status)=> status === 'Y' ? 'Có': 'Không';
}
