import { Injectable } from '@angular/core';
import { ResourceService } from '../resource.service';
import { DataAccessService } from '../data-access.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleMaintenanceService {

  constructor(private dataAccess: DataAccessService,
    private resource: ResourceService) { }

  SaveVehicleMaintenance(body: any) {
    return this.dataAccess
      .POST(this.resource.vehicleMaintenance.save, body)
      .pipe((response) => {
        return response;
      });
  }

  GetAllVehicleMaintenances(startDate?: string, endDate?: string) {
    return this.dataAccess
      .GET(this.resource.vehicleMaintenance.getAll + `?startDate=${startDate}&endDate=${endDate}`)
      .pipe((response) => {
        return response;
      });
  }

  GetVehicleMaintenanceById(maintenanceId: string) {
    return this.dataAccess
      .GET(this.resource.vehicleMaintenance.getById + `/${maintenanceId}`)
      .pipe((response) => {
        return response;
      });
  }

  UpdateVehicleMaintenance(maintenanceId: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.vehicleMaintenance.update + `/${maintenanceId}`, body)
      .pipe((response) => {
        return response;
      });
  }

  DeleteVehicleMaintenanceById(maintenanceId: string) {
    return this.dataAccess
      .DELETE(this.resource.vehicleMaintenance.deleteById + `/${maintenanceId}`)
      .pipe((response) => {
        return response;
      });
  }

  GenerateMaintenanceInvoice(maintenanceId: string) {
    return this.dataAccess
      .GET(this.resource.vehicleMaintenance.maintenanceInvoice + `/${maintenanceId}`)
      .pipe((response) => {
        return response;
      });
  }

}
