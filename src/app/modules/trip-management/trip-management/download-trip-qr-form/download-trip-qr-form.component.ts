import { HelperService } from './../../../../shared/services/helper.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-download-trip-qr-form',
  templateUrl: './download-trip-qr-form.component.html',
  styleUrls: ['./download-trip-qr-form.component.css']
})
export class DownloadTripQrFormComponent implements OnInit {
  tripInfo: string = '';
  tripNo: string = '';
  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;
  constructor(
    private config: DynamicDialogConfig,
    private helperService: HelperService
  ) { }

  ngOnInit() {
    this.tripNo = this.config.data?.tripInfo?.tripConfirmedNumber || '';
    let tripData = {
      id: this.config.data.tripInfo.id
    }

    this.tripInfo = this.helperService.jsonToBase64GzipCompress(tripData);
  }

  downloadQRCode() {
    const canvas = this.qrCanvas.nativeElement.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.tripNo}-QR.png`;
      a.click();
    }
  }
}
