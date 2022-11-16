import {Component, Input, OnInit} from '@angular/core';
@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent implements OnInit {
  @Input() sppCase: any;
  isCollapse: boolean;

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  constructor() {}

  ngOnInit(): void {
    this.isCollapse = true;
  }

  toCaseType(caseType) {
    switch (caseType) {
      case 'L0':
        return 'Chưa xác định';
      case 'L1':
        return 'Ít nghiêm trọng';
      case 'L2':
        return 'Nghiêm trọng';
      case 'L3':
        return 'Rất nghiêm trọng';
      case 'L4':
        return 'Đặc biệt nghiêm trọng';
    }
  }
}
