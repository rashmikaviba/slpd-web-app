import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutNewComponent } from 'src/app/layout/default-layout-new/default-layout-new.component';
import { MonthlyExpensesComponent } from './monthly-expenses/monthly-expenses.component';

const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutNewComponent,
    children: [
      {
        path: "",
        component: MonthlyExpensesComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyExpensesRoutingModule { }
