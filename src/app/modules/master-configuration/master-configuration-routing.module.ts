import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutNewComponent } from 'src/app/layout/default-layout-new/default-layout-new.component';
import { ProductManagementComponent } from '../inventory-management/product-management/product-management.component';
import { GoodReceivedNoteComponent } from '../inventory-management/good-received-note/good-received-note.component';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { GarageManagementComponent } from './garage-management/garage-management.component';
import { UserManagementComponent } from './user-management/user-management.component';

const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutNewComponent,
    children: [
      {
        path: "vehicle-management",
        component: VehicleManagementComponent,
      },
      {
        path: "garage-management",
        component: GarageManagementComponent,
      },
      {
        path: "user-management",
        component: UserManagementComponent,
      }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterConfigurationRoutingModule { }
