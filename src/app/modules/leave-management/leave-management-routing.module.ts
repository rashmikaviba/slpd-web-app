import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutNewComponent } from 'src/app/layout/default-layout-new/default-layout-new.component';
import { SuperAdminLeaveFormComponent } from './super-admin-leave-form/super-admin-leave-form.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveManagementRoutingModule { }
