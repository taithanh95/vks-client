// import {
//   ModuleWithProviders,
//   NgModule,
//   Optional,
//   SkipSelf
// } from '@angular/core';
//
// import { StoreModule } from '@ngrx/store';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
//
// import { reducers } from './index';
//
// @NgModule({
//   imports: [
//     StoreModule.forRoot(reducers, {}),
//     StoreDevtoolsModule.instrument()
//   ]
// })
// export class StateModule {
//   constructor(@Optional() @SkipSelf() parentModule: StateModule) {
//     if (parentModule) {
//       throw new Error('StateModule is already loaded. Import it in the AppModule only');
//     }
//   }
//
//   public static forRoot(): ModuleWithProviders {
//     return {
//       ngModule: StateModule,
//       providers: []
//     };
//   }
// }
