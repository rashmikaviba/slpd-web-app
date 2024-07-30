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
  ) {
    this.createForm();
    this.GetSystemInformation();
  }

  ngOnInit(): void {
    this.sidebarService.closeSidebar();
    this.appComponent.sidebarVisible = false;
    this.popupService.closeOpenDialogs();
    this.masterDataService.clearLoginData();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      hotelId: ["", Validators.required],
    });
  }

  handleSubmit() {
    if (this.FV.formGroup.invalid) {
      this.FV.showErrors();
      return;
    }
  }

  GetSystemInformation() {
    this.transactionService.GetVersionNo().subscribe((result) => {
      if (result.IsSuccessful) {
        this.systemInformation = result.Result;
      }
    });
  }

  onLogin() {
    this.router.navigate(['/dashboard']);
    // this.GetSystemInformation();
    // if (this.FV.formGroup.invalid) {
    //   this.FV.showErrors();
    //   return;
    // }

    // let username = this.FV.getValue("username");
    // let password = this.FV.getValue("password");
    // let hotelId = this.FV.getValue("hotelId");

    // let request = {
    //   username: username,
    //   password: password,
    //   HotelId: hotelId,
    //   grant_type: "password",
    // };

    // this.transactionService.SignIn(request).subscribe((result: any) => {
    //   if (result.access_token) {
    //     this.masterDataService.setUserData(result);
    //     this.masterDataService.HotelId = hotelId;
    //     this.messageService.showSuccessAlert("Login Successful!");
    //     this.initializeApp();
    //   } else {
    //     this.messageService.showErrorAlert(
    //       "The username, password or hotel code is incorrect!"
    //     );
    //   }
    // });
  }
}
