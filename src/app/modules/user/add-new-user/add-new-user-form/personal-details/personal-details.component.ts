import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonForm } from 'src/app/shared/services/app-common-form';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent {
  FV = new CommonForm();
  genders: any = [
    { name: 'Male' },
    { name: 'Female' },
    { name: 'Other' },
  ]
  // banks: any[] = [
  //   { name: 'BOC Bank' },
  //   { name: 'Commercial Bank' },
  //   { name: 'HNB Bank' },
  // ]
  // branch: any[] = [
  //   { name: 'Kadawatha' },
  //   { name: 'Kaduwela' },
  //   { name: 'Kiribathgoda' },
  // ]
  role: any[] = [
    { name: 'Admin' },
    { name: 'Cashier' },
    { name: 'Sales' },
  ]
  checked: boolean = false;
  value: any = { value: 0, label: 'Personal', routerLink: '/personal' }
  showingIndex: number = 0;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.createForm();
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      fullName: [""],
      userName: [""],
      gender: [""],
      dateOfBirth: [''],
      address: [''],
      nicNo: [''],
      number1: [''],
      number2: [''],
      email: [''],
      bankName: [''],
      branchName: [''],
      accNumber: [''],
      accHolderName: [''],
      accHolderAddress: [''],
      basicSalary: [''],
      leaveCount: [''],
      languages: [''],
      role: ['']
    });
  }

  ngOnInit(): void {

  }

  submit() { }

  onUpload(data: any) { }
}
