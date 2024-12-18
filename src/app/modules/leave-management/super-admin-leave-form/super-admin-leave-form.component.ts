import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { PopupService } from "src/app/shared/services/popup.service";
import { LeaveConfirmationComponent } from "./leave-confirmation/leave-confirmation.component";
import { LeaveService } from "src/app/shared/services/api-services/leave.service";
import { firstValueFrom } from "rxjs";
import { DatePipe } from "@angular/common";
import { ExcelService } from "src/app/shared/services/excel.service";

@Component({
  selector: "app-super-admin-leave-form",
  templateUrl: "./super-admin-leave-form.component.html",
  styleUrls: ["./super-admin-leave-form.component.scss"],
})
export class SuperAdminLeaveFormComponent {
  FV = new CommonForm();
  cols: any;
  recodes: any;
  _recodes: any;
  sidebarVisible2: boolean = false;
  items: any[];
  filteredItems: any[];
  leaveTypes: any[] = [
    { id: 1, name: "Pending" },
    { id: 2, name: "Approve" },
    { id: 3, name: "Reject" },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: AppMessageService,
    private popupService: PopupService,
    private leaveService: LeaveService,
    private datePipe: DatePipe,
    private excelService: ExcelService
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
      { field: "appliedUserName", header: "Applied By" },
      { field: "appliedUserRole", header: "User Type" },
      { field: "availableLeaveCount", header: "Available Leave Count" },
      { field: "dateCount", header: "Requested Leave Count" },
      { field: "startDate", header: "Requested Dates" },
      { field: "reason", header: "Reason" },
      { field: "status", header: "Status" },
    ];

    this.items = [
      {
        id: 1,
        label: "Approve Leave",
        icon: "pi pi-check",
        command: (event: any) => {
          this.onClickApproveRejectLeave(event.item.data, true);
        },
      },
      {
        id: 2,
        label: "Reject Leave",
        icon: "pi pi-times",
        command: (event: any) => {
          this.onClickApproveRejectLeave(event.item.data, false);
        },
      },
    ];

    this.loadAllLeaves();
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    this.filteredItems = [];

    if (rowData.status == 1 && !rowData.isMonthEndDone) {
      this.filteredItems = this.items;
    } else if (rowData.status == 2 && !rowData.isMonthEndDone) {
      this.filteredItems = this.items.filter((x) => x.id != 1);
    } else if (rowData.status == 3 && !rowData.isMonthEndDone) {
      this.filteredItems = this.items.filter((x) => x.id != 2);
    }

    this.filteredItems.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }

  loadAllLeaves() {
    this.leaveService.GetAllLeaves().subscribe((response) => {
      if (response.IsSuccessful) {
        this.recodes = response.Result;
        this._recodes = response.Result;
      }
    });
  }

  async onClickApproveRejectLeave(rowData: any, isApproved: boolean = false) {
    try {
      let header = isApproved ? "Approve Leave" : "Reject Leave";
      let width = "40vw";
      let data = {
        leaveData: rowData,
        isApproved: isApproved,
      };

      const leaveInfoResult = await firstValueFrom(
        this.leaveService.GetLeaveById(rowData?._id)
      );

      if (leaveInfoResult.IsSuccessful) {
        data.leaveData = leaveInfoResult.Result;
      }

      this.popupService
        .OpenModel(LeaveConfirmationComponent, { header, width, data })
        .subscribe((result) => {
          if (result) {
            this.FV.clearValue("leaveType");
            this.loadAllLeaves();
          }
        });
    } catch (error: any) {
      this.messageService.showErrorAlert(error);
    }
  }

  onLeaveTypeChange(e: any) {
    if (e?.value) {
      this.recodes = this._recodes.filter((x: any) => x.status == e.value);
    } else {
      this.recodes = this._recodes;
    }
  }

  exportToExcel() {
    let reportCols = [
      { field: "appliedUserName", header: "Applied User" },
      { field: "appliedUserRole", header: "User Type" },
      { field: "reason", header: "Reason" },
      { field: "startDate", header: "Start Date" },
      { field: "endDate", header: "End Date" },
      { field: "dateCount", header: "Date Count" },
      { field: "availableLeaveCount", header: "Available Leave Count" },
      { field: "statusName", header: "Status" },
      { field: "createdAt", header: "Applied Date" },
      { field: "approvedUser", header: "Approved User" },
      { field: "approveDate", header: "Approved Date" },
      { field: "approveRemark", header: "Approved Remark" },
      { field: "rejectedUser", header: "Rejected User" },
      { field: "rejectDate", header: "Rejected Date" },
      { field: "rejectReason", header: "Rejected Reason" },
      { field: "isMonthEndDone", header: "Is Month End Done" },
      { field: "createdUser", header: "Created User" },
      { field: "updatedUser", header: "Updated User" },
    ];

    let excelData: any[] = [];
    ;
    this.recodes.forEach((item: any) => {
      let obj = {
        appliedUserName: item.appliedUserName,
        appliedUserRole: item.appliedUserRole,
        reason: item.reason,
        startDate: this.datePipe.transform(item.startDate, "dd/MM/yyyy"),
        endDate: this.datePipe.transform(item.endDate, "dd/MM/yyyy"),
        dateCount: item.dateCount,
        availableLeaveCount: item.availableLeaveCount,
        statusName: item.statusName,
        approvedUser: item.approvedUser,
        approveDate: this.datePipe.transform(
          item.approveDate,
          "dd/MM/yyyy HH:mm:ss"
        ),
        approveRemark: item.approveRemark,
        rejectedUser: item.rejectedUser,
        rejectDate: this.datePipe.transform(
          item.rejectDate,
          "dd/MM/yyyy HH:mm:ss"
        ),
        rejectReason: item.rejectReason,
        isMonthEndDone: item.isMonthEndDone,
        createdUser: item.createdUser,
        updatedUser: item.updatedUser,
      };

      excelData.push(obj);
    });

    this.excelService.GenerateExcelFileWithCustomHeader(
      reportCols,
      excelData,
      "Leaves "
    );
  }
}
