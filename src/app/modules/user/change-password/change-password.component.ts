import { Component } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { UserService } from "src/app/shared/services/api-services/user/user.service";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent {
  userId: number = 0;
  FV = new CommonForm();
  constructor(
    private messageService: AppMessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private formBuilder: UntypedFormBuilder,
    private masterDataService: MasterDataService,
    private userService: UserService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.userId = this.masterDataService.ClientId;
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      oldPassword: ["", [Validators.required]],
      newPassword: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    });
  }

  onSave() {
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }

    let oldPassword = this.FV.getValue("oldPassword");
    let newPassword = this.FV.getValue("newPassword");
    let confirmPassword = this.FV.getValue("confirmPassword");

    if (newPassword !== confirmPassword) {
      this.messageService.showWarnAlert("Confirm password does not match!");
      return;
    }

    let request = {
      userId: this.userId,
      CurrentPassword: oldPassword,
      NewPassword: newPassword,
    };

    this.userService.ChangePassword(request).subscribe((result) => {
      if (result.IsSuccessful) {
        this.messageService.showSuccessAlert("Password changed successfully!");
        this.ref.close();
      } else {
        this.messageService.showErrorAlert(result.Errors[0]);
      }
    });
  }

  onCancel() {
    this.ref.close();
  }
}
