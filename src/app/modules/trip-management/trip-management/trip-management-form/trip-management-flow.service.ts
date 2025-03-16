import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TripManagementFlowService {
  request = {
    startDate: null,
    endDate: null,
    dateCount: null,
    totalCost: null,
    tripConfirmedNumber: null,
    isPaymentCollected: false,
    totalCostLocalCurrency: null,
    contactPerson: null,
    specialRequirement: null,
    paymentMode: null,
    estimatedExpense: null,
    passengers: [],
    arrivalInfo: null,
    departureInfo: null,
    pickUpInfo: null,
    dropOffInfo: null,
    activities: [],
    hotels: [],
    places: [],
    email: null,
    phoneNumber: null,
  };

  isFinishedStep0: boolean = false;
  isFinishedStep1: boolean = false;
  isFinishedStep2: boolean = false;

  isView: boolean = false;

  constructor() {}

  setData(data: any) {
    this.request = {
      ...this.request,
      ...data,
    };
  }

  getData() {
    return this.request;
  }

  clearData() {
    this.request = {
      startDate: null,
      endDate: null,
      tripConfirmedNumber: null,
      dateCount: null,
      totalCost: null,
      totalCostLocalCurrency: null,
      isPaymentCollected: false,
      contactPerson: null,
      specialRequirement: null,
      paymentMode: null,
      estimatedExpense: null,
      passengers: [],
      arrivalInfo: null,
      departureInfo: null,
      pickUpInfo: null,
      dropOffInfo: null,
      hotels: [],
      activities: [],
      places: [],
      email: null,
      phoneNumber: null,
    };

    this.isFinishedStep0 = false;
    this.isFinishedStep1 = false;
    this.isFinishedStep2 = false;

    this.isView = false;
  }

  setFinishedStep(step: number) {
    switch (step) {
      case 0:
        this.isFinishedStep0 = true;
        break;
      case 1:
        this.isFinishedStep1 = true;
        break;
      case 2:
        this.isFinishedStep2 = true;
        break;
    }
  }

  getFinishedStep() {
    return {
      step0: this.isFinishedStep0,
      step1: this.isFinishedStep1,
      step2: this.isFinishedStep2,
    };
  }

  setView(isView: boolean) {
    this.isView = isView;
  }

  getIsView() {
    return this.isView;
  }
}
