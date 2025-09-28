import { CompanyInformation } from "src/app/shared/data/companyInformation";
import { PopupService } from "../../../shared/services/popup.service";
import { SidebarService } from "../../../shared/services/sidebar.service";
import { Component, OnInit } from "@angular/core";
import { AddTripSummaryFormComponent } from "./add-trip-summary-form/add-trip-summary-form.component";
import { TripSummaryService } from "src/app/shared/services/api-services/trip-summary.service";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { firstValueFrom } from "rxjs";
import { WellKnownTripStatus } from "src/app/shared/enums/well-known-trip-status.enum";
import { MasterDataService } from "src/app/shared/services/master-data.service";

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
  userType: string = "";
  companyInformation: any = CompanyInformation;
  constructor(
    private sidebarService: SidebarService,
    private popupService: PopupService,
    private tripSummaryService: TripSummaryService,
    private messageService: AppMessageService,
    private masterDataService: MasterDataService
  ) { }

  ngOnInit() {
    let sidebarData = this.sidebarService.getData();
    this.tripInfo = sidebarData.tripInfo;
    this.recodes = sidebarData.summaryData;
    this.userType = sidebarData.userType;

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

    if (this.tripInfo.isMonthEndDone) {
      this.isAllowToAddTripSummary = false;
    } else if (this.userType == "admin") {
      this.isAllowToAddTripSummary = true;
    } else if (
      this.userType == "driver" &&
      this.tripInfo.status != WellKnownTripStatus.FINISHED
    ) {
      this.isAllowToAddTripSummary = true;
    }
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
      .subscribe((result) => {
        if (result) {
          this.loadTripSummary();
        }
      });
  }

  loadTripSummary() {
    this.tripSummaryService
      .GetAllByTrip(this.tripInfo?.id)
      .subscribe((response) => {
        if (response.IsSuccessful) {
          this.recodes = response.Result.tripSummaries;
          this.tripInfo = response.Result.trip;
        }
      });
  }

  async onEditTripSummary(rowData: any) {
    try {
      const tripSummaryResult = await firstValueFrom(
        this.tripSummaryService.GetById(rowData._id)
      );

      let data = {
        isAdd: false,
        isEdit: true,
        tripInfo: this.tripInfo,
        tripSummaryData: null,
      };
      if (tripSummaryResult.IsSuccessful) {
        data.tripSummaryData = tripSummaryResult.Result;
      }

      this.popupService
        .OpenModel(AddTripSummaryFormComponent, {
          header: "Edit Trip Summary",
          width: "40vw",
          data,
        })
        .subscribe((result) => {
          if (result) {
            this.loadTripSummary();
          }
        });
    } catch (error) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }

  onDeleteTripSummary(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to delete this trip summary?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.tripSummaryService
            .DeleteTripSummaryById(rowData._id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.loadTripSummary();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }
}
