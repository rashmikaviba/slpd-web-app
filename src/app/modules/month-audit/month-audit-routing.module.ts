import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MonthAuditComponent } from "./month-audit/month-audit.component";
import { DefaultLayoutNewComponent } from "src/app/layout/default-layout-new/default-layout-new.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutNewComponent,
    children: [
      {
        path: "",
        component: MonthAuditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthAuditRoutingModule {}
