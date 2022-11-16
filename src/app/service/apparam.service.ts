import {Injectable} from '@angular/core';
import {BaseService} from '../shared/base-service/base-service.service';
import {Observable} from 'rxjs';
import {UrlConstant} from '../shared/constants/url.class';
import {ApParamModel} from '../model/ap-param.model';

@Injectable()
export class ApParamService extends BaseService {

  getParams(code): Observable<ApParamModel[]> {
    return this.get(UrlConstant.LIST_PARAMS, code);
  }

}

