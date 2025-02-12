import { Injectable } from "@angular/core";
import { ResourceService } from "../resource.service";
import { DataAccessService } from "../data-access.service";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private isNotificationsLoaded = false;
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  GetAllNotifications() {
    return this.dataAccess
      .GET(this.resource.notification.getAllNotifications)
      .pipe((response) => {
        return response;
      });
  }

  setNotificationLoaded(value: boolean) {
    this.isNotificationsLoaded = value;
  }

  getNotificationLoaded() {
    return this.isNotificationsLoaded;
  }
}
