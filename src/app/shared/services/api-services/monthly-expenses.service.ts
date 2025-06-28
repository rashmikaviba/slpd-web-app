import { Injectable } from '@angular/core';
import { ResourceService } from '../resource.service';
import { DataAccessService } from '../data-access.service';

@Injectable({
  providedIn: 'root'
})
export class MonthlyExpensesService {

  constructor(private dataAccess: DataAccessService,
    private resource: ResourceService) { }

  SaveMonthlyExpenses(body: any, headerId: string) {
    return this.dataAccess
      .POST(this.resource.monthlyExpenses.save + `/${headerId}`, body)
      .pipe((response) => {
        return response;
      });
  }

  AdvanceSearchMonthlyExpenses(body: any) {
    return this.dataAccess
      .POST(this.resource.monthlyExpenses.advanceSearch, body)
      .pipe((response) => {
        return response;
      });
  }

  UpdateMonthlyExpenses(headerId: string, expenseId: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.monthlyExpenses.update + `/${headerId}/expense/${expenseId}`, body)
      .pipe((response) => {
        return response;
      });
  }


  DeleteMonthlyExpenses(headerId: string, expenseId: string) {
    return this.dataAccess
      .DELETE(this.resource.monthlyExpenses.deleteById + `/${headerId}/expense/${expenseId}`)
      .pipe((response) => {
        return response;
      });
  }

  GetMonthlyExpensesById(headerId: string) {
    return this.dataAccess
      .GET(this.resource.monthlyExpenses.getById + `/${headerId}`)
      .pipe((response) => {
        return response;
      });
  }
}
