import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-law-group-detail',
  templateUrl: './law-group-detail.component.html',
  styleUrls: ['./law-group-detail.component.scss']
})
export class LawGroupDetailComponent implements OnInit {
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

  convert(f): any {
    return f === '01' ? 'BLTTHS  2004' : (f === '02' ? 'BLHS 1999' : ((f === '03' ? 'BLDS 1995' :
      (f === '04' ? 'BLHC' : (f === '05' ? 'BLHS 1985' : (f === '06' ? 'BLHS 2015' : 'BLHS 2015'))))));
  }
}
