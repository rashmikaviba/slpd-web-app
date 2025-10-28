import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { DefaultLayoutNewComponent } from "./layout/default-layout-new/default-layout-new.component";
import { DefaultDashboardComponent } from "./layout/default-dashboard/default-dashboard.component";
import { RouteGuardService } from "./shared/services/route-guard.service";
import { QrInfoComponent } from "./shared/components/qr-info/qr-info.component";
import { RecommendedGarageComponent } from "./modules/recommended-garage/recommended-garage.component";
import { SignInComponent } from "./shared/components/sign-in/sign-in.component";
// import { TripManagementComponent } from "./modules/trip-management/trip-management.component";
// import { DriverManagementComponent } from "./modules/driver-management/driver-management.component";
// import { TripManagementByDriverComponent } from "./modules/trip-management/trip-management-by-driver/trip-management-by-driver.component";
// import { LeaveManagementComponent } from "./modules/leave-management/leave-management.component";

const routes: Routes = [
  { path: "", component: SignInComponent, pathMatch: "full" },
  { path: "login", component: SignInComponent },
  { path: "qr-invoice/:qrData", component: QrInfoComponent },
  {
    path: "dashboard",
    component: DefaultLayoutNewComponent,
    children: [
      {
        path: "",
        component: DefaultDashboardComponent,
      },
    ],
  },
  {
    path: "recommended-garage",
    component: DefaultLayoutNewComponent,
    children: [
      {
        path: "",
        component: RecommendedGarageComponent,
      },
    ],
    canActivate: [RouteGuardService],
  },
  // {
  //   path: "user",
  //   loadChildren: () =>
  //     import("./modules/user/user.module").then((m) => m.UserModule),
  //   canActivate: [RouteGuardService],
  // },
  {
    path: "leave-management",
    loadChildren: () =>
      import("./modules/leave-management/leave-management.module").then(
        (m) => m.LeaveManagementModule
      ),
    canActivate: [RouteGuardService],
  },
  // {
  //   path: "vehicle-management",
  //   loadChildren: () =>
  //     import("./modules/vehicle-management/vehicle-management.module").then(
  //       (m) => m.VehicleManagementModule
  //     ),
  //   canActivate: [RouteGuardService],
  // },
  {
    path: "trip-management",
    loadChildren: () =>
      import("./modules/trip-management/trip-management.module").then(
        (m) => m.TripManagementModule
      ),
    canActivate: [RouteGuardService],
  },
  {
    path: "month-audit",
    loadChildren: () =>
      import("./modules/month-audit/month-audit.module").then(
        (m) => m.MonthAuditModule
      ),
    canActivate: [RouteGuardService],
  },
  {
    path: "vehicle-tracking",
    loadChildren: () =>
      import("./modules/vehicle-tracking/vehicle-tracking.module").then(
        (m) => m.VehicleTrackingModule
      ),
    canActivate: [RouteGuardService],
  },
  {
    path: "reports",
    loadChildren: () =>
      import("./modules/report-management/report-management.module").then(
        (m) => m.ReportManagementModule
      ),
    canActivate: [RouteGuardService],
  },
  {
    path: "inventory-management",
    loadChildren: () =>
      import("./modules/inventory-management/inventory-management.module").then(
        (m) => m.InventoryManagementModule
      ),
    canActivate: [RouteGuardService],
  },
  {
    path: 'master-configuration',
    loadChildren: () =>
      import("./modules/master-configuration/master-configuration.module").then(
        (m) => m.MasterConfigurationModule
      ),
    canActivate: [RouteGuardService],
  },
  {
    path: "monthly-expenses",
    loadChildren: () =>
      import("./modules/monthly-expenses/monthly-expenses.module").then(
        (m) => m.MonthlyExpensesModule
      ),
    canActivate: [RouteGuardService],
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
