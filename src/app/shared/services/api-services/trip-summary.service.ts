import { Injectable } from "@angular/core";
import { ResourceService } from "../resource.service";
import { DataAccessService } from "../data-access.service";

@Injectable({
  providedIn: "root",
})
export class TripSummaryService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  SaveTripSUmmary(body: any) {
    return this.dataAccess
      .POST(this.resource.tripSummary.save, body)
      .pipe((response) => {
        return response;
      });
  }

  GetAllByTrip(tripId: string) {
    return this.dataAccess
      .GET(this.resource.tripSummary.getByTripId + `/${tripId}`)
      .pipe((response) => {
        return response;
      });
  }

  GetById(id: string) {
    return this.dataAccess
      .GET(this.resource.tripSummary.getById + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }

  UpdateTripSummary(id: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.tripSummary.update + `/${id}`, body)
      .pipe((response) => {
        return response;
      });
  }

  DeleteTripSummaryById(id: string) {
    return this.dataAccess
      .DELETE(this.resource.tripSummary.deleteById + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }
}
