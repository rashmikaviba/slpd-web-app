import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutNewComponent } from 'src/app/layout/default-layout-new/default-layout-new.component';
import { SuperAdminLeaveFormComponent } from './super-admin-leave-form/super-admin-leave-form.component';
import { AdminLeaveFormComponent } from './admin-leave-form/admin-leave-form.component';
import { DriverLeaveFormComponent } from './driver-leave-form/driver-leave-form.component';

const routes: Routes = [
  {
    path: 'super-admin-leave', component: DefaultLayoutNewComponent,
    children: [
      {
        path: '',
        component: SuperAdminLeaveFormComponent
      }
    ]
  },
  {
    path: 'admin-leave', component: DefaultLayoutNewComponent,
    children: [
      {
        path: '',
        component: AdminLeaveFormComponent
      }
    ]
  },
  {
    path: 'driver-leave', component: DefaultLayoutNewComponent,
    children: [
      {
        path: '',
        component: DriverLeaveFormComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveManagementRoutingModule { }
