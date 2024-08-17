import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-pending-leave",
  templateUrl: "./pending-leave.component.html",
  styleUrls: ["./pending-leave.component.css"],
})
export class PendingLeaveComponent implements OnInit {
  cols: any[] = [];
  recodes: any[] = [];
  constructor() {}

  ngOnInit() {
    this.cols = [
      { field: "userName", header: "Employee Name" },
      { field: "startDate", header: "Start Date" },
      { field: "endDate", header: "End Date" },
      { field: "leaveCount", header: "Leave Count" },
      { field: "reason", header: "Reason" },
      { field: "status", header: "Status" },
    ];
  }
}
