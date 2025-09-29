import { HelperService } from '../../../../shared/services/helper.service';
import { AfterViewInit, Component, OnInit, Output, ViewChild } from '@angular/core';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeDevice, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { EventEmitter } from '@angular/core';
import { delay, firstValueFrom } from 'rxjs';
import { AppMessageService } from 'src/app/shared/services/app-message.service';
import { TripService } from 'src/app/shared/services/api-services/trip.service';
import { TripManagementPrintComponent } from '../../trip-management-print/trip-management-print.component';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-trip-identifier',
  templateUrl: './trip-identifier.component.html',
  styleUrls: ['./trip-identifier.component.css']
})
export class TripIdentifierComponent implements AfterViewInit {
  public config: ScannerQRCodeConfig = {
    vibrate: 100,
    constraints: {
      video: {
        width: window.innerWidth
      }
    },
    isBeep: true,
    decode: 'utf8',
    isMasked: true,
  };

  qrResultString: any = null;

  tripInformation: any = null;

  @ViewChild('action') action: NgxScannerQrcodeComponent;

  constructor(private qrcode: NgxScannerQrcodeService,
    private messageService: AppMessageService,
    private helperService: HelperService,
    private tripService: TripService,
    private sidebarService: SidebarService,
    private ref: DynamicDialogRef
  ) { }

  ngAfterViewInit(): void {
    this.action.isReady.pipe(delay(1000)).subscribe(() => {
      this.handle(this.action, 'start');
    });
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    e?.length && action && action.pause(); // Detect once and pause scan!

    let binArrayToString = function (binArray) {
      let str = "";
      for (let i = 0; i < binArray.length; i++) {
        str += String.fromCharCode(parseInt(binArray[i]));
      }
      return str;
    }

    debugger
    try {

      let encryptedId = binArrayToString(e[0].data).split('/qr-invoice/')[1];

      this.qrResultString = this.helperService.base64GzipToJson(encryptedId);
    } catch (error) {
      this.qrResultString = null;
      this.messageService.showErrorAlert('Invalid QR Code');
      return;
    }

    if (this.qrResultString && this.checkMongoDBId(this.qrResultString)) {
      this.ref.close();
      this.onClickPrint(this.qrResultString);
    } else {
      this.messageService.showErrorAlert('Invalid QR Code');
      this.qrResultString = null;
    }
  }


  checkMongoDBId = (id: string): boolean => {
    const mongoDbIdPattern = /^[a-fA-F0-9]{24}$/;
    return mongoDbIdPattern.test(id);
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: ScannerQRCodeDevice[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe(
        (r: any) => console.log(fn, r),
        (err: any) => this.messageService.showErrorAlert(err?.message || 'Something went wrong')
      );
    } else {
      action[fn]().subscribe(
        (r: any) => console.log(fn, r),
        (err: any) => this.messageService.showErrorAlert(err?.message || 'Something went wrong')
      );
    }
  }

  onClickPrint(id: string) {
    try {
      this.tripService.GetTripForPrintByTripId(id).subscribe((response) => {
        if (response.IsSuccessful) {
          let data = response.Result;

          let properties = {
            width: "50vw",
            position: "right",
          };

          this.sidebarService.addComponent(
            "Print",
            TripManagementPrintComponent,
            properties,
            data
          );
        } else {
          this.messageService.showErrorAlert(response.Message);
        }
      });

    } catch (error) {
      this.messageService.showErrorAlert(error.message || error);
    }
  }
}