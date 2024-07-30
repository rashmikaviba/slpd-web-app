import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { DataAccessService } from "./data-access.service";
import { MasterDataService } from "./master-data.service";
import { AppMessageService } from "./app-message.service";
import { ResourceService } from "./resource.service";
import { HelperService } from "./helper.service";

@Injectable()
export class TransactionHandlerService {
  ///Login service count
  TOTAL_SERVICERS_COUNT = 1;
  locations: any[] = [];
  loggedResID: any;

  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  GetVersionNo() {
    return this.dataAccess
      .GET(this.resource.common.getVersionNo)
      .pipe((result) => {
        return result;
      });
  }

  SignIn(body: any) {
    body.ClientId = "099153c2625149bc8ecb3e85e03f0022";

    var formBody: any = [];
    for (var property in body) {
      var encodedKey = property;
      var encodedValue = body[property];
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    return this.dataAccess
      .AUTH_POST(this.resource.auth.signIn, formBody)
      .pipe((result) => {
        return result;
      });
  }

  ReadSystemDate() {
    return this.dataAccess
      .GET(this.resource.system.getSystemWorkingDate)
      .pipe((result) => {
        return result;
      });
  }

  RefreshToken(body: any) {
    var formBody: any = [];

    for (var property in body) {
      var encodedKey = property;
      var encodedValue = body[property];
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return this.dataAccess.AUTH_POST(this.resource.auth.refreshToken, body);
  }

  UploadImage(imageStream: any, type: number) {
    return this.dataAccess
      .UPLOAD_IMAGE(
        this.resource.uploadFile.uploadFile + `?type=${type}`,
        imageStream
      )
      .pipe((result) => {
        return result;
      });
  }

  UploadFileToBookingRoom(imageStream: any, bookingRoomId: number) {
    return this.dataAccess
      .UPLOAD_IMAGE(
        this.resource.uploadFile.uploadFileBR +
          `?bookingRoomId=${bookingRoomId}`,
        imageStream
      )
      .pipe((result) => {
        return result;
      });
  }

  GetFIlesByParams(type: number, id: number) {
    return this.dataAccess
      .GET(this.resource.uploadFile.GetFilesByParam + `?type=${type}&id=${id}`)
      .pipe((result) => {
        return result;
      });
  }

  DeleteFile(id: number) {
    return this.dataAccess
      .DELETE(this.resource.uploadFile.deleteFile + `/${id}`)
      .pipe((result) => {
        return result;
      });
  }
}
