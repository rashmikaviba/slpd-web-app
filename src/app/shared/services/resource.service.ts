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

  auth = {
    login: this.Auth + "/login",
    resetPassword: this.Auth + "/resetPassword",
    changePassword: this.Auth + "/changePassword",
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
  };
}
