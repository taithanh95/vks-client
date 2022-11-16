import {Injectable} from '@angular/core';
import {BaseService} from '../shared/base-service/base-service.service';
import {Observable} from 'rxjs';
import {UrlConstant} from '../shared/constants/url.class';
import {Action} from '../model/action.model';

@Injectable()
export class ActionService  extends  BaseService {
  getAction(): Observable<Action[]> {
    return this.get(UrlConstant.LIST_ACTION);
  }
}

