import { Component, OnInit, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { TripManagementFlowService } from '../trip-management/trip-management-form/trip-management-flow.service';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { DatePipe } from '@angular/common';
import { TripService } from 'src/app/shared/services/api-services/trip.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { WellKnownUserRole } from 'src/app/shared/enums/well-known-user-role.enum';
import { WellKnownTripStatus } from 'src/app/shared/enums/well-known-trip-status.enum';
import { firstValueFrom } from 'rxjs';
import { TripManagementFormComponent } from '../trip-management/trip-management-form/trip-management-form.component';
import { TripManagementPrintComponent } from '../trip-management-print/trip-management-print.component';
import { DownloadTripQrFormComponent } from '../trip-management/download-trip-qr-form/download-trip-qr-form.component';
import { DriverTaskFormComponent } from '../trip-management-by-driver/driver-task-form/driver-task-form.component';

@Component({
  selector: 'app-trip-management-by-driver-assistant',
  templateUrl: './trip-management-by-driver-assistant.component.html',
  styleUrls: ['./trip-management-by-driver-assistant.component.css']
})
export class TripManagementByDriverAssistantComponent implements OnInit {
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
    private formBuilder: UntypedFormBuilder,
    private masterDataService: MasterDataService,
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
        id: 2,
        label: "View Trip",
        icon: "pi pi-eye",
        command: (event: any) => {
          this.onClickView(event.item.data);
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
        ids: [13],
        condition:
          rowData?.status === WellKnownTripStatus.START ||
          rowData?.status === WellKnownTripStatus.PENDING,
      },
      { ids: [4], condition: rowData?.isCheckListDone },
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



  onClickGenerateTripQR(rowData: any) {
    let data = {
      tripInfo: rowData,
    }

    this.popupService
      .OpenModel(DownloadTripQrFormComponent, { header: `Trip QR Code - (${rowData?.tripConfirmedNumber})`, width: '30vw', data })
      .subscribe((result) => {
      });
  }

  exportToExcel() { }
}
