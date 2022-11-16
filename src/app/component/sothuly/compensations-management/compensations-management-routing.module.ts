import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompensationsManagementComponent } from './compensations-management.component';

const routes: Routes = [{ path: '', component: CompensationsManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompensationsManagementRoutingModule { }
