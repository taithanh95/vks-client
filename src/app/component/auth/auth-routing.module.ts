import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthorizedComponent} from './authorized/authorized.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ServerErrorComponent} from './server-error/server-error.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: AuthorizedComponent },
  { path: '**', component: PageNotFoundComponent },
  // { path: '**', redirectTo: '/404' }
  // { path: 'server-error', component: ServerErrorComponent }

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
