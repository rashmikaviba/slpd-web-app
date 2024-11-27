import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WebcamViewComponent } from 'src/app/shared/components/webcam-view/webcam-view.component';
import { TripService } from 'src/app/shared/services/api-services/trip.service';
import { UserService } from 'src/app/shared/services/api-services/user.service';
import { VehicleService } from 'src/app/shared/services/api-services/vehicle.service';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-expense-management-form',
  templateUrl: './expense-management-form.component.html',
  styleUrls: ['./expense-management-form.component.scss']
})
export class ExpenseManagementFormComponent {
  FV = new CommonForm();
  isEdit: any;
  expenseType: any[] = [];
  minStartDate: any
  receiptImageUrl: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private userService: UserService,
    private vehicleService: VehicleService,
    private messageService: AppMessageService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private tripService: TripService,
    private popUpService: PopupService,
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      expenseType: ["", Validators.required],
      amount: ["", Validators.required],
      date: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    let dialogConfig = this.config.data;
  }

  onChangeDate() { }

  openUploadDialog(uploadType: number) {
    let header = "Capture ";
    this.popUpService
      .OpenModel(WebcamViewComponent, {
        header: header,
        width: "35vw",
        height: "35vh",
      })
      .subscribe((res) => {
        if (res?.isSave) { }
      });
  }

  removeImage(uploadType: number) { }

  onClickSave() { }
  onClickCancel() { }
}
