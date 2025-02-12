import { Injectable } from "@angular/core";
import { ResourceService } from "../resource.service";
import { DataAccessService } from "../data-access.service";

@Injectable({
  providedIn: "root",
})
export class InternalTripService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  SaveInternalTrip(body: any) {
    return this.dataAccess
      .POST(this.resource.internalTrip.save, body)
      .pipe((response) => {
        return response;
      });
  }

  GetInternalTripByVehicle(vehicleId: string) {
    return this.dataAccess
      .GET(this.resource.internalTrip.getByVehicle + `/${vehicleId}`)
      .pipe((response) => {
        return response;
      });
  }

  GetInternalTripById(internalTripId: string) {
    return this.dataAccess
      .GET(this.resource.internalTrip.getById + `/${internalTripId}`)
      .pipe((response) => {
        return response;
      });
  }

  UpdateInternalTrip(internalTripId: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.internalTrip.update + `/${internalTripId}`, body)
      .pipe((response) => {
        return response;
      });
  }

  DeleteInternalTripById(internalTripId: string) {
    return this.dataAccess
      .DELETE(this.resource.internalTrip.deleteById + `/${internalTripId}`)
      .pipe((response) => {
        return response;
      });
  }
}
