import { Injectable } from '@angular/core';
import { ResourceService } from '../resource.service';
import { DataAccessService } from '../data-access.service';

@Injectable({
  providedIn: 'root'
})
export class PosService {

  constructor(private dataAccess: DataAccessService,
    private resource: ResourceService) { }

  SavePosTransaction(tripId: string, body: any) {
    return this.dataAccess
      .POST(this.resource.posTransaction.save + `/${tripId}`, body)
      .pipe((response) => {
        return response;
      });
  }

  VoidPosTransacrion(tripId: string, id: string) {
    return this.dataAccess
      .DELETE(this.resource.posTransaction.voidProduct + `/${id}/trip/${tripId}`, null)
      .pipe((response) => {
        return response;
      });
  }

  GetPosByTrip(tripId: string) {
    return this.dataAccess
      .GET(this.resource.posTransaction.getPosByTrip + `/${tripId}`)
      .pipe((response) => {
        return response;
      });
  }

  TripEndAudit(body: any) {
    return this.dataAccess
      .PUT(this.resource.posTransaction.tripEndAudit, body)
      .pipe((response) => {
        return response;
      });
  }




}
