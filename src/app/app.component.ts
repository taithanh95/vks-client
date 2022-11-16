import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LoaderService} from './service/loader.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  constructor(private loaderService: LoaderService, private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit(): void {
  }


}
