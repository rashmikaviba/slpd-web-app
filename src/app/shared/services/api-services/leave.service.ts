import { Injectable } from "@angular/core";
import { ResourceService } from "../resource.service";
import { DataAccessService } from "../data-access.service";

@Injectable({
  providedIn: "root",
})
export class LeaveService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  ApplyLeave(body: any) {
    return this.dataAccess
      .POST(this.resource.leave.saveLeave, body)
      .pipe((response) => {
        return response;
      });
  }

  GetAllLeaves() {
    return this.dataAccess
      .GET(this.resource.leave.getAllLeaves)
      .pipe((response) => {
        return response;
      });
  }

  GetLeaveById(leaveId: string) {
    return this.dataAccess
      .GET(this.resource.leave.getLeaveById + `/${leaveId}`)
      .pipe((response) => {
        return response;
      });
  }

  ApproveLeave(leaveId: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.leave.approveLeave + `/${leaveId}`, body)
      .pipe((response) => {
        return response;
      });
  }

  RejectLeave(leaveId: string, body: any) {
    return this.dataAccess
      .PUT(this.resource.leave.rejectLeave + `/${leaveId}`, body)
      .pipe((response) => {
        return response;
      });
  }

  CancelLeave(leaveId: string, body: any) {
    return this.dataAccess
      .GET(this.resource.leave.cancel + `/${leaveId}`, body)
      .pipe((response) => {
        return response;
      });
  }

  GetLeaveCount() {
    return this.dataAccess
      .GET(this.resource.leave.getLeaveCount)
      .pipe((response) => {
        return response;
      });
  }
}
