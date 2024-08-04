import { Component, TemplateRef, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/api";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { PersonalDetailsComponent } from "./personal-details/personal-details.component";
import { BankDetailsComponent } from "./bank-details/bank-details.component";
import { UploadVerificationsComponent } from "./upload-verifications/upload-verifications.component";
import { AddUserControlFlowService } from "./add-user-control-flow.service";
import { AppMessageService } from "src/app/shared/services/app-message.service";

@Component({
  selector: "app-add-new-user-form",
  templateUrl: "./add-new-user-form.component.html",
  styleUrls: ["./add-new-user-form.component.scss"],
})
export class AddNewUserFormComponent {
  @ViewChild("templateRef", { static: true }) templateRef: TemplateRef<any>;
  @ViewChild(PersonalDetailsComponent)
  private pdc!: PersonalDetailsComponent;
  @ViewChild(BankDetailsComponent)
  private bdc!: BankDetailsComponent;
  @ViewChild(UploadVerificationsComponent)
  private uvc!: UploadVerificationsComponent;

  activeIndex: any = 0;
  items: MenuItem[];
  value: any = { value: 0, label: "Personal" };
  showingIndex: number = 0;
  userDetail: any;
  uploadedImages: any;
  constructor(
    private sidebarService: SidebarService,
    private addUserControlFlowService: AddUserControlFlowService,
    private messageService: AppMessageService
  ) {}

  ngOnInit(): void {
    this.sidebarService.setFooterTemplate(this.templateRef);

    this.items = [
      {
        value: 0,
        label: "Personal",
      },
      {
        value: 1,
        label: "Bank Details",
      },
      {
        value: 2,
        label: "Upload",
      },
    ];
  }

  handleClick(index: number): void {
    debugger;
    let isStepCompleted = this.addUserControlFlowService.getStepValue(
      index
    ) as boolean;

    isStepCompleted = true;

    if (isStepCompleted) {
      this.showingIndex = index;
    } else {
      return;
    }
  }

  handleSave(index: number): void {
    debugger;
    switch (index) {
      case 0:
        this.savePersonalDetails();
        break;
      case 1:
        this.saveBankDetails();
        break;
      case 2:
        this.showingIndex = 2 + 1;
        break;
      default:
        this.showingIndex = 0 + 1;
    }
  }

  savePersonalDetails() {
    let role = this.pdc.FV.getValue("role");
    if (
      this.pdc.FV.validateControllers(
        "fullName,userName,gender,dateOfBirth,address,nicNo,number1,email,role"
      )
    ) {
      return;
    }

    if (role === 2) {
      if (this.pdc.FV.validateControllers("basicSalary,leaveCount")) {
        return;
      }
    } else if (role === 3) {
      if (this.pdc.FV.validateControllers("languages")) {
        return;
      }
    }

    let formData = this.pdc.FV.formGroup.value;

    this.userDetail = {
      ...this.userDetail,
      fullName: formData.fullName,
      userName: formData.userName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      nic: formData.nicNo,
      phoneNumber1: formData.number1,
      phoneNumber2: formData.number2,
      email: formData.email,
      basicSalary: formData.basicSalary,
      leaveCount: formData.leaveCount,
      languages: formData.languages,
      role: formData.role,
    };

    this.addUserControlFlowService.setUserDetail(this.userDetail);
    this.addUserControlFlowService.setStepValue(0, true);

    this.showingIndex = 0 + 1;
  }

  saveBankDetails() {
    if (
      this.bdc.FV.validateControllers(
        "bankName,branchName,accNumber,accHolderName,accHolderAddress"
      )
    ) {
      return;
    }

    let formData = this.bdc.FV.formGroup.value;
    this.userDetail = {
      ...this.userDetail,
      bankName: formData.bankName,
      branch: formData.branchName,
      accountNumber: formData.accNumber,
      accountHolderName: formData.accHolderName,
      accountHolderAddress: formData.accHolderAddress,
    };

    this.addUserControlFlowService.setUserDetail(this.userDetail);
    this.addUserControlFlowService.setStepValue(1, true);

    this.showingIndex = 1 + 1;
  }

  async saveUpload() {
    try {
      this.uploadedImages = this.addUserControlFlowService.getUploadImage();
      // profileImageUrl: "",
      // nicImageUrl: "",
      // gsCertificateUrl: "",
      // drivingLicenseUrl: "",
      // sltdaCertificateUrl: "",
      // policeReportUrl: "",
    } catch (error) {
      this.messageService.showErrorAlert(error);
    }
  }

  async uploadImages() {
    // this.uploadImages
    // uploadedImages: any = {
    //   selectedProfileImage: null,
    //   selectedNicImage: null,
    //   selectedGsCertificate: null,
    //   selectedDrivingLicense: null,
    //   selectedSltdaCertificate: null,
    //   selectedPoliceReport: null,
    // };
  }

  handleCancel() {
    this.sidebarService.sidebarEvent.emit(false);
  }
}
