import { InternalTripService } from "./../../../../shared/services/api-services/internal-trip.service";
import { SidebarService } from "./../../../../shared/services/sidebar.service";
import { Component, OnInit } from "@angular/core";
import { ExcelService } from "src/app/shared/services/excel.service";
import { PopupService } from "src/app/shared/services/popup.service";
import { AddOtherTripComponent } from "./add-other-trip/add-other-trip.component";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-other-trips",
  templateUrl: "./other-trips.component.html",
  styleUrls: ["./other-trips.component.css"],
})
export class OtherTripsComponent implements OnInit {
  cols: any[] = [];
  recodes: any[] = [];
  vehicle: any = null;
  isChanged: boolean = false;

  constructor(
    private popUpService: PopupService,
    private excelService: ExcelService,
    private sidebarService: SidebarService,
    private internalTripService: InternalTripService,
    private messageService: AppMessageService
  ) {}

  ngOnInit() {
    let sideBarData = this.sidebarService.getData();
    this.vehicle = sideBarData.vehicle;

    this.cols = [
      { field: "startDate", header: "Start Date" },
      { field: "endDate", header: "End Date" },
      { field: "driver", header: "Driver" },
      { field: "reason", header: "Reason" },
      { field: "createdByUser", header: "Created By" },
      { field: "createdAt", header: "Created At" },
    ];

    this.loadInternalTrips();
  }

  loadInternalTrips() {
    this.internalTripService
      .GetInternalTripByVehicle(this.vehicle._id)
      .subscribe((response) => {
        if (response.IsSuccessful) {
          this.recodes = response.Result;
        }
      });
  }

  async AddOtherTips(rowData: any, isEdit: boolean, isView: boolean = false) {
    try {
      let data = {
        tripDetails: null,
        isEdit: isEdit,
        isView: isView,
      };

      if (isEdit || isView) {
        const internalTripResult = await firstValueFrom(
          this.internalTripService.GetInternalTripById(rowData?._id)
        );

        if (internalTripResult?.IsSuccessful) {
          data.tripDetails = internalTripResult.Result;
        }
      } else {
        data.tripDetails = {
          vehicle: this.vehicle._id,
        };
      }

      let header = "";

      if (isView) {
        header = "VIEW OTHER TRIP";
      } else if (isEdit) {
        header = "EDIT OTHER TRIP";
      } else {
        header = "ADD OTHER TRIP";
      }

      this.popUpService
        .OpenModel(AddOtherTripComponent, {
          data: data,
          header: header,
          width: "50vw",
        })
        .subscribe((res) => {
          if (res) {
            this.isChanged = true;
            this.loadInternalTrips();
          }
        });
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  onClickDelete(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to delete this internal trip?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.internalTripService
            .DeleteInternalTripById(rowData?._id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.isChanged = true;
                this.messageService.showSuccessAlert(response.Message);
                this.loadInternalTrips();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sidebarService.sidebarEvent.emit(this.isChanged);
  }
}
