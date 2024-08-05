import { Injectable } from "@angular/core";
import { ResourceService } from "../resource.service";
import { DataAccessService } from "../data-access.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  checkUserNameExist(
    userName: string,
    userId: string,
    email: string,
    nic: string
  ) {
    return this.dataAccess
      .GET(
        this.resource.user.validateUser +
          `?userName=${userName}&id=${userId}&email=${email}&nic=${nic}`
      )
      .pipe((response) => {
        return response;
      });
  }

  saveUser(body: any) {
    return this.dataAccess
      .POST(this.resource.user.saveUser, body)
      .pipe((response) => {
        return response;
      });
  }

  getAllUsers() {
    return this.dataAccess
      .GET(this.resource.user.getAllUsers)
      .pipe((response) => {
        return response;
      });
  }

  getUserById(userId: string) {
    return this.dataAccess
      .GET(this.resource.user.getUserById + `/${userId}`)
      .pipe((response) => {
        return response;
      });
  }
}