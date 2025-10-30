import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleMaintenanceComponent } from './vehicle-maintenance/vehicle-maintenance.component';
import { DefaultLayoutNewComponent } from 'src/app/layout/default-layout-new/default-layout-new.component';

const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutNewComponent,
    children: [
      {
        path: "",

        component: VehicleMaintenanceComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleMaintenanceRoutingModule { }
