import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { WellKnownTripStatus } from 'src/app/shared/enums/well-known-trip-status.enum';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { TripManagementFlowService } from '../trip-management/trip-management-form/trip-management-flow.service';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { DatePipe } from '@angular/common';
import { TripService } from 'src/app/shared/services/api-services/trip.service';
import { ExpenseManagementFormComponent } from './expense-management-form/expense-management-form.component';

@Component({
  selector: 'app-expense-management',
  templateUrl: './expense-management.component.html',
  styleUrls: ['./expense-management.component.scss']
})
export class ExpenseManagementComponent {
  cols: any;
  recodes: any;
  template: TemplateRef<any>;
  items: any[];
  filteredItems: any[];
  WellKnownTripStatus: any = WellKnownTripStatus;
  constructor(
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private popupService: PopupService,
    private router: Router,
    private tripManagementFlowService: TripManagementFlowService,
    private messageService: AppMessageService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private tripService: TripService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: "typeId", header: "Type ID" },
      { field: "typeName", header: "Type Name" },
      { field: "amount", header: "Amount" },
      { field: "description", header: "Description" },
      { field: "date", header: "Date" },
    ];

    this.recodes = [
      { typeId: '1', typeName: 'Test', amount: '1000', description: 'Description', date: '2024-01-01' },
    ]

    this.items = [
      {
        id: 1,
        label: "Edit Expense",
        icon: "pi pi-pencil",
        command: (event: any) => {
          this.onClickEdit(event.item.data);
        },
      },
      {
        id: 2,
        label: "View Expense",
        icon: "pi pi-eye",
        command: (event: any) => {
          this.onClickView(event.item.data);
        },
      },
      {
        id: 3,
        label: "Delete Expense",
        icon: "pi pi-trash",
        command: (event: any) => {
          this.onClickDelete(event.item.data);
        },
      },
    ];
  }

  onClickAddNew() {
    let header = "Add New Expense";
    let width = "40vw";
    let data = {};

    this.popupService
      .OpenModel(ExpenseManagementFormComponent, { header, width, data })
      .subscribe((result) => {
        if (result) { }
      });
  }

  onClickEdit(rowData) { 
    let header = "Edit Expense";
    let width = "40vw";
    let data = {};

    this.popupService
      .OpenModel(ExpenseManagementFormComponent, { header, width, data })
      .subscribe((result) => {
        if (result) { }
      });
  }
  onClickView(rowData) { 
    let header = "View Expense";
    let width = "40vw";
    let data = {};

    this.popupService
      .OpenModel(ExpenseManagementFormComponent, { header, width, data })
      .subscribe((result) => {
        if (result) { }
      });
  }
  onClickDelete(rowData) { }

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [];

    const conditions = [
      { ids: [1, 2, 3], condition: true },
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
}
