import { Injectable } from "@angular/core";
import { ResourceService } from "../resource.service";
import { DataAccessService } from "../data-access.service";

@Injectable({
  providedIn: "root",
})
export class ExpenseExtensionService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  saveExpenseRequest(body: any) {
    return this.dataAccess
      .POST(this.resource.expenseRequest.save, body)
      .pipe((response) => {
        return response;
      });
  }

  approveExpenseRequest(extensionId: string, body: any) {
    return this.dataAccess
      .PUT(
        this.resource.expenseRequest.approveExpense + `/${extensionId}`,
        body
      )
      .pipe((response) => {
        return response;
      });
  }

  rejectExpenseRequest(extensionId: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.expenseRequest.rejectExpense + `/${extensionId}`, body)
      .pipe((response) => {
        return response;
      });
  }

  getExpenseRequestById(extensionId: string) {
    return this.dataAccess
      .GET(
        this.resource.expenseRequest.getExpenseExtensionById + `/${extensionId}`
      )
      .pipe((response) => {
        return response;
      });
  }
}
