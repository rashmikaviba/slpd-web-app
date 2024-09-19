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
import { DriverTaskFormComponent } from './driver-task-form/driver-task-form.component';
import { TripManagementByDriverComponent } from '../trip-management/trip-management-by-driver/trip-management-by-driver.component';

@Component({
  selector: 'app-driver-management',
  templateUrl: './driver-management.component.html',
  styleUrls: ['./driver-management.component.scss']
})
export class DriverManagementComponent {
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
        label: "Start Trip",
        icon: "pi pi-arrow-circle-right",
        command: (event: any) => {
          this.onClickStartTrip(event.item.data);
        },
      },
      {
        id: 2,
        label: "Delete Trip",
        icon: "pi pi-trash",
        command: (event: any) => {
          this.deleteUserById(event.item.data);
        },
      },
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

    // this.sidebarService.addComponent(
    //   "Add New Trip",
    //   TripManagementFormComponent,
    //   properties,
    //   data
    // );
  }

  async onClickStartTrip(rowData: any) {

    // this, this.router.navigateByUrl("/trip-management-by-driver")

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
      "Manage Trip",
      TripManagementByDriverComponent,
      properties,
      data
    );
  }

  blockUnblockUser(type: number, rowData: any) { }

  resetUserPassword(rowData: any) { }

  deleteUserById(rowData: any) { }

  exportToExcel() { }

  onClickDriverTaskForm() {
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
      "Task Form",
      DriverTaskFormComponent,
      properties,
      data
    );
  }
}
