import { Injectable } from "@angular/core";
import { DataAccessService } from "./data-access.service";
import { ResourceService } from "./resource.service";

@Injectable({
  providedIn: "root",
})
export class AuditTrailService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  GetGuestAuditTrail(guestId: number) {
    return this.dataAccess
      .GET(this.resource.auditTrail.getGuestAudit + `/${guestId}`)
      .pipe((result) => {
        return result;
      });
  }

  GetAllAuditTrailLog(
    bookingId: number,
    bookingRoomId: number,
    transactionType: number,
    roomId: number
  ) {
    return this.dataAccess
      .GET(
        this.resource.auditTrail.readAll +
          `/${bookingId}/${bookingRoomId}/${transactionType}/${roomId}`
      )
      .pipe((result) => {
        return result;
      });
  }

  GetAllHouseKeepingAuditTrailLog(
    id: number,
    type: any,
    isRoom: boolean,
    date: any
  ) {
    return this.dataAccess
      .GET(
        this.resource.auditTrail.readAll +
          `/${id}?type=${type}&isRoom=${isRoom}&date=${date}`
      )
      .pipe((result) => {
        return result;
      });
  }

  GetNightAudiTrailLog() {
    return this.dataAccess
      .GET(this.resource.auditTrail.getNightAudit)
      .pipe((result) => {
        return result;
      });
  }

  GetLostFoundAuditTrailLogById(lostFoundId: number) {
    return this.dataAccess
      .GET(this.resource.auditTrail.getLostFoundAudit + `/${lostFoundId}`)
      .pipe((result) => {
        return result;
      });
  }

  GetReportAuditTrail() {
    return this.dataAccess
      .GET(this.resource.auditTrail.getReportAudit)
      .pipe((result) => {
        return result;
      });
  }
}
