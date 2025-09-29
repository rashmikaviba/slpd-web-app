import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { Router } from '@angular/router';
import { TripService } from '../../services/api-services/trip.service';
import { SidebarService } from '../../services/sidebar.service';
import { AppMessageService } from '../../services/app-message.service';
import { CompanyInformation } from '../../data/companyInformation';

@Component({
  selector: 'app-qr-info',
  templateUrl: './qr-info.component.html',
  styleUrls: ['./qr-info.component.css']
})
export class QrInfoComponent implements OnInit {
  companyInformation: any = CompanyInformation;
  currentTime = new Date();
  tripInfo: any = null;
  constructor(
    private helperService: HelperService,
    private router: Router,
    private tripService: TripService,
    private sidebarService: SidebarService,
    private messageService: AppMessageService,
  ) { }

  ngOnInit() {
    try {
      let currentUrl = this.router.url;
      let qrData = currentUrl.split('/qr-invoice/')[1];

      debugger
      qrData = decodeURIComponent(qrData || '');

      let decodedId = this.helperService.base64GzipToJson(qrData);

      if (decodedId) {
        this.onClickPrint(decodedId);
      } else {
        this.messageService.showErrorAlert('Invalid QR data, contact support!');
        this.router.navigate(['/'], { replaceUrl: true });
      }
    } catch (error) {
      this.messageService.showErrorAlert('Invalid QR data, contact support!');
      this.router.navigate(['/'], { replaceUrl: true });
    }
  }

  onClickPrint(id: any) {
    try {
      this.tripService.GetTripForQRByTripId(id).subscribe((response) => {
        if (response.IsSuccessful) {
          this.tripInfo = response.Result;

        } else {
          this.messageService.showErrorAlert("Invalid QR data, contact support!");
          this.router.navigate(['/'], { replaceUrl: true });
        }
      });

    } catch (error) {
      this.messageService.showErrorAlert("Invalid QR data, contact support!");
      this.router.navigate(['/'], { replaceUrl: true });
    }
  }

}
