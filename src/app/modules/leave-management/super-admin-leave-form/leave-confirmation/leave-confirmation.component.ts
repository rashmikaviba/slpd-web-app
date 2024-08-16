import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { AppMessageService } from 'src/app/shared/services/app-message.service';

@Component({
  selector: 'app-leave-confirmation',
  templateUrl: './leave-confirmation.component.html',
  styleUrls: ['./leave-confirmation.component.scss']
})
export class LeaveConfirmationComponent {
  FV = new CommonForm();

  constructor(
    private formBuilder: FormBuilder,
    private messageService: AppMessageService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      employeeName: [""],
      leaveDates: [""],
      reason: [""]
    });
  }

  ngOnInit(): void {
    let data = this.config.data
    console.log("Leave Data", data)

    this.FV.setValue("employeeName", data?.name)
    this.FV.setValue("leaveDates", data?.dates)
  }

  onClickReject() { }
  onClickCancel() {
    this.ref.close(true)
  }
}
