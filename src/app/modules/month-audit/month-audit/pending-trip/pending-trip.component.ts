import { firstValueFrom } from "rxjs";
import { MonthAditService } from "./../../../../shared/services/api-services/month-adit.service";
import { Component, OnInit } from "@angular/core";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { WellKnownTripStatus } from "src/app/shared/enums/well-known-trip-status.enum";
import { TripService } from "src/app/shared/services/api-services/trip.service";

@Component({
  selector: "app-pending-trip",
  templateUrl: "./pending-trip.component.html",
  styleUrls: ["./pending-trip.component.css"],
})
export class PendingTripComponent implements OnInit {
  cols: any;
  recodes: any;
  filteredItems: any[] = [];
  items: any[] = [];
  constructor(
    private monthAditService: MonthAditService,
    private messageService: AppMessageService,
    private tripService: TripService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "tripConfirmedNumber", header: "Trip Number" },
      { field: "startDate", header: "Start Date" },
      { field: "endDate", header: "End Date" },
      { field: "contact", header: "Contact Details" },
      { field: "status", header: "Status" },
      { field: "activeDriverName", header: "Driver Name" },
      { field: "activeRegistrationNumber", header: "Vehicle Name" },
    ];

    this.items = [
      {
        id: 1,
        label: "End Trip",
        icon: "pi pi-stop-circle",
        command: (event: any) => {
          this.onClickEndTrip(event.item.data);
        },
      },
      {
        id: 2,
        label: "Cancel Trip",
        icon: "pi pi-trash",
        command: (event: any) => {
          this.onCLickCancelTrip(event.item.data);
        },
      },
    ];

    this.loadInitialData();
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [];

    if (rowData?.status === WellKnownTripStatus.PENDING) {
      let selectedItem = this.items.filter((x) => x.id == 2);
      this.filteredItems = this.filteredItems.concat(selectedItem);
    }

    if (rowData?.status === WellKnownTripStatus.START) {
      let selectedItem = this.items.filter((x) => x.id == 1);
      this.filteredItems = this.filteredItems.concat(selectedItem);
    }

    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }

  async loadInitialData() {
    try {
      const tripResponse = await firstValueFrom(
        this.monthAditService.GetPendingTrips()
      );

      if (tripResponse?.IsSuccessful) {
        this.recodes = tripResponse?.Result;
      }
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  onClickEndTrip(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to end this trip?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.tripService
            .UpdateTripStatus(rowData?.id, WellKnownTripStatus.FINISHED)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.loadInitialData();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  onCLickCancelTrip(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to cancel this trip?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.tripService.CancelTrip(rowData?.id).subscribe((response) => {
            if (response.IsSuccessful) {
              this.messageService.showSuccessAlert(response.Message);
              this.loadInitialData();
            } else {
              this.messageService.showErrorAlert(response.Message);
            }
          });
        }
      }
    );
  }
}
