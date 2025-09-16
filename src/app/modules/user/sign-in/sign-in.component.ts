import { NotificationService } from "./../../../shared/services/api-services/notification.service";
import { PopupService } from "./../../../shared/services/popup.service";
import { AppComponent } from "./../../../app.component";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { ClientIpHandleService } from "src/app/shared/services/client-ip-handle.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { TransactionHandlerService } from "src/app/shared/services/transaction-handler.service";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent {
  FV = new CommonForm();
  systemInformation: any;
  passwordType: string = "password";

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private transactionService: TransactionHandlerService,
    private masterDataService: MasterDataService,
    private messageService: AppMessageService,
    private clientIpHandle: ClientIpHandleService,
    private sidebarService: SidebarService,
    private appComponent: AppComponent,
    private popupService: PopupService,
    private notificationService: NotificationService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.sidebarService.closeSidebar();
    this.appComponent.sidebarVisible = false;
    this.popupService.closeOpenDialogs();
    this.masterDataService.clearLoginData();
    this.notificationService.setNotificationLoaded(false);
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  handleSubmit() {
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }
  }

  onLogin() {
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }

    let userName = this.FV.getValue("username");
    let password = this.FV.getValue("password");

    let request = {
      userName: userName,
      password: password,
    };

    // this.router.navigate(["/dashboard"]);

    this.transactionService.userLogin(request).subscribe((response) => {
      if (response.IsSuccessful) {
        this.messageService.showSuccessAlert(response.Message);
        let data: any = response.Result;
        this.masterDataService.setUserData(data);

        debugger;
        if (data?.role === WellKnownUserRole.SUPERADMIN || data?.role === WellKnownUserRole.ADMIN) {
          this.router.navigate(["/dashboard"]);
        } else {
          this.router.navigate(["/trip-management"]);
        }

      } else {
        this.messageService.showErrorAlert(response.Message);
      }
    });
  }
}
