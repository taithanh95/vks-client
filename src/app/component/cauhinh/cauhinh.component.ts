import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GeneralService} from '../../service/general-service';
import {Constant} from '../../shared/constants/constant.class';
import {NotificationService} from '../../service/notification.service';

@Component({
  selector: 'app-cauhinh',
  templateUrl: './cauhinh.component.html',
  styleUrls: ['./cauhinh.component.scss']
})
export class CauhinhComponent implements OnInit {
  validateForm!: FormGroup;
  keys: any[];
  dateFormat = 'dd/MM/yyyy';
  constructor(
    private fb: FormBuilder,
    private generalService: GeneralService,
    private notificationService: NotificationService

  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({});
    this.getListData();
  }
  submitForm() {
    const formValue = this.validateForm.value;
    console.log(formValue);
    this.generalService.updateSystemConfig(formValue).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
    }, error => {

    });
  }
  getListData() {
    this.generalService.getSystemConfig().subscribe(res => {
      if (res !== null) {
        console.log(res);

        this.keys = Object.keys(res[0]);
        console.log(this.keys);
        for (var i = 0; i < this.keys.length; i ++) {
          const field = this.keys[i];
          const fc = new FormControl(null, Validators.required);
          fc.setValue(res[0][field]);
          this.validateForm.addControl(field, fc);

        }
      }
    }, error => {

    });
  }
}
