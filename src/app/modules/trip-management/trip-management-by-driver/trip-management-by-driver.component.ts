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
import { ExpenseService } from "src/app/shared/services/api-services/expense.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { TripSummaryComponent } from "../trip-summary/trip-summary.component";
import { TripSummaryService } from "src/app/shared/services/api-services/trip-summary.service";
import { TripIdentifierComponent } from "./trip-identifier/trip-identifier.component";

@Component({
  selector: "app-trip-management-by-driver",
  templateUrl: "./trip-management-by-driver.component.html",
  styleUrls: ["./trip-management-by-driver.component.css"],
})
export class TripManagementByDriverComponent implements OnInit {
  FV = new CommonForm();
  cols: any;
  recodes: any;
  loading: any;
  sidebarVisible2: boolean = false;
  template: TemplateRef<any>;
  items: any[];
  filteredItems: any[];
  WellKnownTripStatus = WellKnownTripStatus;

  status: any[] = [
    {
      label: "All",
      value: -1,
    },
    {
      label: "Pending",
      value: 1,
    },
    {
      label: "Start",
      value: 3,
    },
    {
      label: "Finished",
      value: 4,
    },
  ];
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
    private tripService: TripService,
    private expenseService: ExpenseService,
    private formBuilder: UntypedFormBuilder,
    private tripSummaryService: TripSummaryService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.cols = [
      { field: "tripConfirmedNumber", header: "Trip Number" },
      { field: "startDate", header: "Start Date" },
      { field: "endDate", header: "End Date" },
      { field: "contact", header: "Contact Details" },
      // { field: "paymentMode", header: "Payment Mode" },
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
      {
        id: 6,
        label: "Trip Summary",
        icon: "pi pi-flag",
        command: (event: any) => {
          this.onClickTripSummary(event.item.data);
        },
      },
    ];
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      status: [-1, [Validators.required]],
    });
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
      let selectedItem = this.items.filter((x) => x.id == 4 || x.id == 6);
      this.filteredItems = this.filteredItems.concat(selectedItem);

      if (rowData?.canUndo) {
        let selectedItem2 = this.items.filter((x) => x.id == 3);
        this.filteredItems = this.filteredItems.concat(selectedItem2);
      }
    }
    if (
      rowData.isCheckListDone &&
      (rowData.status == WellKnownTripStatus.START ||
        rowData.status == WellKnownTripStatus.FINISHED)
    ) {
      let selectedItem = this.items.filter((x) => x.id == 5);
      this.filteredItems = this.filteredItems.concat(selectedItem);
    }

    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }

  async loadInitialData() {
    try {
      let status = this.FV.getValue("status");
      const tripResponse = await firstValueFrom(
        this.tripService.GetAllTrips(status)
      );

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

  exportToExcel() { }

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

  async onClickExpenseManagement(rowData: any) {
    try {
      let data = {
        tripInfo: rowData,
        userType: "driver",
        expensesInfo: null,
      };

      const expenseResult = await firstValueFrom(
        this.expenseService.GetAllExpensesByTrip(rowData?.id)
      );

      if (expenseResult.IsSuccessful) {
        data.expensesInfo = expenseResult.Result;
      }

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
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
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

  async onClickTripSummary(rowData: any) {
    try {
      let properties = {
        width: "75vw",
        position: "right",
      };
      let data = {
        summaryData: null,
        tripInfo: rowData,
        userType: "driver",
      };

      const tripSummaryResult = await firstValueFrom(
        this.tripSummaryService.GetAllByTrip(rowData?.id)
      );

      if (tripSummaryResult.IsSuccessful) {
        data.summaryData = tripSummaryResult.Result.tripSummaries;
        data.tripInfo = tripSummaryResult.Result.trip;
      }

      this.sidebarService.addComponent(
        "Trip Summary",
        TripSummaryComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  openTripIdentifierModel() {
    this.popupService.OpenModel(
      TripIdentifierComponent,
      {
        width: '40vw',
        header: 'Trip Identifier',
        data: null
      }
    ).subscribe((result) => {
      if (result) {
      }
    });
  }
}
