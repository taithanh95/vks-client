import {Constant} from './constant.class';

export class CheckAction {
//   public static hasActivity(actionName: string) {
//     const list = CheckAction.getActionName();
//     const result = list.filter(item => {
//        return item === actionName;
//    });
//     if (result.length > 0) {
//       return true;
//     }
//     return false;
// }
//   public static getActionName() {
//     const a = new Set();
//     const userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
//     userInfo.roles.filter(item => {
//       item.actionResponses.filter(action => {
//         a.add(action.name);
//       });
//     });
//     const list = Array.from(a);
//     return list;
//   }

  public static getListPermission() {
    const listPermission = new Set();
    const userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    userInfo.roles.filter(item => {
      item.actionResponses.filter(action => {
        listPermission.add(action.name);
      });
    });
    return listPermission;
  }
}

