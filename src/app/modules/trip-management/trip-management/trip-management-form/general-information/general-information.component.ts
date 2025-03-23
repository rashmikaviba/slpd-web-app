import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonForm } from "src/app/shared/services/app-common-form";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { SidebarService } from "src/app/shared/services/sidebar.service";
import { TripManagementFlowService } from "../trip-management-flow.service";
import { paymentMethod } from "src/app/shared/data/commonData";

@Component({
  selector: "app-general-information",
  templateUrl: "./general-information.component.html",
  styleUrls: ["./general-information.component.scss"],
})
export class GeneralInformationComponent {
  FV = new CommonForm();
  minStartDate: string = "";
  minEndDate: string = "";
  paymentMethodArr: any = paymentMethod;
  isView: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private messageService: AppMessageService,
    private tripMgtFlowService: TripManagementFlowService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      // general information
      tripConfirmedNumber: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      dateCount: ["", [Validators.required]],
      estimatedCost: [""],
      totalIncome: ["", [Validators.required]],
      totalIncomeLocalCurrency: ["", [Validators.required]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
          ),
        ],
      ],
      mobile: ["", [Validators.required]],
      contactPerson: ["", [Validators.required]],
      specialRequirement: ["", [Validators.max(500)]],
      paymentMode: [null, [Validators.required]],
      isPaymentCollected: [false],

      // arrival information
      isArrivalAdded: [false],
      arrivalDate: ["", [Validators.required]],
      arrivalTime: ["", [Validators.required]],
      arrivalFlightNumber: ["", [Validators.required]],

      // departure information
      isDepartureAdded: [false],
      departureDate: ["", [Validators.required]],
      departureTime: ["", [Validators.required]],
      departureFlightNumber: ["", [Validators.required]],

      // pickup information
      isPickupAdded: [false],
      pickUpDate: ["", [Validators.required]],
      pickUpTime: ["", [Validators.required]],
      pickUpCity: ["", [Validators.required]],
      pickUpAddress: ["", [Validators.required]],

      // drop off information
      isDropOffAdded: [false],
      dropOffDate: ["", [Validators.required]],
      dropOffTime: ["", [Validators.required]],
      dropOffCity: ["", [Validators.required]],
      dropOffAddress: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.FV.disableField("dateCount");

    let today = new Date();
    this.minStartDate = this.datePipe.transform(today, "yyyy-MM-dd");
    this.minEndDate = this.datePipe.transform(today, "yyyy-MM-dd");

    this.isView = this.tripMgtFlowService.getIsView();

    this.setValues();
  }

  onChangeDate() {
    let startDate = this.FV.getValue("startDate");
    let endDate = this.FV.getValue("endDate");

    if (startDate) {
      this.minEndDate = startDate;
    }

    if (startDate && endDate && startDate < endDate) {
      this.FV.setValue("dateCount", this.calcDateCount(startDate, endDate));
    } else {
      this.FV.setValue("dateCount", 0);
      this.FV.setValue("endDate", "");
    }
  }

  calcDateCount(startDate: string, endDate: string): Number {
    debugger;
    let sDate = new Date(startDate);
    let eDate = new Date(endDate);
    let timeDiff = eDate.getTime() - sDate.getTime();
    let dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (dayDiff == 0) {
      dayDiff = 1;
    }

    return dayDiff;
  }

  setValues() {
    let data: any = JSON.parse(
      JSON.stringify(this.tripMgtFlowService.getData())
    ); //this.tripMgtFlowService.getData();

    if (data?.tripConfirmedNumber) {
      this.FV.setValue("tripConfirmedNumber", data?.tripConfirmedNumber);
    }

    if (data?.isPaymentCollected) {
      this.FV.setValue("isPaymentCollected", data?.isPaymentCollected);
    }

    if (data?.startDate) {
      this.FV.setValue(
        "startDate",
        this.datePipe.transform(new Date(data?.startDate), "yyyy-MM-dd")
      );
    }

    if (data?.endDate) {
      this.FV.setValue(
        "endDate",
        this.datePipe.transform(new Date(data?.endDate), "yyyy-MM-dd")
      );
    }

    if (data?.dateCount) {
      this.FV.setValue("dateCount", data?.dateCount);
    }

    if (data?.estimatedExpense) {
      this.FV.setValue("estimatedCost", data?.estimatedExpense);
    }

    if (data?.specialRequirement) {
      this.FV.setValue("specialRequirement", data?.specialRequirement);
    }
    if (data?.paymentMode) {
      this.FV.setValue("paymentMode", data?.paymentMode);
    }

    if (data?.contactPerson) {
      this.FV.setValue("contactPerson", data?.contactPerson);
    }

    if (data?.totalCost) {
      this.FV.setValue("totalIncome", data?.totalCost);
    }

    if (data?.totalCostLocalCurrency) {
      this.FV.setValue(
        "totalIncomeLocalCurrency",
        data?.totalCostLocalCurrency
      );
    }

    if (data?.email) {
      this.FV.setValue("email", data?.email);
    }

    if (data?.phoneNumber) {
      this.FV.setValue("mobile", data?.phoneNumber);
    }

    if (data?.arrivalInfo) {
      this.FV.setValue("isArrivalAdded", true);
      this.FV.setValue(
        "arrivalDate",
        this.datePipe.transform(
          new Date(data?.arrivalInfo?.arrivalDate),
          "yyyy-MM-dd"
        )
      );
      this.FV.setValue(
        "arrivalTime",
        this.datePipe.transform(
          new Date(data?.arrivalInfo?.arrivalTime),
          "HH:mm"
        )
      );
      this.FV.setValue(
        "arrivalFlightNumber",
        data?.arrivalInfo?.arrivalFlightNumber
      );
    }

    if (data?.departureInfo) {
      this.FV.setValue("isDepartureAdded", true);
      this.FV.setValue(
        "departureDate",
        this.datePipe.transform(
          new Date(data?.departureInfo?.departureDate),
          "yyyy-MM-dd"
        )
      );
      this.FV.setValue(
        "departureTime",
        this.datePipe.transform(
          new Date(data?.departureInfo?.departureTime),
          "HH:mm"
        )
      );
      this.FV.setValue(
        "departureFlightNumber",
        data?.departureInfo?.departureFlightNumber
      );
    }

    if (data?.pickUpInfo) {
      this.FV.setValue("isPickupAdded", true);
      this.FV.setValue(
        "pickUpDate",
        this.datePipe.transform(
          new Date(data?.pickUpInfo?.pickupDate),
          "yyyy-MM-dd"
        )
      );
      this.FV.setValue(
        "pickUpTime",
        this.datePipe.transform(new Date(data?.pickUpInfo?.pickupTime), "HH:mm")
      );
      this.FV.setValue("pickUpCity", data?.pickUpInfo?.pickupCity);
      this.FV.setValue("pickUpAddress", data?.pickUpInfo?.pickupAddress);
    }

    if (data?.dropOffInfo) {
      this.FV.setValue("isDropOffAdded", true);
      this.FV.setValue(
        "dropOffDate",
        this.datePipe.transform(
          new Date(data?.dropOffInfo?.dropOffDate),
          "yyyy-MM-dd"
        )
      );
      this.FV.setValue(
        "dropOffTime",
        this.datePipe.transform(
          new Date(data?.dropOffInfo?.dropOffTime),
          "HH:mm"
        )
      );
      this.FV.setValue("dropOffCity", data?.dropOffInfo?.dropOffCity);
      this.FV.setValue("dropOffAddress", data?.dropOffInfo?.dropOffAddress);
    }

    if (this.isView) {
      this.FV.disableFormControlls();
    }
  }

  onSave() {
    let isArrivalAdded = this.FV.getValue("isArrivalAdded");
    let isDepartureAdded = this.FV.getValue("isDepartureAdded");
    let isPickupAdded = this.FV.getValue("isPickupAdded");
    let isDropOffAdded = this.FV.getValue("isDropOffAdded");

    // genaral information validation
    let validateParams =
      "tripConfirmedNumber,startDate,endDate,dateCount,estimatedCost,totalIncome,totalIncomeLocalCurrency,email,mobile,contactPerson,specialRequirement,paymentMode,isPaymentCollected";

    // // add arrival departure pickup drop off validations
    if (isArrivalAdded) {
      validateParams +=
        ",isArrivalAdded,arrivalDate,arrivalTime,arrivalFlightNumber";
    }
    if (isDepartureAdded) {
      validateParams +=
        ",isDepartureAdded,departureDate,departureTime,departureFlightNumber";
    }
    if (isPickupAdded) {
      validateParams +=
        ",isPickupAdded,pickUpDate,pickUpTime,pickUpCity,pickUpAddress";
    }
    if (isDropOffAdded) {
      validateParams +=
        ",isDropOffAdded,dropOffDate,dropOffTime,dropOffCity,dropOffAddress";
    }

    if (this.FV.validateControllers(validateParams)) {
      return null;
    }

    let formData = this.FV.formGroup.value;
    let dateCount = this.FV.getValue("dateCount");
    let request = {
      tripConfirmedNumber: formData?.tripConfirmedNumber,
      startDate: formData?.startDate,
      endDate: formData?.endDate,
      dateCount: dateCount,
      contactPerson: formData?.contactPerson,
      totalCost: formData?.totalIncome || 0,
      totalCostLocalCurrency: formData?.totalIncomeLocalCurrency || 0,
      estimatedExpense: formData?.estimatedCost || 0,
      arrivalInfo: isArrivalAdded
        ? {
            arrivalDate: formData?.arrivalDate,
            arrivalTime: formData?.arrivalDate + " " + formData?.arrivalTime,
            arrivalFlightNumber: formData?.arrivalFlightNumber,
          }
        : null,
      departureInfo: isDepartureAdded
        ? {
            departureDate: formData?.departureDate,
            departureTime:
              formData?.departureDate + " " + formData?.departureTime,
            departureFlightNumber: formData?.departureFlightNumber,
          }
        : null,
      pickUpInfo: isPickupAdded
        ? {
            pickupDate: formData?.pickUpDate,
            pickupTime: formData?.pickUpDate + " " + formData?.pickUpTime,
            pickupCity: formData?.pickUpCity,
            pickupAddress: formData?.pickUpAddress,
          }
        : null,
      dropOffInfo: isDropOffAdded
        ? {
            dropOffDate: formData?.dropOffDate,
            dropOffTime: formData?.dropOffDate + " " + formData?.dropOffTime,
            dropOffCity: formData?.dropOffCity,
            dropOffAddress: formData?.dropOffAddress,
          }
        : null,
      email: formData?.email,
      phoneNumber: formData?.mobile,
      specialRequirement: formData?.specialRequirement || "",
      paymentMode: formData?.paymentMode || "Cash",
      isPaymentCollected: formData?.isPaymentCollected || false,
    };

    debugger;
    return request;
  }
}
