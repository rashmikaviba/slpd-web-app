import { Injectable } from "@angular/core";
import { get } from "jquery";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ResourceService {
  constructor() {}

  public appHostURL: string = environment.appURL;
  private host: string = environment.apiURL;
  private wegaShineUrl: string = environment.wegaShineURL;

  private Auth = this.host + "/auth";
  private Store = this.host + "/store";
  private User = this.host + "/user";
  private Leave = this.host + "/leave";
  private MonthAudit = this.host + "/monthAudit";

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
    getWorkingInfo: this.MonthAudit + "/workingInfo",
  };

  wegaShine = {
    session: "/session",
    devices: "/devices",
  };
}
