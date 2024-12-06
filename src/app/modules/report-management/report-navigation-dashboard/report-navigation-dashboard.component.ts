import { CommonForm } from './../../../shared/services/app-common-form';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { reportData } from 'src/app/shared/data/reportData';

@Component({
  selector: 'app-report-navigation-dashboard',
  templateUrl: './report-navigation-dashboard.component.html',
  styleUrls: ['./report-navigation-dashboard.component.css']
})
export class ReportNavigationDashboardComponent implements OnInit {
  reports: any[] = reportData
  activeIndex: number = 0
  FV = new CommonForm()
  constructor(private formBuilder: FormBuilder) {
    this.createForm()
  }

  ngOnInit() {
    this.FV.clearValues("month");
    let today = new Date();
    this.FV.setValue("month", today);
  }

  createForm() {
    this.FV.formGroup = this.formBuilder.group({
      month: [""],
    });
  }

  activeIndexChange(event: any) {
    this.FV.clearValues("month");
    let today = new Date();
    this.FV.setValue("month", today);
    this.activeIndex = event
  }
}
