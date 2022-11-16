// import {Injectable} from '@angular/core';
// import {Actions, Effect, ofType} from '@ngrx/effects';
// import {Observable, of} from 'rxjs';
// import * as adminAction from './config-admin.action';
// import {catchError, map, mergeMap} from 'rxjs/operators';
// import {Action} from '@ngrx/store';
// import {GroupService} from '../service/group-service';
// import {Role} from '../model/role.class';
// import {RoleService} from '../service/role-service';
// import {Group} from '../model/group.class';
//
//
// @Injectable()
// export class AdminConfigEffects {
//   constructor(
//     private actions$: Actions,
//     private roleService: RoleService,
//     private groupService: GroupService
//   ) {
//   }
//
//   @Effect()
//   loadRoles$: Observable<Action> = this.actions$.pipe(
//     ofType<adminAction.GetRoleLoad>(
//       adminAction.AdminConfigActionTypes.GetRoleLoad
//     ),
//     mergeMap((action: adminAction.GetRoleLoad) =>
//       this.roleService.getRole().pipe(
//         map(
//           (data: Role[]) =>
//             new adminAction.GetRoleSuccess(data)
//         ),
//       )
//     )
//   );
//
//   @Effect()
//   loadGroups$: Observable<Action> = this.actions$.pipe(
//     ofType<adminAction.GetGroupLoad>(
//       adminAction.AdminConfigActionTypes.GetGroupLoad
//     ),
//     mergeMap((action: adminAction.GetGroupLoad) =>
//       this.groupService.getGroup().pipe(
//         map(
//           (data: Group[]) =>
//             new adminAction.GetGroupSuccess(data)
//         ),
//       )
//     )
//   );
//   @Effect()
//   deleteGroup$: Observable<Action> = this.actions$.pipe(
//     ofType<adminAction.DeleteGroup>(
//       adminAction.AdminConfigActionTypes.DeleteGroup
//     ),
//     map((action: adminAction.DeleteGroup) => action.id),
//     mergeMap((id: number) =>
//       this.groupService.deleteGroup(id).pipe(
//         map(() => new adminAction.DeleteGroupSuccess(id)),
//         catchError(err => of(new adminAction.DeleteGroupFail(err)))
//       ),
//     )
//   );
//   @Effect()
//   editGroup$: Observable<Action> = this.actions$.pipe(
//     ofType<adminAction.UpdateGroup>(adminAction.AdminConfigActionTypes.UpdateGroup),
//     map((action: adminAction.UpdateGroup) => action.group),
//     mergeMap((group: Group) =>
//       this.groupService.updateGroup(group).pipe(map(() =>
//         new adminAction.UpdateGroupSuccess({id : group.id, changes: group}))),
//     )
//   );
//   @Effect()
//   deleteRole$: Observable<Action> = this.actions$.pipe(
//     ofType<adminAction.DeleteRole>(
//       adminAction.AdminConfigActionTypes.DeleteRole
//     ),
//     map((action: adminAction.DeleteRole) => action.payload),
//     mergeMap((id: number) =>
//       this.roleService.deleteRole(id).pipe(
//         map(() => new adminAction.DeleteRoleSuccess(id)),
//       )
//     )
//   );
//   @Effect()
//   addRole$: Observable<Action> = this.actions$.pipe(
//     ofType<adminAction.AddRole>(adminAction.AdminConfigActionTypes.AddRole),
//     map((action: adminAction.AddRole) => action.payload),
//     mergeMap((role: Role) =>
//       this.roleService.addRole(role).pipe(map(() => new adminAction.AddRoleSuccess(role))),
//     )
//   );
//   @Effect()
//   editRole$: Observable<Action> = this.actions$.pipe(
//     ofType<adminAction.EditRole>(adminAction.AdminConfigActionTypes.EditRole),
//     map((action: adminAction.EditRole) => action.payload),
//     mergeMap((role: Role) =>
//       this.roleService.updateRole(role).pipe(map(() =>
//         new adminAction.EditRoleSuccess({id : role.id, changes: role}))),
//     )
//   );
// }
