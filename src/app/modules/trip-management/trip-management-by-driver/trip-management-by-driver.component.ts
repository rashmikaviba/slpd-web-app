import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { AppComponent } from "src/app/app.component";
import { PopupService } from "src/app/shared/services/popup.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { AddUserControlFlowService } from "../../user/add-new-user/add-new-user-form/add-user-control-flow.service";
import { UserService } from "src/app/shared/services/api-services/user.service";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { TransactionHandlerService } from "src/app/shared/services/transaction-handler.service";
import { ExcelService } from "src/app/shared/services/excel.service";
import { DatePipe } from "@angular/common";
import { DriverTaskFormComponent } from "./driver-task-form/driver-task-form.component";
import { firstValueFrom } from "rxjs";
import { TripService } from "src/app/shared/services/api-services/trip.service";
import { WellKnownTripStatus } from "src/app/shared/enums/well-known-trip-status.enum";
import { UpdateLocationFormComponent } from "./update-location-form/update-location-form.component";
import { ExpenseManagementComponent } from "../expense-management/expense-management.component";
import { TripManagementPrintComponent } from "../trip-management-print/trip-management-print.component";

@Component({
  selector: "app-trip-management-by-driver",
  templateUrl: "./trip-management-by-driver.component.html",
  styleUrls: ["./trip-management-by-driver.component.css"],
})
export class TripManagementByDriverComponent implements OnInit {
  cols: any;
  recodes: any;
  loading: any;
  sidebarVisible2: boolean = false;
  template: TemplateRef<any>;
  items: any[];
  filteredItems: any[];
  WellKnownTripStatus = WellKnownTripStatus;
  constructor(
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private popupService: PopupService,
    private router: Router,
    private addUserControlFlowService: AddUserControlFlowService,
    private userService: UserService,
    private messageService: AppMessageService,
    private transactionService: TransactionHandlerService,
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
      // { field: "activeDriverName", header: "Driver Name" },
      { field: "activeRegistrationNumber", header: "Vehicle Name" },
    ];

    this.loadInitialData();

    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response && response.action == "refresh") {
        this.loadInitialData();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
      this.addUserControlFlowService.resetData();
    });

    this.items = [
      {
        id: 1,
        label: "Check List",
        icon: "pi pi-list-check",
        command: (event: any) => {
          this.onClickDriverTaskForm(event.item.data);
        },
      },
      {
        id: 2,
        label: "Start Trip",
        icon: "pi pi-arrow-circle-right",
        command: (event: any) => {
          this.onClickStartTrip(event.item.data);
        },
      },
      {
        id: 3,
        label: "Undo Start Trip",
        icon: "pi pi-refresh",
        command: (event: any) => {
          this.onClickUndoStartTrip(event.item.data);
        },
      },
      {
        id: 4,
        label: "Update Location",
        icon: "pi pi-map-marker",
        command: (event: any) => {
          this.onClickUpdateCurrentLocation(event.item.data);
        },
      },
      {
        id: 5,
        label: "Expense Management",
        icon: "pi pi-money-bill",
        command: (event: any) => {
          this.onClickExpenseManagement(event.item.data);
        },
      },
    ];
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    if (!rowData?.isActiveDriver) {
      this.messageService.showWarnAlert(
        `You are not allowed to change this trip because you are not the active driver for this trip.`
      );
      return;
    }

    this.filteredItems = [];

    if (
      !rowData.isCheckListDone &&
      rowData.status == WellKnownTripStatus.PENDING
    ) {
      let selectedItem = this.items.filter((x) => x.id == 1);
      this.filteredItems = this.filteredItems.concat(selectedItem);
    }

    if (
      rowData.isCheckListDone &&
      rowData.status == WellKnownTripStatus.PENDING
    ) {
      let selectedItem = this.items.filter((x) => x.id == 2);
      this.filteredItems = this.filteredItems.concat(selectedItem);
    }

    if (
      rowData.isCheckListDone &&
      rowData.status == WellKnownTripStatus.START
    ) {
      let selectedItem = this.items.filter((x) => x.id == 4 || x.id == 5);
      this.filteredItems = this.filteredItems.concat(selectedItem);

      if (rowData?.canUndo) {
        let selectedItem2 = this.items.filter((x) => x.id == 3);
        this.filteredItems = this.filteredItems.concat(selectedItem2);
      }
    }

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

  onClickStartTrip(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to start this trip?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.tripService
            .UpdateTripStatus(rowData?.id, WellKnownTripStatus.START)
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

  onClickUndoStartTrip(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to undo start this trip?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.tripService
            .UpdateTripStatus(rowData?.id, WellKnownTripStatus.PENDING)
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

  exportToExcel() {}

  onClickDriverTaskForm(rowData: any) {
    let data = {
      tripInfo: rowData,
      isView: false,
      checkListInfo: null,
    };

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
  }

  onClickUpdateCurrentLocation(rowData: any) {
    let data = {
      tripInfo: rowData,
      isView: false,
    };

    let properties = {
      width: "50vw",
      position: "right",
    };

    this.sidebarService.addComponent(
      "Update Current Location",
      UpdateLocationFormComponent,
      properties,
      data
    );
  }

  onClickExpenseManagement(rowData: any) {
    let data = {
      tripInfo: rowData,
      userType: "driver",
    };

    let properties = {
      width: "50vw",
      position: "right",
    };

    this.sidebarService.addComponent(
      "Expense Management",
      ExpenseManagementComponent,
      properties,
      data
    );
  }

  async onClickPrint(rowData: any) {
    try {
      const tripData = await firstValueFrom(
        this.tripService.GetTripForPrintByTripId(rowData?.id)
      );

      if (tripData.IsSuccessful) {
        let data = tripData.Result;

        let properties = {
          width: "50vw",
          position: "right",
        };

        this.sidebarService.addComponent(
          "Print",
          TripManagementPrintComponent,
          properties,
          data
        );
      } else {
        this.messageService.showErrorAlert(tripData.Message);
      }
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }
}
