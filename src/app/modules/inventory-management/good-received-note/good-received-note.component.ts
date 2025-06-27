import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { GrnService } from 'src/app/shared/services/api-services/grn.service';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { AddGrnFormComponent } from './add-grn-form/add-grn-form.component';
import { WellKnownUserRole } from 'src/app/shared/enums/well-known-user-role.enum';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-good-received-note',
  templateUrl: './good-received-note.component.html',
  styleUrls: ['./good-received-note.component.scss']
})
export class GoodReceivedNoteComponent {
  cols: any[] = []
  recodes: any[] = []
  items: any[] = [];
  FV = new CommonForm()
  status: any[] = [
    {
      label: "All",
      value: -1,
    },
    {
      label: "Pending",
      value: 1,
    },
    {
      label: "Approved",
      value: 2,
    },
    {
      label: "Rejected",
      value: 3,
    },
  ];
  userRole: number = 0;

  constructor(
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private popupService: PopupService,
    private messageService: AppMessageService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private masterDataService: MasterDataService,
    private grnService: GrnService) {
    this.userRole = this.masterDataService.Role;
    this.createForm();
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'grnNumberWithPrefix', header: 'GRN No' },
      { field: 'productsNames', header: 'Products' },
      { field: 'grnRemarks', header: 'Remarks' },
      { field: 'status', header: 'Status' },
      { field: 'createdByName', header: 'Created By' },
      { field: 'approvedOrRejectedByName', header: 'Approved/Rejected By' },
      { field: 'approvedRejectedRemarks', header: 'Approved/Rejected Remarks' },
      // { field: 'action', header: 'Action' }
    ]
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

    this.loadInitialData();
    this.sidebarService.sidebarEvent.subscribe((response) => {
      if (response) {
        this.loadInitialData();
      }

      this.sidebarService.removeComponent();
      this.appComponent.sidebarVisible = false;
    });
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      status: [-1, [Validators.required]],
      dateRange: [[], [Validators.required]],
    });
  }

  loadInitialData() {
    this.onSearch();
  }

  onSearch() {
    let dateRange = this.FV.getValue("dateRange");
    if (dateRange.length == 2) {
      let startDate = this.datePipe.transform(dateRange[0], 'yyyy-MM-dd');
      let endDate = this.datePipe.transform(dateRange[1], 'yyyy-MM-dd');
      let status = this.FV.getValue("status");

      let request = {
        "startDate": startDate,
        "endDate": endDate,
        "status": status
      }

      this.grnService.GrnAdvanceSearch(request).subscribe((response) => {
        if (response.IsSuccessful) {
          this.recodes = response.Result;
        }
      })
    }
  }

  toggleMenu(menu: any, event: any, rowData: any) {
    // Approve ,reject, edit, cancel, view
    this.items = [];

    this.items.push({
      id: 5,
      label: "View GRN",
      icon: "pi pi-eye",
      command: (event: any) => {
        this.viewGRN(event.item.data);
      }
    });

    if (this.userRole == WellKnownUserRole.SUPERADMIN || this.userRole == WellKnownUserRole.ADMIN) {
      if (rowData.status == 1) {
        this.items.push({
          id: 1,
          label: "Edit GRN",
          icon: "pi pi-pencil",
          command: (event: any) => {
            this.onClickEdit(event.item.data);
          }
        });

        this.items.push({
          id: 2,
          label: "Approve GRN",
          icon: "pi pi-check",
          command: (event: any) => {
            this.approveGRN(event.item.data);
          }
        });

        this.items.push({
          id: 3,
          label: "Reject GRN",
          icon: "pi pi-times",
          command: (event: any) => {
            this.rejectGRN(event.item.data);
          }
        });


        this.items.push({
          id: 4,
          label: "Cancel GRN",
          icon: "pi pi-trash",
          command: (event: any) => {
            this.cancelGRN(event.item.data);
          }
        });
      }
    }

    this.items.forEach((menuItem) => {
      menuItem.data = rowData;
    });
    menu.toggle(event);
  }


  onClickAddNew() {
    let data = {
      grnData: null,
      isEdit: false,
      isApproved: false,
      isRejected: false,
      isViewOnly: false
    }

    let properties = {
      width: "70vw",
      position: "right",
    };

    this.sidebarService.addComponent(
      "Add New GRN",
      AddGrnFormComponent,
      properties,
      data
    );
  }

  onStatusChange(rowData: any) { }

  getButtonColor(status: number): any {
    switch (status) {
      case 1:
        return "secondary";
      case 2:
        return "success";
      case 3:
        return "danger";
      default:
        return "secondary";
    }
  }


  cancelGRN(grnData: any) {
    let confirmationConfig = {
      message: "Are you sure you want to cancel this GRN?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.grnService
            .CancelGrn(grnData?._id)
            .subscribe((response) => {
              if (response.IsSuccessful) {
                this.messageService.showSuccessAlert(response.Message);
                this.loadInitialData();
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
      let data = {
        grnData: null,
        isEdit: true,
        isApproved: false,
        isRejected: false,
        isViewOnly: false
      }

      const grnResult = await firstValueFrom(
        this.grnService.GetGrnById(rowData._id)
      )

      if (grnResult.IsSuccessful) {
        data.grnData = grnResult.Result;
      }

      let properties = {
        width: "70vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "Edit New GRN",
        AddGrnFormComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }




  async approveGRN(rowData: any) {
    try {
      let data = {
        grnData: null,
        isEdit: false,
        isApproved: true,
        isRejected: false,
        isViewOnly: false
      }

      const grnResult = await firstValueFrom(
        this.grnService.GetGrnById(rowData._id)
      )

      if (grnResult.IsSuccessful) {
        data.grnData = grnResult.Result;
      }

      let properties = {
        width: "70vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "Approve GRN",
        AddGrnFormComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }


  async rejectGRN(rowData: any) {
    try {
      let data = {
        grnData: null,
        isEdit: false,
        isApproved: false,
        isRejected: true,
        isViewOnly: false
      }

      const grnResult = await firstValueFrom(
        this.grnService.GetGrnById(rowData._id)
      )

      if (grnResult.IsSuccessful) {
        data.grnData = grnResult.Result;
      }

      let properties = {
        width: "70vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "Reject GRN",
        AddGrnFormComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }

  async viewGRN(rowData: any) {
    try {
      let data = {
        grnData: null,
        isEdit: false,
        isApproved: false,
        isRejected: false,
        isViewOnly: true
      }

      const grnResult = await firstValueFrom(
        this.grnService.GetGrnById(rowData._id)
      )

      if (grnResult.IsSuccessful) {
        data.grnData = grnResult.Result;
      }

      let properties = {
        width: "70vw",
        position: "right",
      };

      this.sidebarService.addComponent(
        "View GRN",
        AddGrnFormComponent,
        properties,
        data
      );
    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }
}
