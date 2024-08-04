import { Injectable } from "@angular/core";
import { WellKnownUploadType } from "src/app/shared/enums/well-known-upload-type.enum";

@Injectable({
  providedIn: "root",
})
export class AddUserControlFlowService {
  userDetail: any = {
    userId: 0,
    fullName: "",
    userName: "",
    gender: 0,
    dateOfBirth: "",
    address: "",
    phoneNumber1: "",
    phoneNumber2: "",
    email: "",
    profileImageUrl: "",
    nic: "",
    nicImageUrl: "",
    gsCertificateUrl: "",
    drivingLicenseUrl: "",
    sltdaCertificateUrl: "",
    policeReportUrl: "",
    bankName: "",
    branch: "",
    accountNumber: "",
    accountHolderName: "",
    accountHolderAddress: "",
    basicSalary: "",
    leaveCount: 0,
    languages: [],
    role: 0,
  };

  uploadedImages: any = {
    selectedProfileImage: null,
    selectedNicImage: null,
    selectedGsCertificate: null,
    selectedDrivingLicense: null,
    selectedSltdaCertificate: null,
    selectedPoliceReport: null,
  };

  isFirstStep: boolean = true;
  isSecondStep: boolean = false;
  isThirdStep: boolean = false;

  constructor() {}

  setUserDetail(userDetail: any) {
    this.userDetail = userDetail;
  }

  getUserDetail() {
    return this.userDetail;
  }

  setStepValue(step: number, value: boolean) {
    if (step === 0) {
      this.isFirstStep = value;
    } else if (step === 1) {
      this.isSecondStep = value;
    } else if (step === 2) {
      this.isThirdStep = value;
    }
  }

  getStepValue(step: number): boolean {
    if (step === 0) {
      return this.isFirstStep;
    } else if (step === 1) {
      return this.isSecondStep;
    } else if (step === 2) {
      return this.isThirdStep;
    } else {
      return false;
    }
  }

  setUploadImage(uploadType: number, file: any) {
    switch (uploadType) {
      case WellKnownUploadType.ProfileImage:
        this.uploadedImages.selectedProfileImage = file;
        break;
      case WellKnownUploadType.NICImage:
        this.uploadedImages.selectedNicImage = file;
        break;
      case WellKnownUploadType.GSCertificate:
        this.uploadedImages.selectedGsCertificate = file;
        break;
      case WellKnownUploadType.DrivingLicense:
        this.uploadedImages.selectedDrivingLicense = file;
        break;
      case WellKnownUploadType.SLTDACertificate:
        this.uploadedImages.selectedSltdaCertificate = file;
        break;
      case WellKnownUploadType.PoliceReport:
        this.uploadedImages.selectedPoliceReport = file;
        break;
    }
  }

  getUploadImage() {
    return this.uploadedImages;
  }
}
