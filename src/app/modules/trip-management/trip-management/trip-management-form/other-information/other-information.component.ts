import { DatePipe } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { TripManagementFlowService } from "../trip-management-flow.service";
import { Table } from "primeng/table";

@Component({
  selector: "app-other-information",
  templateUrl: "./other-information.component.html",
  styleUrls: ["./other-information.component.scss"],
})
export class OtherInformationComponent {
  @ViewChild("dt1") hotelTable!: Table;
  @ViewChild("dt12") activityTable!: Table;
  FV = new CommonForm();
  isEdit: any;
  cols: any;
  activityRecodes: any[] = [];
  isAddNewActivity: boolean = false;
  hotelCols: any;
  hotelRecords: any[] = [];
  isAddNewHotel: boolean = false;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  isView: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
    private tripMgtFlowService: TripManagementFlowService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      date: ["", [Validators.required]],
      adultCount: [0, [Validators.required, Validators.min(0)]],
      totalCost: ["", [Validators.required]],
      childCount: [0, [Validators.required, Validators.min(0)]],
      description: ["", [Validators.required]],
      isActivityPaymentByCompany: [false],

      hotelDate: ["", [Validators.required]],
      hotelName: ["", [Validators.required]],
      city: ["", [Validators.required]],
      isHotelPaymentByCompany: [false],
    });
  }

  ngOnInit(): void {
    this.isView = this.tripMgtFlowService.getIsView();

    this.cols = [
      { field: "date", header: "Date" },
      { field: "adultCount", header: "Adult" },
      { field: "childCount", header: "Child" },
      { field: "description", header: "Description" },
      { field: "totalCost", header: "Total Cost" },
      { field: "isPaymentByCompany", header: "Payment By Company" },
    ];

    this.hotelCols = [
      { field: "dates", header: "Date" },
      { field: "hotelName", header: "Hotel Name (Address)" },
      { field: "city", header: "City" },
      { field: "isPaymentByCompany", header: "Payment By Company" },
    ];

    let data: any = JSON.parse(
      JSON.stringify(this.tripMgtFlowService.getData())
    ); //this.tripMgtFlowService.getData();
    this.minDate = new Date(data.startDate);
    this.maxDate = new Date(data.endDate);

    if (data?.activities?.length > 0) {
      this.activityRecodes = data.activities;
    } else {
      this.activityRecodes = [];
    }

    if (data?.hotels.length > 0) {
      this.hotelRecords = data.hotels;
      this.hotelRecords.map((item: any) => {
        let dates: any[] = item.dates.split(",");
        let showDates = dates
          .map((x) => {
            return this.datePipe.transform(x, "MMM d", "Asia/Colombo");
          })
          .join(", ");
        item.showDates = showDates;
      });
    } else {
      this.hotelRecords = [];
    }
  }

  onClickAddNewActivity() {
    this.isAddNewActivity = true;
  }

  onClickSaveActivity() {
    let validateParams = "date,adultCount,childCount,totalCost,description";
    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let formData = this.FV.formGroup.value;

    let obj = {
      _id: this.generateUniqueId(this.activityRecodes),
      date: formData.date,
      description: formData.description,
      adultCount: formData.adultCount,
      childCount: formData.childCount,
      totalCost: formData.totalCost,
      isPaymentByCompany: formData.isActivityPaymentByCompany,
    };

    this.activityRecodes.push(obj);
    this.onClickCancelActivity();
    this.activityTable.reset();
  }

  onClickCancelActivity() {
    this.FV.clearValues("date,adultCount,childCount,totalCost,description");
    this.FV.setValue("adultCount", 0);
    this.FV.setValue("childCount", 0);
    this.FV.setValue("isActivityPaymentByCompany", false);
    this.isAddNewActivity = false;
  }

  onClickDeleteActivity(id: any) {
    let confirmationConfig = {
      message: "Are you sure you want to delete this activity? ",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    let selectedActivity = this.activityRecodes.find((x) => x._id == id);

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          if (
            selectedActivity?.isPaymentByCompany &&
            selectedActivity?.isPaymentDone
          ) {
            this.messageService.showErrorAlert(
              "Cannot delete this activity, because payment is already done!"
            );
            return;
          }

          this.activityRecodes = this.activityRecodes.filter(
            (x) => x._id != id
          );

          this.activityTable.reset();
        }
      }
    );
  }

  onClickAddNewHotel() {
    this.isAddNewHotel = true;
  }

  onClickSaveHotel() {
    let validateParams = "hotelDate,hotelName,city";
    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let formData = this.FV.formGroup.value;
    let dates = formData.hotelDate
      .map((x) => {
        return this.datePipe.transform(x, "yyyy-MM-dd", "Asia/Colombo");
      })
      .join(",");

    let showDates = formData.hotelDate
      .map((x) => {
        return this.datePipe.transform(x, "MMM d", "Asia/Colombo");
      })
      .join(", ");

    let obj = {
      _id: this.generateUniqueId(this.hotelRecords),
      dates: formData.hotelDate.length > 1 ? dates : dates,
      hotelName: formData.hotelName,
      city: formData.city,
      showDates: showDates,
      isPaymentByCompany: formData.isHotelPaymentByCompany,
    };

    this.hotelRecords.push(obj);
    this.onClickCancelHotel();
    this.hotelTable.reset();
  }

  onClickDeleteHotel(id: any) {
    let confirmationConfig = {
      message: "Are you sure you want to delete this hotel?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    };

    let selectedHotel = this.hotelRecords.find((x) => x._id == id);

    this.messageService.ConfirmPopUp(
      confirmationConfig,
      (isConfirm: boolean) => {
        if (isConfirm) {
          if (
            selectedHotel?.isPaymentByCompany &&
            selectedHotel?.isPaymentDone
          ) {
            this.messageService.showErrorAlert(
              "Cannot delete this hotel, because payment is already done!"
            );
            return;
          }

          this.hotelRecords = this.hotelRecords.filter((x) => x._id != id);
          this.hotelTable.reset();
        }
      }
    );
  }

  onClickCancelHotel() {
    this.FV.clearValues("hotelDate,hotelName,city,isHotelPaymentByCompany");
    this.FV.setValue("isHotelPaymentByCompany", false);
    this.isAddNewHotel = false;
  }

  generateUniqueId(recodes: any[]) {
    let generatedId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    while (recodes.findIndex((x) => x._id == generatedId) != -1) {
      generatedId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    }

    return generatedId;
  }

  onSave(): object {
    this.onClickCancelActivity();
    this.onClickCancelHotel();
    let hotelRecordsRemovingShowDates: any[] =
      this.hotelRecords.map((x) => {
        return {
          _id: x._id,
          dates: x.dates,
          hotelName: x.hotelName,
          city: x.city,
          isPaymentByCompany: x.isPaymentByCompany,
        };
      }) || [];

    return {
      activities: this.activityRecodes,
      hotels: hotelRecordsRemovingShowDates,
    };
  }
}
