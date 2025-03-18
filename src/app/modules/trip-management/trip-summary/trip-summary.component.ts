import { PopupService } from "./../../../shared/services/popup.service";
import { SidebarService } from "./../../../shared/services/sidebar.service";
import { Component, OnInit } from "@angular/core";
import { AddTripSummaryFormComponent } from "./add-trip-summary-form/add-trip-summary-form.component";

@Component({
  selector: "app-trip-summary",
  templateUrl: "./trip-summary.component.html",
  styleUrls: ["./trip-summary.component.css"],
})
export class TripSummaryComponent implements OnInit {
  cols: any[] = [];
  recodes: any[] = [];
  isAllowToAddTripSummary: boolean = true;
  tripInfo: any;
  constructor(
    private sidebarService: SidebarService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    let sidebarData = this.sidebarService.getData();
    this.tripInfo = sidebarData.tripInfo;

    this.cols = [
      { field: "date", header: "Date" },
      { field: "startTime", header: "Start Time" },
      { field: "endTime", header: "End Time" },
      { field: "startingKm", header: "Starting KM" },
      { field: "endingKm", header: "Ending KM" },
      { field: "totalKm", header: "Total KM" },
      { field: "fuel", header: "Fuel" },
      { field: "description", header: "Description" },
    ];
  }

  onClickAddNew() {
    let data = {
      isAdd: true,
      isEdit: false,
      tripInfo: this.tripInfo,
    };

    this.popupService
      .OpenModel(AddTripSummaryFormComponent, {
        header: "Add Trip Summary",
        width: "40vw",
        data,
      })
      .subscribe((result) => {});
  }
}
