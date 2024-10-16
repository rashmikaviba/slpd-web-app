import { TripService } from "src/app/shared/services/api-services/trip.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { AppComponent } from "src/app/app.component";
import { PopupService } from "src/app/shared/services/popup.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { ExcelService } from "src/app/shared/services/excel.service";
import { DatePipe } from "@angular/common";
import { TripManagementFormComponent } from "./trip-management-form/trip-management-form.component";
import { AddDriverAndVehicleFormComponent } from "./add-driver-and-vehicle-form/add-driver-and-vehicle-form.component";
import { firstValueFrom } from "rxjs";
import { WellKnownTripStatus } from "src/app/shared/enums/well-known-trip-status.enum";
import { TripManagementFlowService } from "./trip-management-form/trip-management-flow.service";
import { DriverTaskFormComponent } from "../trip-management-by-driver/driver-task-form/driver-task-form.component";

@Component({
  selector: "app-trip-management",
  templateUrl: "./trip-management.component.html",
  styleUrls: ["./trip-management.component.css"],
})
export class TripManagementComponent implements OnInit {
  cols: any;
  recodes: any;
  template: TemplateRef<any>;
  items: any[];
  filteredItems: any[];
  WellKnownTripStatus: any = WellKnownTripStatus;
  constructor(
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private popupService: PopupService,
    private router: Router,
    private tripManagementFlowService: TripManagementFlowService,
    private messageService: AppMessageService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "tripConfirmedNumber", header: "Trip Number" },
      { field: "startDate", header: "Start Date" },
      { field: "endDate", header: "End Date" },
      { field: "contact", header: "Contact Details" },
      // { field: "contactPerson", header: "Contact Person" },
      { field: "status", header: "Status" },
      { field: "activeDriverName", header: "Driver Name" },
      { field: "activeRegistrationNumber", header: "Vehicle Name" },
    ];

    this.loadInitialData();

    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response && response.action === "refresh") {
        this.loadInitialData();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
      this.tripManagementFlowService.clearData();
    });

    this.items = [
      {
        id: 1,
        label: "Edit Trip",
        icon: "pi pi-pencil",
        command: (event: any) => {
          this.onClickEdit(event.item.data);
        },
      },
      {
        id: 2,
        label: "View Trip",
        icon: "pi pi-eye",
        command: (event: any) => {
          this.onClickView(event.item.data);
        },
      },
      {
        id: 3,
        label: "Edit Info",
        icon: "pi pi-plus-circle",
        command: (event: any) => {
          this.onClickAssignDriverAndVehicle(event.item.data);
        },
      },
      {
        id: 4,
        label: "Check List",
        icon: "pi pi-list-check",
        command: (event: any) => {
          this.onClickVIewCheckList(event.item.data);
        },
      },
      {
        id: 5,
        label: "Cancel Trip",
        icon: "pi pi-trash",
        command: (event: any) => {
          this.onCLickCancelTrip(event.item.data);
        },
      },
    ];
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [];

    this.filteredItems = this.items;

    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }

  async loadInitialData() {
    try {
      const tripResponse = await firstValueFrom(this.tripService.GetAllTrips());

      if (tripResponse?.IsSuccessful) {
        this.recodes = tripResponse?.Result;
      }
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  onClickAddNew() {
    let data = {
      tripData: null,
      isEdit: false,
      isView: false,
    };

    this.tripManagementFlowService.clearData();

    let properties = {
      width: "50vw",
      position: "right",
    };

    this.sidebarService.addComponent(
      "Add New Trip",
      TripManagementFormComponent,
      properties,
      data
    );
  }

  async onClickView(rowData: any) {
    try {
      let data = {
        tripData: null,
        tripId: rowData?.id,
        isEdit: false,
        isView: true,
      };

      this.tripManagementFlowService.clearData();

      const tripResponse = await firstValueFrom(
        this.tripService.GetTripById(rowData?.id)
      );

      if (tripResponse?.IsSuccessful) {
        data.tripData = tripResponse?.Result;
      }

      let properties = {
        width: "50vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "View Trip",
        TripManagementFormComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  async onClickEdit(rowData: any) {
    try {
      let data = {
        tripData: null,
        tripId: rowData?.id,
        isEdit: true,
        isView: false,
      };

      this.tripManagementFlowService.clearData();

      const tripResponse = await firstValueFrom(
        this.tripService.GetTripById(rowData?.id)
      );

      if (tripResponse?.IsSuccessful) {
        data.tripData = tripResponse?.Result;
      }

      let properties = {
        width: "50vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "Edit Trip",
        TripManagementFormComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
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

  exportToExcel() {}

  onClickAssignDriverAndVehicle(rowData: any) {
    let header = "Additional Information";
    let width = "40vw";
    let data = {
      tripInformation: rowData,
    };

    this.popupService
      .OpenModel(AddDriverAndVehicleFormComponent, { header, width, data })
      .subscribe((result) => {
        if (result) {
          this.loadInitialData();
        }
      });
  }

  async onClickVIewCheckList(rowData: any) {
    try {
      let data = {
        tripInfo: rowData,
        isView: true,
        checkListInfo: null,
      };

      const checkListResult = await firstValueFrom(
        this.tripService.GetCheckList(rowData?.id)
      );

      if (checkListResult.IsSuccessful) {
        data.checkListInfo = checkListResult.Result;
      }

      let properties = {
        width: "50vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "Task Form",
        DriverTaskFormComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }
}
