import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { VehicleTrackingRoutingModule } from "./vehicle-tracking-routing.module";
import { LiveMapViewComponent } from "./live-map-view/live-map-view.component";

@NgModule({
  declarations: [LiveMapViewComponent],
  imports: [CommonModule, VehicleTrackingRoutingModule],
})
export class VehicleTrackingModule {}
