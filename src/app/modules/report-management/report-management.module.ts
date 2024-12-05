import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportManagementRoutingModule } from './report-management-routing.module';
import { ReportNavigationDashboardComponent } from './report-navigation-dashboard/report-navigation-dashboard.component';


@NgModule({
  declarations: [
    ReportNavigationDashboardComponent
  ],
  imports: [
    CommonModule,
    ReportManagementRoutingModule
  ]
})
export class ReportManagementModule { }
