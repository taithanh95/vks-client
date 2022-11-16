import {Pipe, PipeTransform} from '@angular/core';
import {ShareInfoEnum} from './denouncement-management/share-info.enum';
@Pipe({
  pure: false,
  name: 'permissionAssessor'
})
export class PermissionAssessorPipe implements PipeTransform{

  transform(value: any, ...args: any[]): any {
    const obj = value;
    const action: 'view' | 'update' | 'delete'= args[0];
    const username: string = args[1];
    const sppId: string = args[2];
    if (sppId !== obj.sppId) {
      return false;
    }
    if (username === obj.createUser) {
      return true;
    } else if(action!=='delete'){
      switch (obj.shareInfoLevel) {
        case ShareInfoEnum.INTERNAL:
          return true;
        case ShareInfoEnum.PROTECTED:
          return action === 'view';
        case ShareInfoEnum.PRIVATE:
        default:
          return false;
      }
    }
  }

}
