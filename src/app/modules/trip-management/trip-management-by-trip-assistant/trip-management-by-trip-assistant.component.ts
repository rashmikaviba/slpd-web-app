import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { WellKnownTripStatus } from 'src/app/shared/enums/well-known-trip-status.enum';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { TripManagementFlowService } from '../trip-management/trip-management-form/trip-management-flow.service';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { DatePipe } from '@angular/common';
import { TripService } from 'src/app/shared/services/api-services/trip.service';
import { ExpenseService } from 'src/app/shared/services/api-services/expense.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { TripSummaryService } from 'src/app/shared/services/api-services/trip-summary.service';
import { PosService } from 'src/app/shared/services/api-services/pos.service';
import { WellKnownUserRole } from 'src/app/shared/enums/well-known-user-role.enum';
import { firstValueFrom } from 'rxjs';
import { TripManagementFormComponent } from '../trip-management/trip-management-form/trip-management-form.component';
import { TripManagementPrintComponent } from '../trip-management-print/trip-management-print.component';
import { DownloadTripQrFormComponent } from '../trip-management/download-trip-qr-form/download-trip-qr-form.component';

@Component({
  selector: 'app-trip-management-by-trip-assistant',
  templateUrl: './trip-management-by-trip-assistant.component.html',
  styleUrls: ['./trip-management-by-trip-assistant.component.css']
})
export class TripManagementByTripAssistantComponent implements OnInit {
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
        id: 6,
        label: "Cancel Trip",
        icon: "pi pi-trash",
        command: (event: any) => {
          this.onCLickCancelTrip(event.item.data);
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
        ids: [1, 13],
        condition:
          rowData?.status === WellKnownTripStatus.START ||
          rowData?.status === WellKnownTripStatus.PENDING,
      },
      { ids: [6], condition: rowData?.status === WellKnownTripStatus.PENDING }
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



  exportToExcel() { }


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
