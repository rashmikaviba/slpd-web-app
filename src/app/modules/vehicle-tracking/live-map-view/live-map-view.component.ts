import { Component } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { WegaShineService } from "src/app/shared/services/api-services/wega-shine.service";
import { AppMessageService } from "src/app/shared/services/app-message.service";
import { WegaShineSocketService } from "src/app/shared/services/socket-services/wega-shine-socket.service";

@Component({
  selector: "app-live-map-view",
  templateUrl: "./live-map-view.component.html",
  styleUrls: ["./live-map-view.component.scss"],
})
export class LiveMapViewComponent {
  devices: any[] = [];
  constructor(private messageService: AppMessageService) {
    // this.wegaShineSocketService.connect();
  }

  ngOnInit(): void {
    this.initialize();
  }

  async initialize() {
    try {
      // const response = await firstValueFrom(
      //   this.wegaShineService.Session(
      //     "email=0715213123%40wegashine.lk&password=wegashine12345"
      //   )
      // );
      // this.wegaShineSocketService.connect();
      // this.wegaShineSocketService.connect();
    } catch (error: any) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }
}
