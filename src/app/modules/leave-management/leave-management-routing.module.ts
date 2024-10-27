import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DefaultLayoutNewComponent } from "src/app/layout/default-layout-new/default-layout-new.component";
import { SuperAdminLeaveFormComponent } from "./super-admin-leave-form/super-admin-leave-form.component";
import { AdminLeaveFormComponent } from "./admin-leave-form/admin-leave-form.component";
import { DriverLeaveFormComponent } from "./driver-leave-form/driver-leave-form.component";
import { RoleResolver } from "./role.resolver";
import { DynamicComponentLoaderComponent } from "./dynamic-component-loader/dynamic-component-loader.component";

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
export class LeaveManagementRoutingModule {
  constructor() {}

  ngOnInit() {}
}
