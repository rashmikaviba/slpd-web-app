import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-month-audit",
  templateUrl: "./month-audit.component.html",
  styleUrls: ["./month-audit.component.css"],
})
export class MonthAuditComponent implements OnInit {
  tabNavItems: any[];
  active: number = 1;
  constructor() {}

  ngOnInit() {
    this.tabNavItems = [
      {
        label: "Pending Leaves",
        index: 1,
      },
      {
        label: "Create New Month",
        index: 2,
      },
    ];
  }

  changeIndex(currIndex: number) {
    this.active = currIndex;
  }

  changeBackwardIndex(currIndex: number) {}
}
