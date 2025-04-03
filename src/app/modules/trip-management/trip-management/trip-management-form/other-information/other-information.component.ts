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

  // FOr hotel Update
  selectedHotel: any = null;
  selectedActivity: any = null;

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
    if (this.selectedActivity != null) {
      this.onClickUpdateActivity();
      return;
    }

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
    this.reArrangeActivityRecords();
    this.activityTable.reset();
  }

  onClickEditActivity(id: any) {
    this.isAddNewActivity = true;
    let selectedActivity = this.activityRecodes.find((x) => x._id == id);
    this.selectedActivity = selectedActivity;
    this.FV.setValue("date", new Date(selectedActivity.date));
    this.FV.setValue("adultCount", selectedActivity.adultCount);
    this.FV.setValue("childCount", selectedActivity?.childCount);
    this.FV.setValue("totalCost", selectedActivity?.totalCost);
    this.FV.setValue("description", selectedActivity.description);
    this.FV.setValue(
      "isActivityPaymentByCompany",
      selectedActivity.isPaymentByCompany
    );
  }

  onClickUpdateActivity() {
    let validateParams = "date,adultCount,childCount,totalCost,description";
    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let selectedActivity = this.activityRecodes.find(
      (x) => x._id == this.selectedActivity._id
    );

    let formData = this.FV.formGroup.value;

    selectedActivity.date = formData.date;
    selectedActivity.description = formData.description;
    selectedActivity.adultCount = formData.adultCount;
    selectedActivity.childCount = formData.childCount;
    selectedActivity.totalCost = formData.totalCost;
    selectedActivity.isPaymentByCompany = formData.isActivityPaymentByCompany;

    this.isAddNewActivity = false;
    this.selectedActivity = null;
    this.reArrangeActivityRecords();
    this.activityTable.reset();
  }

  onClickCancelActivity() {
    this.FV.clearValues("date,adultCount,childCount,totalCost,description");
    this.FV.setValue("adultCount", 0);
    this.FV.setValue("childCount", 0);
    this.FV.setValue("isActivityPaymentByCompany", false);
    this.isAddNewActivity = false;
    this.selectedActivity = null;
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

          this.reArrangeActivityRecords();
          this.activityTable.reset();
        }
      }
    );
  }

  onClickAddNewHotel() {
    this.isAddNewHotel = true;
  }

  onClickSaveHotel() {
    if (this.selectedHotel != null) {
      this.updateHotel();
      return;
    }

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
    this.reArrangeHotelRecords();
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
          this.reArrangeHotelRecords();

          this.hotelTable.reset();
        }
      }
    );
  }

  onClickEditHotel(id: any) {
    this.isAddNewHotel = true;
    let selectedHotel = this.hotelRecords.find((x) => x._id == id);
    this.selectedHotel = selectedHotel;
    this.FV.setValue(
      "hotelDate",
      selectedHotel.dates.split(",").map((x) => new Date(x))
    );
    this.FV.setValue("hotelName", selectedHotel.hotelName);
    this.FV.setValue("city", selectedHotel.city);
    this.FV.setValue(
      "isHotelPaymentByCompany",
      selectedHotel.isPaymentByCompany
    );
  }

  updateHotel() {
    let validateParams = "hotelDate,hotelName,city";
    if (this.FV.validateControllers(validateParams)) {
      return;
    }

    let selectedHotel = this.hotelRecords.find(
      (x) => x._id == this.selectedHotel._id
    );

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

    selectedHotel.dates = formData.hotelDate.length > 1 ? dates : dates;
    selectedHotel.hotelName = formData.hotelName;
    selectedHotel.city = formData.city;
    selectedHotel.showDates = showDates;
    selectedHotel.isPaymentByCompany = formData.isHotelPaymentByCompany;
    this.isAddNewHotel = false;
    this.selectedHotel = null;
    this.hotelTable.reset();

    this.reArrangeHotelRecords();
  }

  onClickCancelHotel() {
    this.FV.clearValues("hotelDate,hotelName,city,isHotelPaymentByCompany");
    this.FV.setValue("isHotelPaymentByCompany", false);
    this.isAddNewHotel = false;
    this.selectedHotel = null;
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
    debugger;
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

  reArrangeHotelRecords() {
    this.hotelRecords.sort((a, b) => {
      let earliestDateA: any = new Date(
        a.dates
          .split(",")
          .map((date) => date.trim())
          .sort()[0]
      );
      let earliestDateB: any = new Date(
        b.dates
          .split(",")
          .map((date) => date.trim())
          .sort()[0]
      );

      return earliestDateA - earliestDateB; // Sort in ascending order
    });
  }

  reArrangeActivityRecords() {
    this.activityRecodes.sort((a, b) => {
      let earliestDateA: any = new Date(a.date);
      let earliestDateB: any = new Date(b.date);
      return earliestDateA - earliestDateB; // Sort in ascending order
    });
  }
}
