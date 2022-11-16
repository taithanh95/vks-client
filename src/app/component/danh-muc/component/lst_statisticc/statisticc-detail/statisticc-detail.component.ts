import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-statisticc-detail',
  templateUrl: './statisticc-detail.component.html',
  styleUrls: ['./statisticc-detail.component.scss']
})
export class StatisticcDetailComponent {

  @Input() data: any;
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
  }
  
  textYesNo=(status)=> status === 'Y' ? 'Có': 'Không';
}
