import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { PopupService } from "src/app/shared/services/popup.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { RequestLeaveByDriverComponent } from "./request-leave-by-driver/request-leave-by-driver.component";
import { AppComponent } from "src/app/app.component";
import { LeaveService } from "src/app/shared/services/api-services/leave.service";

@Component({
  selector: "app-driver-leave-form",
  templateUrl: "./driver-leave-form.component.html",
  styleUrls: ["./driver-leave-form.component.scss"],
})
export class DriverLeaveFormComponent {
  cols: any;
  recodes: any;
  _recodes: any;
  items: any[];
  filteredItems: any[];
  leaveData: any;
  leaveTypes: any[] = [
    { id: 1, name: "Pending" },
    { id: 2, name: "Approve" },
    { id: 3, name: "Reject" },
  ];
  FV = new CommonForm();

  constructor(
    private formBuilder: FormBuilder,
    private messageService: AppMessageService,
    private popupService: PopupService,
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private leaveService: LeaveService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      leaveType: [null],
    });
  }

  ngOnInit(): void {
    this.cols = [
      { field: "createdAt", header: "Applied Date" },
      { field: "dateCount", header: "Requested Leave Count" },
      { field: "startDate", header: "Requested Dates" },
      { field: "reason", header: "Reason" },
      { field: "status", header: "Status" },
    ];

    this.loadLeaveCountData();
    this.loadAllLeaves();

    this.items = [
      {
        id: 1,
        label: "View Leave",
        icon: "pi pi-eye",
        command: (event: any) => {
          this.onOpenApplyLeave(3, event.item.data);
        },
      },
      {
        id: 2,
        label: "Edit Leave",
        icon: "pi pi-pencil",
        command: (event: any) => {
          this.onOpenApplyLeave(2, event.item.data);
        },
      },
      {
        id: 3,
        label: "Cancel Leave",
        icon: "pi pi-times",
        command: (event: any) => {
          this.onClickDeleteLeave(event.item.data);
        },
      },
    ];

    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response) {
        this.loadAllLeaves();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
    });
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [];

    if (rowData.status == 1) {
      this.filteredItems = this.items;
    } else if (rowData.status == 2 || rowData.status == 3) {
      this.filteredItems = this.items.filter((x) => x.id == 1);
    }

    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }

  loadLeaveCountData() {
    this.leaveService.GetLeaveCount().subscribe((response) => {
      if (response.IsSuccessful) {
        this.leaveData = response.Result;
      }
    });
  }

  loadAllLeaves() {
    this.leaveService.GetAllLeaves().subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
        this._recodes = response.Result;

        let leaveType = this.FV.getValue("leaveType");
        debugger;
        if (leaveType) {
          this.onLeaveTypeChange({ value: leaveType });
        }
      }
    });
  }

  onOpenApplyLeave(type: number, rowData: any) {
    try {
      // 1 = new leave , 2 = edit, 3 = view
      let header =
        type == 1 ? "Request Leave" : type == 2 ? "Edit Leave" : "View Leave";

      let data = {
        leaveData: rowData,
        isEdit: type == 2 ? true : false,
        isView: type == 3 ? true : false,
      };

      if (type == 3 || type == 2) {
        this.leaveService.GetLeaveById(rowData?._id).subscribe((response) => {
          if (response.IsSuccessful) {
            data.leaveData = response.Result;
          }
        });
      }

      // this.addUserControlFlowService.resetData();

      let properties = {
        width: "30vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        header,
        RequestLeaveByDriverComponent,
        properties,
        data
      );
    } catch (error: any) {
      this.messageService.showErrorAlert(error);
    }
  }

  onClickDeleteLeave(rowData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to cancel this leave?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.leaveService.CancelLeave(rowData?._id).subscribe((response) => {
            if (response.IsSuccessful) {
              this.messageService.showSuccessAlert(response.Message);
              this.loadAllLeaves();
            } else {
              this.messageService.showErrorAlert(response.Message);
            }
          });
        }
      }
    );
  }

  onLeaveTypeChange(e: any) {
    if (e?.value) {
      this.recodes = this._recodes.filter((x: any) => x.status == e.value);
    } else {
      this.recodes = this._recodes;
    }
  }
}
