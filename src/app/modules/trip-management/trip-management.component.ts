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
import { TripManagementFormComponent } from './trip-management-form/trip-management-form.component';
import { AddDriverAndVehicleFormComponent } from './add-driver-and-vehicle-form/add-driver-and-vehicle-form.component';

@Component({
  selector: 'app-trip-management',
  templateUrl: './trip-management.component.html',
  styleUrls: ['./trip-management.component.scss']
})
export class TripManagementComponent {
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
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: "tripNo", header: "Trip Number" },
      { field: "startDate", header: "Start Date" },
      { field: "endDate", header: "End Date" },
      { field: "passengersCount", header: "Passengers Count" },
      { field: "destinations", header: "Destinations" },
    ];

    this.recodes = [
      { tripNo: '#1', startDate: '2024-09-16', endDate: '2024-09-18', passengersCount: '5', destinations: 'Colombo, Galle, Matara' },
      { tripNo: '#2', startDate: '2024-09-16', endDate: '2024-09-18', passengersCount: '5', destinations: 'Colombo, Galle, Matara' },
      { tripNo: '#3', startDate: '2024-09-16', endDate: '2024-09-18', passengersCount: '5', destinations: 'Colombo, Galle, Matara' },
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
        label: "Edit Trip",
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
        label: "Delete Trip",
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
      "Add New Trip",
      TripManagementFormComponent,
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
      "Edit Trip",
      TripManagementFormComponent,
      properties,
      data
    );
  }

  blockUnblockUser(type: number, rowData: any) { }

  resetUserPassword(rowData: any) { }

  deleteUserById(rowData: any) { }

  exportToExcel() { }

  onClickAssignDriverAndVehicle() {

    let header = "Additional Information";
    let width = "30vw";
    let data = ""
    this.popupService.OpenModel(AddDriverAndVehicleFormComponent, { header, width, data }).subscribe((result) => {

    })
  }
}
