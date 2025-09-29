import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { SuperAdminLeaveFormComponent } from "./super-admin-leave-form/super-admin-leave-form.component";
import { AdminLeaveFormComponent } from "./admin-leave-form/admin-leave-form.component";
import { DriverLeaveFormComponent } from "./driver-leave-form/driver-leave-form.component";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";
import { MasterDataService } from "src/app/shared/services/master-data.service";

@Injectable({
  providedIn: "root",
})
export class RoleResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private masterDataService: MasterDataService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    // Get roleId from local storage (or another service)
    const roleId = this.masterDataService.Role;

    if (Number(roleId) === WellKnownUserRole.SUPERADMIN) {
      return of(SuperAdminLeaveFormComponent);
    } else if (
      Number(roleId) === WellKnownUserRole.ADMIN ||
      Number(roleId) === WellKnownUserRole.FINANCEOFFICER ||
      Number(roleId) === WellKnownUserRole.TRIPMANAGER
    ) {
      return of(AdminLeaveFormComponent);
    } else if (Number(roleId) === WellKnownUserRole.DRIVER) {
      return of(DriverLeaveFormComponent);
    } else {
      this.router.navigate(["/not-authorized"]);
      return of(null);
    }
  }
}
