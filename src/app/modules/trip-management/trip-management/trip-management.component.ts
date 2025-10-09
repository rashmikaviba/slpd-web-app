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
import { TripManagementPrintComponent } from "../trip-management-print/trip-management-print.component";
import { UpdateLocationFormComponent } from "../trip-management-by-driver/update-location-form/update-location-form.component";
import { ExpenseManagementComponent } from "../expense-management/expense-management.component";
import { ExpenseService } from "src/app/shared/services/api-services/expense.service";
import { DriverSalaryFormComponent } from "./driver-salary-form/driver-salary-form.component";
import { DestinationSummaryPrintComponent } from "./destination-summary-print/destination-summary-print.component";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";
import { TripSummaryComponent } from "../trip-summary/trip-summary.component";
import { TripSummaryService } from "src/app/shared/services/api-services/trip-summary.service";
import { PosService } from "src/app/shared/services/api-services/pos.service";
import { PosTransactionComponent } from "./pos-transaction/pos-transaction.component";
import { DownloadTripQrFormComponent } from "./download-trip-qr-form/download-trip-qr-form.component";

@Component({
  selector: "app-trip-management",
  templateUrl: "./trip-management.component.html",
  styleUrls: ["./trip-management.component.css"],
})
export class TripManagementComponent implements OnInit {
  FV = new CommonForm();
  cols: any;
  recodes: any;
  template: TemplateRef<any>;
  items: any[];
  filteredItems: any[];
  WellKnownTripStatus: any = WellKnownTripStatus;
  userRole: number = 0;
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
      label: "Started",
      value: 3,
    },
    {
      label: "Finished",
      value: 4,
    },
    {
      label: "Finalized Trips (Completed)",
      value: 5,
    }
  ];
  constructor(
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private popupService: PopupService,
    private router: Router,
    private tripManagementFlowService: TripManagementFlowService,
    private messageService: AppMessageService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private tripService: TripService,
    private expenseService: ExpenseService,
    private formBuilder: UntypedFormBuilder,
    private masterDataService: MasterDataService,
    private tripSummaryService: TripSummaryService,
    private posService: PosService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.userRole = this.masterDataService.Role;

    if (this.userRole == WellKnownUserRole.DRIVER) {
    } else {
    }
    this.cols = [
      { field: "tripConfirmedNumber", header: "Trip Number" },
      { field: "startDate", header: "Start Date" },
      { field: "endDate", header: "End Date" },
      // { field: "contact", header: "Contact Details" },
      { field: "requestedVehicle", header: "Requested Vehicle" },
      { field: "paymentMode", header: "Payment Mode" },
      { field: "isPaymentCollected", header: "Payment Collected" },
      { field: "status", header: "Status" },
      { field: "activeDriverName", header: "Driver Name" },
      { field: "activeRegistrationNumber", header: "Vehicle Name" },
    ];

    let thisMonthFirstDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    let lastDateOfNextMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 2,
      0
    );

    this.FV.setValue("dateRange", [thisMonthFirstDate, lastDateOfNextMonth]);
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
        label: "End Trip",
        icon: "pi pi-stop-circle",
        command: (event: any) => {
          this.onClickEndTrip(event.item.data);
        },
      },
      {
        id: 6,
        label: "Cancel Trip",
        icon: "pi pi-trash",
        command: (event: any) => {
          this.onCLickCancelTrip(event.item.data);
        },
      },
      {
        id: 7,
        label: "View Trip Info",
        icon: "pi pi-info-circle",
        command: (event: any) => {
          this.onClickViewTripReachInfo(event.item.data);
        },
      },
      {
        id: 8,
        label: "Expense Management",
        icon: "pi pi-money-bill",
        command: (event: any) => {
          this.onClickExpenseManagement(event.item.data);
        },
      },
      {
        id: 9,
        label: "Driver Salary",
        icon: "pi pi-briefcase",
        command: (event: any) => {
          this.onClickAddDriverSalary(event.item.data);
        },
      },
      {
        id: 10,
        label: "Trip Summary",
        icon: "pi pi-flag",
        command: (event: any) => {
          this.onClickTripSummary(event.item.data);
        },
      },
      {
        id: 11,
        label: "Trip destination Summary",
        icon: "pi pi-tags",
        command: (event: any) => {
          this.onClickDestinationSummary(event.item.data);
        },
      },
      {
        id: 12,
        label: "Pos Transaction",
        icon: "pi pi-calculator",
        command: (event: any) => {
          this.onClickPosTransaction(event.item.data);
        },
      },
      {
        id: 13,
        label: "Generate Trip QR",
        icon: "pi pi-qrcode",
        command: (event: any) => {
          this.onClickGenerateTripQR(event.item.data);
        },
      },
    ];
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      status: [-1, [Validators.required]],
      dateRange: [[], [Validators.required]],
    });
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [];

    const conditions = [
      { ids: [2], condition: true },
      {
        ids: [1, 3, 13],
        condition:
          rowData?.status === WellKnownTripStatus.START ||
          rowData?.status === WellKnownTripStatus.PENDING,
      },
      { ids: [4], condition: rowData?.isCheckListDone },
      { ids: [5], condition: rowData?.status === WellKnownTripStatus.START },
      { ids: [6], condition: rowData?.status === WellKnownTripStatus.PENDING },
      {
        ids: [8],
        condition:
          (rowData?.status === WellKnownTripStatus.PENDING &&
            rowData?.paidByCompanyCount > 0) ||
          rowData?.status === WellKnownTripStatus.START ||
          rowData?.status === WellKnownTripStatus.FINISHED,
      },
      {
        ids: [9],
        condition:
          rowData?.status === WellKnownTripStatus.FINISHED &&
          !rowData?.isMonthEndDone,
      },
      {
        ids: [7, 11, 10],
        condition:
          rowData?.status === WellKnownTripStatus.START ||
          rowData?.status === WellKnownTripStatus.FINISHED,
      },
      {
        ids: [12], condition: rowData?.status === WellKnownTripStatus.START ||
          rowData?.status === WellKnownTripStatus.FINISHED || rowData?.status === WellKnownTripStatus.PENDING,
      },
    ];

    conditions.forEach(({ ids, condition }) => {
      if (condition) {
        this.filteredItems = this.filteredItems.concat(
          this.items.filter((x) => ids.includes(x.id))
        );
      }
    });

    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }

  async loadInitialData() {
    try {
      let dateRange = this.FV.getValue("dateRange");
      let status = this.FV.getValue("status");

      let startDate = this.datePipe.transform(dateRange[0], "yyyy-MM-dd");
      let endDate = this.datePipe.transform(dateRange[1], "yyyy-MM-dd");

      if (!startDate || !endDate) return;

      const tripResponse = await firstValueFrom(
        this.tripService.GetAllTrips(status, startDate, endDate)
      );

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
      width: "60vw",
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
        width: "60vw",
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
        width: "60vw",
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

  exportToExcel() { }

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
      } else {
        this.messageService.showErrorAlert(checkListResult.Message);
        return;
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

  async onClickPrint(rowData: any) {
    try {
      const tripData = await firstValueFrom(
        this.tripService.GetTripForPrintByTripId(rowData?.id)
      );

      if (tripData.IsSuccessful) {
        let data = tripData.Result;

        this.tripManagementFlowService.clearData();

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

  onClickViewTripReachInfo(rowData: any) {
    let data = {
      tripInfo: rowData,
      isView: true,
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
        userType: "admin",
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

  async onClickAddDriverSalary(rowData: any) {
    try {
      let header = "Add Driver Salary";
      let width = "40vw";
      let data = {
        tripInformation: rowData,
        expensesInfo: null,
      };

      const expenseResult = await firstValueFrom(
        this.expenseService.GetAllExpensesByTrip(rowData?.id)
      );

      if (expenseResult.IsSuccessful) {
        data.expensesInfo = expenseResult.Result;
      }

      this.popupService
        .OpenModel(DriverSalaryFormComponent, { header, width, data })
        .subscribe((result) => {
          if (result) {
            this.loadInitialData();
          }
        });
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
        userType: "admin",
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

  async onClickDestinationSummary(rowData: any) {
    try {
      let properties = {
        width: "60vw",
        position: "right",
      };
      let data = {
        places: rowData?.places,
        tripConfirmedNumber: rowData?.tripConfirmedNumber,
      };

      const placesResult = await firstValueFrom(
        this.tripService.GetDestinationSummary(rowData?.id)
      );

      if (placesResult.IsSuccessful) {
        data.places = placesResult.Result;
      }

      this.sidebarService.addComponent(
        "", //Monthly Trip Report
        DestinationSummaryPrintComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  async onClickPosTransaction(rowData: any) {
    try {
      let properties = {
        width: "70vw",
        position: "right",
      };

      let data = {
        tripInfo: rowData,
      };

      this.sidebarService.addComponent(
        `POS Transaction - ${rowData?.tripConfirmedNumber} `,
        PosTransactionComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  onClickGenerateTripQR(rowData: any) {
    let data = {
      tripInfo: rowData,
    }

    this.popupService
      .OpenModel(DownloadTripQrFormComponent, { header: `Trip QR Code - (${rowData?.tripConfirmedNumber})`, width: '30vw', data })
      .subscribe((result) => {
      });
  }
}
