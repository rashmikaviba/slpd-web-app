import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DefaultLayoutNewComponent } from "src/app/layout/default-layout-new/default-layout-new.component";
import { TripManagementComponent } from "./trip-management/trip-management.component";
import { DynamicComponentLoaderComponent } from "./dynamic-component-loader/dynamic-component-loader.component";
import { RoleResolver } from "./role.resolver";

// const routes: Routes = [
//   {
//     path: "",
//     component: DefaultLayoutNewComponent,
//     children: [
//       {
//         path: "",
//         component: TripManagementComponent,
//       },
//     ],
//   },
// ];

const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutNewComponent,
    children: [
      {
        path: "",
        component: DynamicComponentLoaderComponent,
        resolve: {
          dynamicComponent: RoleResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripManagementRoutingModule {}
