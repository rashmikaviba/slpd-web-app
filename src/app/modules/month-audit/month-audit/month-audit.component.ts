import { Component, OnInit, ViewChild } from "@angular/core";
import { PendingLeaveComponent } from "./pending-leave/pending-leave.component";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { PendingTripComponent } from "./pending-trip/pending-trip.component";

@Component({
  selector: "app-month-audit",
  templateUrl: "./month-audit.component.html",
  styleUrls: ["./month-audit.component.css"],
})
export class MonthAuditComponent implements OnInit {
  tabNavItems: any[];
  active: number = 1;
  @ViewChild(PendingLeaveComponent)
  private pendingLeaveComponent!: PendingLeaveComponent;
  @ViewChild(PendingTripComponent)
  private PendingTripComponent!: PendingTripComponent;
  constructor(private massageService: AppMessageService) {}

  ngOnInit() {
    this.tabNavItems = [
      {
        label: "Pending Leaves",
        index: 1,
      },
      {
        label: "Pending Trips",
        index: 2,
      },
      {
        label: "Create New Month",
        index: 3,
      },
    ];
  }

  changeIndex(currIndex: number) {
    switch (currIndex) {
      case 1:
        this.active = currIndex;
        break;
      case 2:
        let recodes = this.pendingLeaveComponent.recodes;

        if (recodes && recodes.length > 0) {
          this.massageService.showInfoAlert(
            "Complete all pending leaves before move to pending trips!"
          );
          return;
        } else {
          this.active = currIndex;
        }
        break;
      case 3:
        let tripRecodes = this.PendingTripComponent.recodes;

        if (tripRecodes && tripRecodes.length > 0) {
          this.massageService.showInfoAlert(
            "Complete all pending action for trips before move to create new month!"
          );
          return;
        } else {
          this.active = currIndex;
        }
        break;
      default:
        break;
    }
  }

  changeBackwardIndex(currIndex: number) {
    this.active = currIndex;
  }
}
