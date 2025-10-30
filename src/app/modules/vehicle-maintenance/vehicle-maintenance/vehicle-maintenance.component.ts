import { DatePipe } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GarageService } from 'src/app/shared/services/api-services/garage.service';
import { VehicleMaintenanceService } from 'src/app/shared/services/api-services/vehicle-maintenance.service';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { TransactionHandlerService } from 'src/app/shared/services/transaction-handler.service';
import { AddVehicleMaintenanceComponent } from './add-vehicle-maintenance/add-vehicle-maintenance.component';
import { firstValueFrom } from 'rxjs';
import { VehicleMaintenanceInvoiceComponent } from './vehicle-maintenance-invoice/vehicle-maintenance-invoice.component';

@Component({
  selector: 'app-vehicle-maintenance',
  templateUrl: './vehicle-maintenance.component.html',
  styleUrls: ['./vehicle-maintenance.component.scss']
})
export class VehicleMaintenanceComponent {
  FV = new CommonForm();
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
    private messageService: AppMessageService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private garageService: GarageService,
    private formBuilder: UntypedFormBuilder,
    private vehicleMaintenanceService: VehicleMaintenanceService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.cols = [
      { field: "maintenanceDate", header: "Maintenance Date" },
      { field: "vehicleNumber", header: "Vehicle Number" },
      { field: "maintenancePart", header: "Maintenance Part" },
      { field: "garageName", header: "Garage Name" },
      { field: "cost", header: "Cost (LKR)" },
      { field: "note", header: "Note" },
      { field: "createdAt", header: "Created By" },
      // { field: "updatedAt", header: "Updated By" }
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

    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response) {
        this.loadAllVehicleMaintenance();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
    });

    this.loadAllVehicleMaintenance();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      dateRange: [[], [Validators.required]],
    });
  }

  loadAllVehicleMaintenance() {
    let dateRange = this.FV.getValue("dateRange");

    let startDate = this.datePipe.transform(dateRange[0], "yyyy-MM-dd");
    let endDate = this.datePipe.transform(dateRange[1], "yyyy-MM-dd");

    if (!startDate || !endDate) return;

    this.vehicleMaintenanceService.GetAllVehicleMaintenances(startDate, endDate).subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      }
    });
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    // this.filteredItems = [...this.items];
    this.filteredItems = [];

    if (!rowData.isMonthEndDone) {
      this.filteredItems.push({
        id: 1,
        label: "Edit Maintenance",
        icon: "pi pi-pencil",
        command: (event: any) => {
          this.onClickEdit(event.item.data);
        },
      });
      this.filteredItems.push({
        id: 2,
        label: "Delete Maintenance",
        icon: "pi pi-trash",
        command: (event: any) => {
          this.onClickDelete(event.item.data);
        },
      });
    }

    if (rowData?.isFreelanceVehicle || rowData?.isRentalVehicle) {
      this.filteredItems.push({
        id: 3,
        label: "Print Invoice",
        icon: "pi pi-print",
        command: (event: any) => {
          this.onClickPrintInvoice(event.item.data);
        },
      });
    }

    // if (rowData?.isRentalVehicle) {
    //   this.filteredItems.push({
    //     id: 3,
    //     label: "Print Invoice",
    //     icon: "pi pi-print",
    //     command: (event: any) => {
    //       this.onClickPrintInvoice(event.item.data);
    //     },
    //   });
    // }


    this.filteredItems.push({
      id: 3,
      label: "View Maintenance",
      icon: "pi pi-eye",
      command: (event: any) => {
        this.onClickView(event.item.data);
      },
    });
    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }



  exportToExcel() {
    let reportCols = [
      { field: "maintenanceDate", header: "Maintenance Date" },
      { field: "vehicleNumber", header: "Vehicle Number" },
      { field: "maintenancePart", header: "Maintenance Part" },
      { field: "garageName", header: "Garage Name" },
      { field: "cost", header: "Cost (LKR)" },
      { field: "note", header: "Note" },
      { field: "createdUser", header: "Created User" },
      { field: "updatedUser", header: "Updated User" },
      { field: "createdAt", header: "Created Date" },
      { field: "updatedAt", header: "Updated Date" },
    ];

    let excelData: any[] = [];
    this.recodes.forEach((item: any) => {
      let obj = {
        maintenanceDate: this.datePipe.transform(
          item.maintenanceDate,
          "dd/MM/yyyy",
          "Asia/Colombo"
        ),
        vehicleNumber: item.vehicleNumber,
        maintenancePart: item.maintenancePart,
        garageName: item.garageName,
        cost: item.cost,
        note: item.note,
        createdAt: this.datePipe.transform(
          item.createdAt,
          "dd/MM/yyyy",
          "Asia/Colombo"
        ),
        updatedAt: this.datePipe.transform(
          item.updatedAt,
          "dd/MM/yyyy",
          "Asia/Colombo"
        ),
        statusName: item.statusName,
        createdUser: item.createdUser,
        updatedUser: item.updatedUser,
      };

      excelData.push(obj);
    });

    this.excelService.GenerateExcelFileWithCustomHeader(
      reportCols,
      excelData,
      "Vehicle Maintenance "
    );
  }

  onClickAddNew() {
    let data = {
      vehicleMaintenance: null,
      isEdit: false,
      isView: false,
    };

    let properties = {
      width: "50vw",
      position: "right",
    };

    this.sidebarService.addComponent(
      "Add Vehicle Maintenance",
      AddVehicleMaintenanceComponent,
      properties,
      data
    );
  }


  async onClickEdit(rowData: any) {
    try {
      let maintenanceResponse = await firstValueFrom(this.vehicleMaintenanceService.GetVehicleMaintenanceById(rowData?.id));

      if (maintenanceResponse.IsSuccessful) {
        let data = {
          vehicleMaintenance: maintenanceResponse.Result,
          isEdit: true,
          isView: false
        };

        let properties = {
          width: "50vw",
          position: "right",
        };

        this.sidebarService.addComponent(
          "Edit Vehicle Maintenance",
          AddVehicleMaintenanceComponent,
          properties,
          data
        );
      } else {
        this.messageService.showErrorAlert(maintenanceResponse.Message);
      }

    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  async onClickView(rowData: any) {
    try {
      let maintenanceResponse = await firstValueFrom(this.vehicleMaintenanceService.GetVehicleMaintenanceById(rowData?.id));

      if (maintenanceResponse.IsSuccessful) {
        let data = {
          vehicleMaintenance: maintenanceResponse.Result,
          isEdit: false,
          isView: true
        };

        let properties = {
          width: "50vw",
          position: "right",
        };

        this.sidebarService.addComponent(
          "Edit Vehicle Maintenance",
          AddVehicleMaintenanceComponent,
          properties,
          data
        );
      } else {
        this.messageService.showErrorAlert(maintenanceResponse.Message);
      }

    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  onClickDelete(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to delete this vehicle maintenance?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.vehicleMaintenanceService
            .DeleteVehicleMaintenanceById(rowData?.id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.loadAllVehicleMaintenance();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  async onClickPrintInvoice(rowData: any) {
    try {
      let maintenanceResponse = await firstValueFrom(this.vehicleMaintenanceService.GenerateMaintenanceInvoice(rowData?.id));

      if (maintenanceResponse.IsSuccessful) {
        let data = {
          vehicleMaintenance: maintenanceResponse.Result,
        };

        let properties = {
          width: "50vw",
          position: "right",
        };

        this.sidebarService.addComponent(
          "Vehicle Maintenance Invoice",
          VehicleMaintenanceInvoiceComponent,
          properties,
          data
        );
      } else {
        this.messageService.showErrorAlert(maintenanceResponse.Message);
      }

    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }
}