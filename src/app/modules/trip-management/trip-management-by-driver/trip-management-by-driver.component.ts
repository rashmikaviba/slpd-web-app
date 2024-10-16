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
    ];
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    debugger;
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
      userData: null,
      isEdit: false,
    };

    this.addUserControlFlowService.resetData();

    let properties = {
      width: "50vw",
      position: "right",
    };
  }

  async onClickStartTrip(rowData: any) {
    let data = {
      userData: null,
      isEdit: true,
    };

    let properties = {
      width: "50vw",
      position: "right",
    };
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
}
