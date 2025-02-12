import { Injectable } from "@angular/core";
import { ResourceService } from "../resource.service";
import { DataAccessService } from "../data-access.service";
import { WebSocketService } from "../socket-services/web-socket.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ExpenseExtensionService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService,
    private socketService: WebSocketService
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

  onNewExpenseRequest(): Observable<any> {
    return this.socketService.listen("new-expense-request", true);
  }

  onApproveExpenseRequest(): Observable<any> {
    return this.socketService.listen("expense-request-approved");
  }

  onRejectExpenseRequest(): Observable<any> {
    return this.socketService.listen("expense-request-rejected");
  }
}
