// import {createEntityAdapter, EntityState} from '@ngrx/entity';
// import {Group} from '../model/group.class';
// import {Role} from '../model/role.class';
// import {AdminConfigActions, AdminConfigActionTypes} from './config-admin.action';
//
// interface GroupState extends EntityState<Group> {
//   selectedGroupId: number | null;
//   loading: boolean;
//   error: string;
// }
//
// interface RoleState extends EntityState<Role> {
//   selectedRoleId: number | null;
//   loading: boolean;
// }
// export const defaultGroup: GroupState = {
//   ids: [],
//   entities: {},
//   selectedGroupId: null,
//   loading: false,
//   error: ''
// };
// export const defaultRole: RoleState = {
//   ids: [],
//   entities: {},
//   selectedRoleId: null,
//   loading: false
// };
// export interface State {
//   error: string;
//   loading: boolean;
//   msg: string;
//   groups: GroupState;
//   roles: RoleState;
// }
//
// const adapterGroup = createEntityAdapter<Group>();
// const adapterRole = createEntityAdapter<Role>();
//
// const groupInitialState: GroupState = adapterGroup.getInitialState(defaultGroup);
// const roleInitialState: RoleState = adapterRole.getInitialState(defaultRole);
//
// const initialState = {
//   error: '',
//   loading: true,
//   msg: 'Multiple entities in the same state',
//   groups: groupInitialState,
//   roles: roleInitialState
// }
//
// export function reducer(state: State = initialState, action: AdminConfigActions): State {
//
//   switch (action.type) {
//     case AdminConfigActionTypes.GetGroupSuccess:
//       return { ...state, loading: true, groups: adapterGroup.addMany(action.group, state.groups) };
//     case AdminConfigActionTypes.DeleteGroupSuccess:
//       return { ...state, groups: adapterGroup.removeOne(action.id, state.groups)};
//     case AdminConfigActionTypes.DeleteGroupFail:
//       return { ...state, error: 'error'}
//     case AdminConfigActionTypes.UpdateGroupSuccess:
//       return {...state, loading: true, groups: adapterGroup.updateOne(action.group, state.groups)};
//     case AdminConfigActionTypes.AddRoleSuccess:
//       return {...state, loading: true, roles: adapterRole.addOne(action.payload, state.roles)};
//     case  AdminConfigActionTypes.DeleteRoleSuccess:
//       return {...state , roles: adapterRole.removeOne(action.type, state.roles)};
//     case AdminConfigActionTypes.EditRoleSuccess:
//       return {...state , roles: adapterRole.updateOne(action.payload, state.roles)};
//     case AdminConfigActionTypes.GetRoleSuccess:
//       const { role } = action;
//       return {...state, roles: adapterRole.addMany(role, {  ...state.roles})};
//     default:
//       return state;
//   }
// }
// export const selectGroupState = (state: State) => state.groups;
// export const selectRoleState = (state: State) => state.roles;
// export const selectError = (state: State) => state.error;
// export const {selectAll : selectAllGroup} = adapterGroup.getSelectors();
// export const {selectAll : selectAllRole} = adapterRole.getSelectors();
