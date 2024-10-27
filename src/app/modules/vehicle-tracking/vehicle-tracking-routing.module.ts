import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LiveMapViewComponent } from "./live-map-view/live-map-view.component";
import { DefaultLayoutNewComponent } from "src/app/layout/default-layout-new/default-layout-new.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutNewComponent,
    children: [
      {
        path: "",
        component: LiveMapViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleTrackingRoutingModule {}
