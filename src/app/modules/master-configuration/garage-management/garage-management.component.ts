import { DatePipe } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GarageService } from 'src/app/shared/services/api-services/garage.service';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { TransactionHandlerService } from 'src/app/shared/services/transaction-handler.service';
import { AddGarageComponent } from './add-garage/add-garage.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-garage-management',
  templateUrl: './garage-management.component.html',
  styleUrls: ['./garage-management.component.scss']
})
export class GarageManagementComponent {
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
    private garageService: GarageService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: "name", header: "Name" },
      { field: "address", header: "Address" },
      { field: "city", header: "City" },
      { field: "contactNumber1", header: "Contact Number 01" },
      { field: "contactNumber2", header: "Contact Number 02" },
      { field: "specializations", header: "Specializations" },
      { field: "status", header: "Status" },
      // { field: "createdBy", header: "Created By" },
      // { field: "updatedBy", header: "Updated By" }
    ];

    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response) {
        this.loadAllGarages();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
    });


    this.items = [
      {
        id: 1,
        label: "Edit Garage",
        icon: "pi pi-pencil",
        command: (event: any) => {
          this.onClickEdit(event.item.data);
        },
      },
      {
        id: 2,
        label: "Delete Garage",
        icon: "pi pi-trash",
        command: (event: any) => {
          this.onClickDelete(event.item.data);
        },
      },
      {
        id: 3,
        label: "View Garage",
        icon: "pi pi-eye",
        command: (event: any) => {
          this.onClickView(event.item.data);
        },
      },
    ];

    this.loadAllGarages();
  }

  loadAllGarages() {
    this.garageService.GetAllGarages().subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
      }
    });
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [...this.items];
    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }



  exportToExcel() {
    let reportCols = [
      { field: "name", header: "Name" },
      { field: "address", header: "Address" },
      { field: "city", header: "City" },
      { field: "contactNumber1", header: "Contact Number 1" },
      { field: "contactNumber2", header: "Contact Number 2" },
      { field: "specializations", header: "Specializations" },
      { field: "status", header: "Status" },
      { field: "createdUser", header: "Created User" },
      { field: "updatedUser", header: "Updated User" },
      { field: "createdAt", header: "Created Date" },
      { field: "updatedAt", header: "Updated Date" },
    ];

    let excelData: any[] = [];
    this.recodes.forEach((item: any) => {
      let obj = {
        name: item.name,
        address: item.address,
        city: item.city,
        contactNumber1: item.contactNumber1,
        contactNumber2: item.contactNumber2,
        specializations: item.specializations,
        status: item.statusName,
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
      "Garages "
    );
  }

  onClickAddNew() {
    let data = {
      garageData: null,
      isEdit: false,
      isView: false,
    };

    let properties = {
      width: "50vw",
      position: "right",
    };

    this.sidebarService.addComponent(
      "Add New Garage",
      AddGarageComponent,
      properties,
      data
    );
  }

  onStatusChange(rowData: any) {
    let confirmationConfig = {
      message: `Are you sure you want to ${rowData?.status == 1 ? "Deactivate" : "Activate"
        } this garage?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.garageService
            .ActiveInactiveGarage(rowData?._id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.loadAllGarages();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }

  async onClickEdit(rowData: any) {
    try {
      let garageResponse = await firstValueFrom(this.garageService.GetGarageById(rowData?._id));

      if (garageResponse.IsSuccessful) {
        let data = {
          garageData: garageResponse.Result,
          isEdit: true,
          isView: false
        };

        let properties = {
          width: "50vw",
          position: "right",
        };

        this.sidebarService.addComponent(
          "Edit Garage",
          AddGarageComponent,
          properties,
          data
        );
      } else {
        this.messageService.showErrorAlert(garageResponse.Message);
      }

    } catch (error) {
      this.messageService.showErrorAlert(error);
    }
  }

  async onClickView(rowData: any) {
    try {
      let garageResponse = await firstValueFrom(this.garageService.GetGarageById(rowData?._id));

      if (garageResponse.IsSuccessful) {
        let data = {
          garageData: garageResponse.Result,
          isEdit: false,
          isView: true
        };

        let properties = {
          width: "50vw",
          position: "right",
        };

        this.sidebarService.addComponent(
          "View Garage",
          AddGarageComponent,
          properties,
          data
        );
      } else {
        this.messageService.showErrorAlert(garageResponse.Message);
      }

    } catch (error) {
      this.messageService.showErrorAlert(error);
    }
  }

  onClickDelete(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to delete this garage?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.garageService
            .DeleteGarage(rowData?._id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.loadAllGarages();
              } else {
                this.messageService.showErrorAlert(response.Message);
              }
            });
        }
      }
    );
  }
}
