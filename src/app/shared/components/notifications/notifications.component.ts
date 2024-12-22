import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { selectNotifications } from "src/app/store/selector/notification.selector";
import { PopupService } from "../../services/popup.service";
import { ExpenseRequestActionFormComponent } from "src/app/modules/trip-management/expense-management/expense-request-action-form/expense-request-action-form.component";
import { AppMessageService } from "../../services/app-message.service";
import { firstValueFrom, interval, Subscription } from "rxjs";
import { ExpenseExtensionService } from "../../services/api-services/expense-extension.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent {
  notifications: any[] = [];
  private timerSubscription!: Subscription;

  constructor(
    private store: Store<AppState>,
    private popupService: PopupService,
    private messageService: AppMessageService,
    private expenseRequestService: ExpenseExtensionService
  ) {}

  ngOnInit(): void {
    this.store.select(selectNotifications).subscribe((notifications: any) => {
      this.notifications = notifications;
    });

    this.timerSubscription = interval(20000).subscribe(() => {
      this.notifications = [...this.notifications];
    });
  }

  async onClickExpenseExtension(rowData: any) {
    try {
      let header = "Expense Request (Approve/Reject)";
      let width = "35vw";
      let data = {
        expenseReqData: null,
      };

      const expenseReqResult = await firstValueFrom(
        this.expenseRequestService.getExpenseRequestById(rowData?._id)
      );

      if (expenseReqResult.IsSuccessful) {
        data.expenseReqData = expenseReqResult.Result;
      }

      this.popupService
        .OpenModel(ExpenseRequestActionFormComponent, { header, width, data })
        .subscribe((result) => {});
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  ngOnDestroy() {
    // Unsubscribe from the timer to avoid memory leaks
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
