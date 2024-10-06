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
    estimatedExpense: null,
    passengers: [],
    arrivalInfo: null,
    departureInfo: null,
    pickUpInfo: null,
    dropOffInfo: null,
    activities: [],
    hotels: [],
    email: null,
    phoneNumber: null,
  };

  isFinishedStep0: boolean = false;
  isFinishedStep1: boolean = false;
  isFinishedStep2: boolean = false;

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
      dateCount: null,
      totalCost: null,
      estimatedExpense: null,
      passengers: [],
      arrivalInfo: null,
      departureInfo: null,
      pickUpInfo: null,
      dropOffInfo: null,
      hotels: [],
      activities: [],
      email: null,
      phoneNumber: null,
    };
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
}
