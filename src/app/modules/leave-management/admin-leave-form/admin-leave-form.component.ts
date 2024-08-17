import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { RequestLeaveByAdminComponent } from './request-leave-by-admin/request-leave-by-admin.component';

@Component({
  selector: 'app-admin-leave-form',
  templateUrl: './admin-leave-form.component.html',
  styleUrls: ['./admin-leave-form.component.scss']
})
export class AdminLeaveFormComponent {
  FV = new CommonForm();
  cols: any;
  recodes: any;
  loading: any;
  sidebarVisible2: boolean = false;
  items: any[];
  filteredItems: any[];
  leaveTypes: any[] = [
    { id: 2, name: 'Pending' },
    { id: 1, name: 'Approve' },
    { id: 3, name: 'Reject' },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private messageService: AppMessageService,
    private popupService: PopupService,
    private sidebarService: SidebarService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      rejectedLeaves: [""],
      leavesTaken: [""],
      pendingLeaves: [""]
    });
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'Leave ID' },
      { field: 'startDate', header: 'Start Date' },
      { field: 'endDate', header: 'End Date' },
      { field: 'leaveCount', header: 'Leave Count' },
      { field: 'reason', header: 'Reason' },
      { field: 'status', header: 'Status' }
    ]

    this.recodes = [
      { id: '1', startDate: "2024-08-01", endDate: "2024-08-02", leaveCount: 2, reason: 'Exam', status: 'Approved' },
      { id: '2', startDate: "2024-08-02", endDate: "2024-08-03", leaveCount: 2, reason: 'Exam', status: 'Rejected' },
      { id: '3', startDate: "2024-08-01", endDate: "2024-08-02", leaveCount: 2, reason: 'Exam', status: 'Approved' },
    ]

    this.items = [
      {
        id: 1,
        label: "Edit Leave",
        icon: "pi pi-check",
        command: (event: any) => {
          this.onClickEditLeave(event.item.data);
        },
      },
      {
        id: 5,
        label: "Delete Leave",
        icon: "pi pi-times",
        command: (event: any) => {
          this.onClickDeleteLeave(event.item.data);
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
    try {
      let data = {
        userData: null,
        isEdit: false,
      };

      // this.addUserControlFlowService.resetData();

      let properties = {
        width: "30vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "Request Leave",
        RequestLeaveByAdminComponent,
        properties,
        data
      );
    } catch (error: any) {
      this.messageService.showErrorAlert(error)
    }
  }

  onClickEditLeave(e: any) {
    try {
      let data = {
        userData: null,
        isEdit: false,
      };
      // this.addUserControlFlowService.resetData();

      let properties = {
        width: "30vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "Edit Requested Leave",
        RequestLeaveByAdminComponent,
        properties,
        data
      );
    } catch (error: any) {
      this.messageService.showErrorAlert(error)
    }
  }
  onClickDeleteLeave(e: any) { }
}
