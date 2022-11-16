import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { SothulyRoutingModule } from './sothuly-routing.module';
import {PermissionAssessorPipe} from './permission-assessor.pipe';
import {CookieService} from 'ngx-cookie-service';
import {DateChangeService} from "../../service/date-change.service";
import {StringService} from "../../common/util/string.service";


@NgModule({
  declarations: [PermissionAssessorPipe],
  exports: [
    PermissionAssessorPipe
  ],
  imports: [
    CommonModule,
    SothulyRoutingModule,
  ],
  providers: [CookieService, DatePipe, DateChangeService, StringService]
})
export class SothulyModule { }
