import { Injectable } from "@angular/core";
import { get } from "jquery";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ResourceService {
  constructor() {}

  public appHostURL: string = environment.appURL;

  private Auth = "/auth";
  private Store = "/store";
  private User = "/user";
  private Leave = "/leave";
  private MonthAudit = "/monthAudit";

  auth = {
    login: this.Auth + "/login",
    resetPassword: this.Auth + "/resetPassword",
    changePassword: this.Auth + "/changePassword",
    refreshAuth: this.Auth + "/refreshAuth",
  };

  store = {
    uploadFile: this.Store + "/upload",
    uploadMultipleFiles: this.Store + "/uploadMultiple",
  };

  user = {
    validateUser: this.User + "/validateUser",
    saveUser: this.User,
    getAllUsers: this.User,
    getUserById: this.User,
    blockUser: this.User + "/block",
    unblockUser: this.User + "/unblock",
    updateUser: this.User,
    deleteUser: this.User,
  };

  leave = {
    saveLeave: this.Leave + "/apply",
    getAllLeaves: this.Leave,
    getLeaveById: this.Leave,
    approveLeave: this.Leave + "/approve",
    rejectLeave: this.Leave + "/reject",
    cancel: this.Leave + "/cancel",
    getLeaveCount: this.Leave + "/leaveCount",
    updateLeave: this.Leave + "/update",
    getEligibleLeaveForAdmin: this.Leave + "/eligibleLeaves",
  };

  monthAudit = {
    getPendingLeaves: this.MonthAudit + "/pendingLeaves",
    createNewMonth: this.MonthAudit + "/createNewMonth",
    getWorkingInfo : this.MonthAudit + "/workingInfo"
  };
}
