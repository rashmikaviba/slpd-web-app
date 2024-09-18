import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { AddUserControlFlowService } from '../user/add-new-user/add-new-user-form/add-user-control-flow.service';
import { UserService } from 'src/app/shared/services/api-services/user.service';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { TransactionHandlerService } from 'src/app/shared/services/transaction-handler.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { DatePipe } from '@angular/common';
import { AddNewVehicleComponent } from './add-new-vehicle/add-new-vehicle.component';

@Component({
  selector: 'app-vehicle-management',
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.scss']
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
    private addUserControlFlowService: AddUserControlFlowService,
    private userService: UserService,
    private messageService: AppMessageService,
    private transactionService: TransactionHandlerService,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: "vehicleNo", header: "Vehicle Number" },
      { field: "ownerName", header: "Owner Name" },
      { field: "type", header: "Vehicle Type" },
      { field: "regNo", header: "Registration Number" },
      { field: "regDate", header: "Registration Date" },
      { field: "capacity", header: "Capacity" },
    ];

    this.recodes = [
      { vehicleNo: 'BHK-8725', ownerName: 'Lahiru Sandaruwan', type: 'Car', regNo: 'Reg Number 01', regDate: '2024-09-14', capacity: '1500CC' }
    ]

    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response) {
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
      this.addUserControlFlowService.resetData();
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
      // {
      //   id: 5,
      //   label: "Reset Password",
      //   icon: "pi pi-refresh",
      //   command: (event: any) => {
      //     this.resetUserPassword(event.item.data);
      //   },
      // },
      {
        id: 2,
        label: "Delete Vehicle",
        icon: "pi pi-trash",
        command: (event: any) => {
          this.deleteUserById(event.item.data);
        },
      },
      // {
      //   id: 3,
      //   label: "Block User",
      //   icon: "pi pi-ban",
      //   command: (event: any) => {
      //     this.blockUnblockUser(1, event.item.data);
      //   },
      // },
      // {
      //   id: 4,
      //   label: "Unblock User",
      //   icon: "pi pi-check-circle",
      //   command: (event: any) => {
      //     this.blockUnblockUser(2, event.item.data);
      //   },
      // },
    ];
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [];

    this.filteredItems = this.items.filter((menuItem: any) => {
      if (rowData?.isBlackListed && menuItem.id === 3) {
        return false;
      } else if (!rowData?.isBlackListed && menuItem.id === 4) {
        return false;
      } else {
        return true;
      }
    });

    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
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

    this.sidebarService.addComponent(
      "Add New Vehicle",
      AddNewVehicleComponent,
      properties,
      data
    );
  }

  async onClickEdit(rowData: any) {
    let data = {
      userData: null,
      isEdit: true,
    };

    this.addUserControlFlowService.resetData();

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

  blockUnblockUser(type: number, rowData: any) { }

  resetUserPassword(rowData: any) { }

  deleteUserById(rowData: any) { }

  exportToExcel() { }
}
