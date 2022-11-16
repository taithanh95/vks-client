import {Component, Input, OnInit} from '@angular/core';
import {RegisterDecisionCase} from '../../model/register-decision-case';
import {CCase} from '../../model/so-thu-ly.model';

@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss']
})
export class CaseDetailsComponent implements OnInit {
  @Input() case: CCase;
  collapse = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
  }

}
