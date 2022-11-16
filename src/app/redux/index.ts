// import {
//   ActionReducerMap,
//   createFeatureSelector,
//   createSelector
// } from '@ngrx/store';
//
// import * as fromConfig from './config-admin.reducer';
//
// export interface AppState {
//   example: fromConfig.State;
// }
//
// export const reducers: ActionReducerMap<AppState> = {
//   example: fromConfig.reducer
// };
//
// export const selectExampleModule = createFeatureSelector<fromConfig.State>('config-admin');
// export const selectGroupState = createSelector(selectExampleModule, fromConfig.selectGroupState);
// export const selectRoleState = createSelector(selectExampleModule, fromConfig.selectRoleState);
// export const selectError = createSelector(selectExampleModule, fromConfig.selectError);
// export const selectAllGroup = createSelector(selectGroupState, fromConfig.selectAllGroup);
// export const selectAllRole = createSelector(selectRoleState, fromConfig.selectAllRole);
