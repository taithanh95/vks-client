// import {Action} from '@ngrx/store';
// import {Group} from '../model/group.class';
// import {Role} from '../model/role.class';
// import {Update} from '@ngrx/entity';
//
// export enum AdminConfigActionTypes {
//   GetGroupLoad = '[Group] Get Group',
//   GetGroupSuccess= '[Group] Get Group Success',
//   DeleteGroup = '[Group] Delete Group',
//   DeleteGroupSuccess = '[Group] Delete Group Success',
//   DeleteGroupFail = '[Group] Delete Group Fail',
//   UpdateGroup = '[Group] Update Group',
//   UpdateGroupSuccess = '[Group] Update Group Success',
//   GetRoleLoad = '[Role] Get Role',
//   GetRoleSuccess= '[Role] Get Role Success',
//   DeleteRole = '[Role] Delete Role',
//   DeleteRoleSuccess = '[Role] Delete Role Success',
//   AddRole = '[Role] Add Role',
//   AddRoleSuccess = '[Role] Add Role Success',
//   EditRole = '[Role] Edit Role',
//   EditRoleSuccess = '[Role] Edit Role Success'
// }
// export class GetGroupLoad implements Action {
//   public readonly type = AdminConfigActionTypes.GetGroupLoad;
// }
// export class GetGroupSuccess implements Action {
//   public readonly  type = AdminConfigActionTypes.GetGroupSuccess;
//   constructor(public group: Group []) {}
// }
// export class DeleteGroup implements Action {
//   public readonly type = AdminConfigActionTypes.DeleteGroup;
//   constructor(public id: number) {}
// }
// export class DeleteGroupSuccess implements Action {
//   public readonly type = AdminConfigActionTypes.DeleteGroupSuccess;
//   constructor(public id: number) {}
// }
// export class DeleteGroupFail implements Action {
//   public readonly type = AdminConfigActionTypes.DeleteGroupFail;
//   constructor(public err: string) {}
// }
// export class UpdateGroup implements Action {
//   public readonly type = AdminConfigActionTypes.UpdateGroup;
//   constructor(public group: Group) {}
// }
// export class UpdateGroupSuccess implements Action {
//   public readonly type = AdminConfigActionTypes.UpdateGroupSuccess;
//   constructor(public group: Update<Group>) {}
// }
// export class GetRoleLoad implements Action {
//   public readonly type = AdminConfigActionTypes.GetRoleLoad;
// }
// export class GetRoleSuccess implements Action {
//   public readonly  type = AdminConfigActionTypes.GetRoleSuccess;
//   constructor(public role: Role []) {}
// }
// export class DeleteRole implements Action {
//   public readonly  type = AdminConfigActionTypes.DeleteRole;
//   constructor(public payload: number) {}
// }
// export class DeleteRoleSuccess implements Action {
//   public readonly  type = AdminConfigActionTypes.DeleteRoleSuccess;
//   constructor(public payload: number) {}
// }
//
// export class AddRole implements Action {
//   public readonly type = AdminConfigActionTypes.AddRole;
//   constructor(public payload: Role) {}
// }
// export class AddRoleSuccess implements Action {
//   public readonly type = AdminConfigActionTypes.AddRoleSuccess;
//   constructor(public payload: Role) {}
// }
// export class EditRole implements Action {
//   public readonly type = AdminConfigActionTypes.EditRole;
//   constructor(public payload: Role) {}
// }
// export class EditRoleSuccess implements Action {
//   public readonly type = AdminConfigActionTypes.EditRoleSuccess;
//   constructor(public payload: Update<Role>) {}
// }
// export type AdminConfigActions =
//   GetGroupLoad |
//   GetGroupSuccess |
//   DeleteGroup |
//   DeleteGroupSuccess |
//   DeleteGroupFail |
//   UpdateGroup |
//   UpdateGroupSuccess |
//   GetRoleLoad |
//   GetRoleSuccess|
//   DeleteRole |
//   DeleteRoleSuccess |
//   AddRole |
//   AddRoleSuccess |
//   EditRole |
//   EditRoleSuccess
//   ;
