import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { WellKnownUserRole } from "src/app/shared/enums/well-known-user-role.enum";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { TripManagementComponent } from "./trip-management/trip-management.component";
import { TripManagementByDriverComponent } from "./trip-management-by-driver/trip-management-by-driver.component";

@Injectable({
  providedIn: "root",
})
export class RoleResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private masterDataService: MasterDataService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    // Get roleId from local storage (or another service)
    const roleId = this.masterDataService.Role;

    if (
      Number(roleId) === WellKnownUserRole.SUPERADMIN ||
      Number(roleId) === WellKnownUserRole.ADMIN ||
      Number(roleId) === WellKnownUserRole.TRIPMANAGER
    ) {
      return of(TripManagementComponent);
    } else if (Number(roleId) === WellKnownUserRole.DRIVER) {
      return of(TripManagementByDriverComponent);
    } else {
      this.router.navigate(["/not-authorized"]);
      return of(null);
    }
  }
}
