import { Component, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { AppComponent } from "src/app/app.component";
import { PopupService } from "src/app/shared/services/popup.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { UserService } from "src/app/shared/services/api-services/user.service";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { TransactionHandlerService } from "src/app/shared/services/transaction-handler.service";
import { ExcelService } from "src/app/shared/services/excel.service";
import { DatePipe } from "@angular/common";
import { AddNewVehicleComponent } from "./add-new-vehicle/add-new-vehicle.component";
import { VehicleService } from "src/app/shared/services/api-services/vehicle.service";
import { firstValueFrom } from "rxjs";
import { OtherTripsComponent } from "./other-trips/other-trips.component";

@Component({
  selector: "app-vehicle-management",
  templateUrl: "./vehicle-management.component.html",
  styleUrls: ["./vehicle-management.component.scss"],
})
export class VehicleManagementComponent {
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
    private messageService: AppMessageService,
    private transactionService: TransactionHandlerService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "registrationNumber", header: "Registration Number" },
      { field: "vehicleOwner", header: "Owner Name" },
      { field: "vehicleTypeName", header: "Vehicle Type" },
      { field: "capacity", header: "Capacity" },
      { field: "availableSeats", header: "Available Seats" },
      { field: "gpsTracker", header: "GPS Tracker" },
      { field: "currentMileage", header: "Current Mileage" },
      { field: "status", header: "Status" },
    ];

    this.getVehicleData();

    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response) {
        this.getVehicleData();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
    });

    this.items = [
      {
        id: 1,
        label: "Edit Vehicle",
        icon: "pi pi-pencil",
        command: (event: any) => {
          this.onClickEdit(event.item.data);
        },
      },
      {
        id: 2,
        label: "Delete Vehicle",
        icon: "pi pi-trash",
        command: (event: any) => {
          this.onClickDelete(event.item.data);
        },
      },
      {
        id: 3,
        label: "Internal Trips",
        icon: "pi pi-sitemap",
        command: (event: any) => {
          this.onClickOtherVehicles(event.item.data);
        },
      },
    ];
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [...this.items];
    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }

  getVehicleData() {
    this.vehicleService.GetAllVehicles(true).subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      }
    });
  }

  onClickAddNew() {
    let data = {
      vehicleData: null,
      isEdit: false,
    };

    let properties = {
      width: "50vw",
      position: "right",
    };

    this.sidebarService.addComponent(
      "Add New Vehicle",
      AddNewVehicleComponent,
      properties,
      data
    );
  }

  async onClickEdit(rowData: any) {
    let data = {
      vehicleData: rowData,
      isEdit: true,
    };

    const vehicleResult = await firstValueFrom(
      this.vehicleService.GetVehicleById(rowData?._id)
    );

    if (vehicleResult.IsSuccessful) {
      data.vehicleData = vehicleResult.Result;
    }

    let properties = {
      width: "50vw",
      position: "right",
    };

    this.sidebarService.addComponent(
      "Edit Vehicle",
      AddNewVehicleComponent,
      properties,
      data
    );
  }

  exportToExcel() {
    //   {
    //     "_id": "66eb0876a32f757e16a652a2",
    //     "vehicleType": 2,
    //     "vehicleTypeName": "Van",
    //     "registrationNumber": "FG-5154",
    //     "gpsTracker": "59568889",
    //     "capacity": 2000,
    //     "availableSeats": 12,
    //     "description": "Tets",
    //     "status": 1,
    //     "statusName": "ACTIVE",
    //     "vehicleOwner": "Lahiru Kumara",
    //     "createdBy": "66a28453f9a1a1e40f644962",
    //     "createdUser": "Lauren Crona",
    //     "updatedBy": "66a28453f9a1a1e40f644962",
    //     "updatedUser": "Lauren Crona",
    //     "createdAt": "2024-09-18T17:06:02.226Z",
    //     "updatedAt": "2024-09-18T17:06:02.226Z"
    // }
    let reportCols = [
      { field: "vehicleType", header: "Vehicle Type" },
      { field: "vehicleTypeName", header: "Vehicle TypeName" },
      { field: "registrationNumber", header: "Registration Number" },
      { field: "gpsTracker", header: "GPS Tracker" },
      { field: "capacity", header: "Capacity" },
      { field: "availableSeats", header: "Available Seats" },
      { field: "description", header: "Description" },
      { field: "statusName", header: "Status" },
      { field: "vehicleOwner", header: "Vehicle Owner" },
      { field: "createdUser", header: "Created User" },
      { field: "updatedUser", header: "Updated User" },
      { field: "createdAt", header: "Created Date" },
      { field: "updatedAt", header: "Updated Date" },
    ];

    let excelData: any[] = [];
    this.recodes.forEach((item: any) => {
      let obj = {
        vehicleType: item.vehicleType,
        vehicleTypeName: item.vehicleTypeName,
        registrationNumber: item.registrationNumber,
        gpsTracker: item.gpsTracker,
        capacity: item.capacity,
        availableSeats: item.availableSeats,
        description: item.description,
        status: item.status,
        vehicleOwner: item.vehicleOwner,
        createdAt: this.datePipe.transform(item.createdAt, "dd/MM/yyyy"),
        updatedAt: this.datePipe.transform(item.updatedAt, "dd/MM/yyyy"),
        statusName: item.statusName,
        createdUser: item.createdUser,
        updatedUser: item.updatedUser,
      };

      excelData.push(obj);
    });

    this.excelService.GenerateExcelFileWithCustomHeader(
      reportCols,
      excelData,
      "Vehicles "
    );
  }

  onStatusChange(rowData: any) {
    let confirmationConfig = {
      message: `Are you sure you want to ${
        rowData?.status == 1 ? "Deactivate" : "Activate"
      } this vehicle?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.vehicleService
            .ActiveInactiveVehicles(rowData?._id, rowData?.status == 1 ? 2 : 1)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.getVehicleData();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  onClickDelete(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to delete this vehicle?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.vehicleService
            .DeleteVehicleById(rowData?._id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.getVehicleData();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  onClickOtherVehicles(rowData: any) {
    debugger;
    let properties = {
      width: "70vw",
      position: "right",
    };

    let data = {
      vehicle: rowData,
    };

    this.sidebarService.addComponent(
      "Internal Trips",
      OtherTripsComponent,
      properties,
      data
    );
  }
}
