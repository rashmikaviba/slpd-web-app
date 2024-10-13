import { Injectable } from "@angular/core";
import { ResourceService } from "../resource.service";
import { DataAccessService } from "../data-access.service";

@Injectable({
  providedIn: "root",
})
export class TripService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  SaveTrip(body: any) {
    return this.dataAccess
      .POST(this.resource.trip.saveTrip, body)
      .pipe((response) => {
        return response;
      });
  }

  GetAllTrips() {
    return this.dataAccess
      .GET(this.resource.trip.getAllTrips)
      .pipe((response) => {
        return response;
      });
  }

  GetTripById(tripId: string) {
    return this.dataAccess
      .GET(this.resource.trip.getTripById + `/${tripId}`)
      .pipe((response) => {
        return response;
      });
  }

  UpdateTrip(tripId: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.trip.updateTrip + `/${tripId}`, body)
      .pipe((response) => {
        return response;
      });
  }

  CancelTrip(tripId: string) {
    return this.dataAccess
      .DELETE(this.resource.trip.cancelTrip + `/${tripId}`, null)
      .pipe((response) => {
        return response;
      });
  }

  AssignDriverAndVehicle(tripId: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.trip.assignDriver + `/${tripId}`, body)
      .pipe((response) => {
        return response;
      });
  }
}
