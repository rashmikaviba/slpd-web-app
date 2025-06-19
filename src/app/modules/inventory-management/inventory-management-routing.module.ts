import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutNewComponent } from 'src/app/layout/default-layout-new/default-layout-new.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { GoodReceivedNoteComponent } from './good-received-note/good-received-note.component';

const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutNewComponent,
    children: [
      {
        path: "product-management",
        component: ProductManagementComponent,
      },
      {
        path: "good-received-note",
        component: GoodReceivedNoteComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryManagementRoutingModule { }
