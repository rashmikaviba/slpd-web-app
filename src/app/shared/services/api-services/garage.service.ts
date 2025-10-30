import { Injectable } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { ResourceService } from '../resource.service';

@Injectable({
  providedIn: 'root'
})
export class GarageService {

  constructor(private dataAccess: DataAccessService,
    private resource: ResourceService) { }

  SaveGarage(body: any) {
    return this.dataAccess
      .POST(this.resource.garage.save, body)
      .pipe((response) => {
        return response;
      });
  }

  GetAllGarages() {
    return this.dataAccess
      .GET(this.resource.garage.getAll)
      .pipe((response) => {
        return response;
      });
  }

  GetGarageById(id: string) {
    return this.dataAccess
      .GET(this.resource.garage.getById + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }

  UpdateGarage(id: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.garage.update + `/${id}`, body)
      .pipe((response) => {
        return response;
      });
  }

  DeleteGarage(id: string) {
    return this.dataAccess
      .DELETE(this.resource.garage.deleteById + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }

  ActiveInactiveGarage(garageId: string) {
    return this.dataAccess
      .PUT(
        this.resource.garage.activeInactiveGarages +
        `/${garageId}`,
        null
      )
      .pipe((response) => {
        return response;
      });
  }
}
