import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MonthAditService } from "src/app/shared/services/api-services/month-adit.service";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { PopupService } from "src/app/shared/services/popup.service";
import { LeaveService } from "src/app/shared/services/api-services/leave.service";
import { LeaveConfirmationComponent } from "src/app/modules/leave-management/super-admin-leave-form/leave-confirmation/leave-confirmation.component";

@Component({
  selector: "app-pending-leave",
  templateUrl: "./pending-leave.component.html",
  styleUrls: ["./pending-leave.component.css"],
})
export class PendingLeaveComponent implements OnInit {
  cols: any[] = [];
  recodes: any[] = [];
  items: any[];
  filteredItems: any[];
  constructor(
    private messageService: AppMessageService,
    private monthAditService: MonthAditService,
    private popupService: PopupService,
    private leaveService: LeaveService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "createdAt", header: "Applied Date" },
      { field: "appliedUserName", header: "Applied By" },
      { field: "appliedUserRole", header: "User Type" },
      { field: "availableLeaveCount", header: "Available Leave Count" },
      { field: "dateCount", header: "Requested Leave Count" },
      { field: "startDate", header: "Requested Dates" },
      { field: "reason", header: "Reason" },
      { field: "status", header: "Status" },
    ];

    this.items = [
      {
        id: 1,
        label: "Approve Leave",
        icon: "pi pi-check",
        command: (event: any) => {
          this.onClickApproveRejectLeave(event.item.data, true);
        },
      },
      {
        id: 2,
        label: "Reject Leave",
        icon: "pi pi-times",
        command: (event: any) => {
          this.onClickApproveRejectLeave(event.item.data, false);
        },
      },
    ];

    this.getPendingLeaves();
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [];

    if (rowData.status == 1 && !rowData.isMonthEndDone) {
      this.filteredItems = this.items;
    } else if (rowData.status == 2 && !rowData.isMonthEndDone) {
      this.filteredItems = this.items.filter((x) => x.id != 1);
    } else if (rowData.status == 3 && !rowData.isMonthEndDone) {
      this.filteredItems = this.items.filter((x) => x.id != 2);
    }

    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }

  getPendingLeaves() {
    this.monthAditService.GetMonthAditLeaveData().subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      }
    });
  }

  async onClickApproveRejectLeave(rowData: any, isApproved: boolean = false) {
    try {
      let header = isApproved ? "Approve Leave" : "Reject Leave";
      let width = "40vw";
      let data = {
        leaveData: rowData,
        isApproved: isApproved,
      };

      const leaveInfoResult = await firstValueFrom(
        this.leaveService.GetLeaveById(rowData?._id)
      );

      if (leaveInfoResult.IsSuccessful) {
        data.leaveData = leaveInfoResult.Result;
      }

      this.popupService
        .OpenModel(LeaveConfirmationComponent, { header, width, data })
        .subscribe((result) => {
          if (result) {
            this.getPendingLeaves();
          }
        });
    } catch (error: any) {
      this.messageService.showErrorAlert(error);
    }
  }
}
