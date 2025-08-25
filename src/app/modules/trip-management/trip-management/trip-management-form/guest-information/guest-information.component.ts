import { CommonService } from "src/app/shared/services/api-services/common.service";
import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { forkJoin, lastValueFrom } from "rxjs";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { genders, nationalities } from "src/app/shared/data/commonData";
import { TripManagementFlowService } from "../trip-management-flow.service";
import { Table } from "primeng/table";

@Component({
  selector: "app-guest-information",
  templateUrl: "./guest-information.component.html",
  styleUrls: ["./guest-information.component.scss"],
})
export class GuestInformationComponent {
  @ViewChild("dt") guestTable!: Table;
  FV = new CommonForm();
  cols: any;
  recodes: any[] = [];
  isAddNewGuest: boolean = false;
  gender: any[] = genders;
  nationalities: any[] = nationalities;
  isView: boolean = false;

  isEditGuest: boolean = false;
  selectedGuestData: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private commonService: CommonService,
    private tripMgtFlowService: TripManagementFlowService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      gender: ["", [Validators.required]],
      nationality: ["", [Validators.required]],
      age: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
      guestName: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isView = this.tripMgtFlowService.getIsView();

    this.cols = [
      { field: "name", header: "Guest Name" },
      { field: "gender", header: "Gender" },
      { field: "nationality", header: "Nationality" },
      { field: "age", header: "Ages" },
    ];

    let data: any = JSON.parse(
      JSON.stringify(this.tripMgtFlowService.getData())
    ); //this.tripMgtFlowService.getData();
    if (data?.passengers) {
      this.recodes = data.passengers;
    } else {
      this.recodes = [];
    }
  }

  onClickAddNewGuest() {
    this.FV.formGroup.reset();
    this.isEditGuest = false;
    this.selectedGuestData = null;
    this.isAddNewGuest = !this.isAddNewGuest;
  }

  onClickSaveGuest() {
    let validateParams = "guestName,gender,nationality,age";
    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let formData = this.FV.formGroup.value;

    if (this.isAddNewGuest) {
      let obj = {
        _id: this.generateUniqueId(),
        name: formData.guestName,
        nationality: formData.nationality,
        age: formData.age,
        gender: formData.gender,
      };

      this.recodes.push(obj);
      this.FV.formGroup.reset();
      this.isAddNewGuest = !this.isAddNewGuest;
      this.guestTable.reset();
    } else if (this.isEditGuest && this.selectedGuestData) {
      let index = this.recodes.findIndex(
        (x) => x._id == this.selectedGuestData._id
      );

      if (index != -1 && index < this.recodes.length) {
        this.recodes[index].name = formData.guestName;
        this.recodes[index].nationality = formData.nationality;
        this.recodes[index].age = formData.age;
        this.recodes[index].gender = formData.gender;
      }
      this.FV.formGroup.reset();
      this.isEditGuest = !this.isEditGuest;
      this.selectedGuestData = null;
      this.guestTable.reset();
    }
  }

  onClickDeleteGuest(id: string) {
    let confirmationConfig = {
      message: "Are you sure you want to delete this guest?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.recodes = this.recodes.filter((x) => x._id != id);
          this.guestTable.reset();
        }
      }
    );
  }

  onClickCancelGuest() {
    this.FV.formGroup.reset();
    this.isAddNewGuest = false;
    this.isEditGuest = false;
    this.selectedGuestData = null;
  }

  generateUniqueId() {
    let generatedId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    while (this.recodes.findIndex((x) => x._id == generatedId) != -1) {
      generatedId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    }

    return generatedId;
  }

  onSaveAndMoveToNext() {
    this.onClickCancelGuest();
    if (this.recodes.length <= 0) {
      this.messageService.showWarnAlert(
        "Please add at least one guest to continue!"
      );
      return null;
    }

    return this.recodes;
  }

  onClickEditGuest(rowData: any) {
    this.FV.formGroup.reset();
    this.isEditGuest = true;
    this.isAddNewGuest = false;
    this.selectedGuestData = rowData;

    this.FV.formGroup.patchValue({
      guestName: rowData.name,
      gender: rowData.gender,
      nationality: rowData.nationality,
      age: rowData.age,
    });
  }
}
