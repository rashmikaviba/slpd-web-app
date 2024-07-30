import { Injectable } from "@angular/core";
import { DataAccessService } from "./data-access.service";
import { ResourceService } from "./resource.service";
import { PopupService } from "./popup.service";
import { MasterDataService } from "./master-data.service";
import { PrivilegeConfirmComponent } from "../components/privilege-confirm/privilege-confirm.component";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserPrivilegeGuardService {
  constructor(
    private masterDataService: MasterDataService,
    private popUpService: PopupService
  ) {}

  CheckUserPrivilegeIsAuthorized(privilegeId: any): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      let userPrivilegeList = this.masterDataService.UserLevelPrivilagesList;
      let privileges: any[] = userPrivilegeList?.split(",");

      if (privileges.includes(privilegeId.toString())) {
        observer.next(true);
        observer.complete();
      } else {
        this.GetAuthorization(privilegeId).subscribe((authorizationResult) => {
          observer.next(authorizationResult);
          observer.complete();
        });
      }
    });
  }

  GetAuthorization(privilegeId: any): Observable<boolean> {
    let data = {
      privilegeId: privilegeId,
    };

    return this.popUpService.OpenModel(PrivilegeConfirmComponent, {
      data: data,
      width: "35vw",
    });
  }
}
