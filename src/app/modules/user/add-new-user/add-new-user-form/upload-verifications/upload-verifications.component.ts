import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { WebcamViewComponent } from 'src/app/shared/components/webcam-view/webcam-view.component';
import { CommonForm } from 'src/app/shared/services/app-common-form';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-upload-verifications',
  templateUrl: './upload-verifications.component.html',
  styleUrls: ['./upload-verifications.component.scss']
})
export class UploadVerificationsComponent {
  FV = new CommonForm();

  value: any = { value: 0, label: 'Personal', routerLink: '/personal' }
  showingIndex: number = 0;
  profileImageUrl: string | ArrayBuffer | null = null;
  uploadImage: any = null;
  selectedProfileImage: File = null;

  constructor(
    private formBuilder: FormBuilder,
    private popUpService: PopupService
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      // fullName: [""],
      // userName: [""],
      // gender: [""],
      // dateOfBirth: [''],
      // address: [''],
      // nicNo: [''],
      // number1: [''],
      // number2: [''],
      // email: [''],
      // bankName: [''],
      // branchName: [''],
      // accNumber: [''],
      // accHolderName: [''],
      // accHolderAddress: [''],
      // basicSalary: [''],
      // leaveCount: [''],
      // languages: [''],
      // role: ['']
    });
  }

  ngOnInit(): void {

  }

  nextPage() { }

  onUpload(data: any) { }

  openUploadDialog() {
    this.popUpService
      .OpenModel(WebcamViewComponent, {
        header: "Capture Guest Image",
        width: "35vw",
        height: "35vh",
      })
      .subscribe((res) => {
        if (res.isSave) {
          this.uploadImage = res;
          this.profileImageUrl = res.imageUrl;
          this.selectedProfileImage = res.file;
        }
      });
  }

  removeImage() {
    this.uploadImage = null;
    this.profileImageUrl = null;
    this.selectedProfileImage = null;
  }

  submit() { }
}
