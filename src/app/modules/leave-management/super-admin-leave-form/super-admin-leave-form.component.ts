import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { LeaveConfirmationComponent } from './leave-confirmation/leave-confirmation.component';

@Component({
  selector: 'app-super-admin-leave-form',
  templateUrl: './super-admin-leave-form.component.html',
  styleUrls: ['./super-admin-leave-form.component.scss']
})
export class SuperAdminLeaveFormComponent {
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
    private popupService: PopupService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      leaveType: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'Employee ID' },
      { field: 'name', header: 'Employee Name' },
      { field: 'pendingLeaveCount', header: 'Pending Leave Count' },
      { field: 'requestLeaveCount', header: 'Requested Leave Count' },
      { field: 'dates', header: 'Requested Dates' },
      { field: 'reason', header: 'Reason' }
    ]

    this.recodes = [
      { id: '1', name: "Lahiru Sandaruwan", pendingLeaveCount: 10, requestLeaveCount: 2, dates: '2024-08-20', reason: 'Exam' },
      { id: '1', name: "Lahiru Sandaruwan", pendingLeaveCount: 10, requestLeaveCount: 2, reason: 'Exam' },
      { id: '1', name: "Lahiru Sandaruwan", pendingLeaveCount: 10, requestLeaveCount: 2, reason: 'Exam' }
    ]

    this.items = [
      {
        id: 1,
        label: "Approve Leave",
        icon: "pi pi-check",
        command: (event: any) => {
          this.onClickApproveLeave(event.item.data);
        },
      },
      {
        id: 5,
        label: "Reject Leave",
        icon: "pi pi-times",
        command: (event: any) => {
          this.onClickRejectLeave(event.item.data);
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

  onClickApproveLeave(e: any) { }
  onClickRejectLeave(e: any) {
    try {

      let header = 'Reason For Reject Leave'
      let width = '40vw'
      let data = e

      this.popupService.OpenModel(LeaveConfirmationComponent, { header, width, data }).subscribe((result) => {
        if (result) {
          console.log("Test")
        }
      })
    } catch (error: any) {
      this.messageService.showErrorAlert(error)
    }
  }

}
