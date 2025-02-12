import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TripManagementRoutingModule } from "./trip-management-routing.module";
import { TripManagementComponent } from "./trip-management/trip-management.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from "primeng/checkbox";
import { PasswordModule } from "primeng/password";
import { SidebarModule } from "primeng/sidebar";
import { TableModule } from "primeng/table";
import { MultiSelectModule } from "primeng/multiselect";
import { TooltipModule } from "primeng/tooltip";
import { SelectButtonModule } from "primeng/selectbutton";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { DividerModule } from "primeng/divider";
import { AccordionModule } from "primeng/accordion";
import { RadioButtonModule } from "primeng/radiobutton";
import { SplitButtonModule } from "primeng/splitbutton";
import { MenuModule } from "primeng/menu";
import { ChartModule } from "primeng/chart";
import { AvatarModule } from "primeng/avatar";
import { InputTextareaModule } from "primeng/inputtextarea";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { OrderListModule } from "primeng/orderlist";
import { ChipsModule } from "primeng/chips";
import { CardModule } from "primeng/card";
import { ToggleButtonModule } from "primeng/togglebutton";
import { InputNumberModule } from "primeng/inputnumber";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { StepsModule } from "primeng/steps";
import { EditorModule } from "primeng/editor";
import { FieldsetModule } from "primeng/fieldset";
import { ChipModule } from "primeng/chip";
import { DataViewModule } from "primeng/dataview";
import { ImageModule } from "primeng/image";

import { TripManagementFormComponent } from "./trip-management/trip-management-form/trip-management-form.component";
import { GeneralInformationComponent } from "./trip-management/trip-management-form/general-information/general-information.component";
import { GuestInformationComponent } from "./trip-management/trip-management-form/guest-information/guest-information.component";
import { OtherInformationComponent } from "./trip-management/trip-management-form/other-information/other-information.component";
import { TripInformationsComponent } from "./trip-management/trip-management-form/trip-informations/trip-informations.component";
import { AddDriverAndVehicleFormComponent } from "./trip-management/add-driver-and-vehicle-form/add-driver-and-vehicle-form.component";
import { AddPlaceFormComponent } from "./trip-management/trip-management-form/trip-informations/add-place-form/add-place-form.component";
import { DynamicComponentLoaderComponent } from "./dynamic-component-loader/dynamic-component-loader.component";
import { TripManagementByDriverComponent } from "./trip-management-by-driver/trip-management-by-driver.component";
import { DriverTaskFormComponent } from "./trip-management-by-driver/driver-task-form/driver-task-form.component";
import { TripManagementPrintComponent } from "./trip-management-print/trip-management-print.component";
import { UpdateLocationFormComponent } from "./trip-management-by-driver/update-location-form/update-location-form.component";
import { TagModule } from "primeng/tag";
import { SharedModule } from "src/app/shared.module";
import { NgxPrintModule } from "ngx-print";
import { ExpenseManagementComponent } from "./expense-management/expense-management.component";
import { ExpenseManagementFormComponent } from "./expense-management/expense-management-form/expense-management-form.component";
import { DriverSalaryFormComponent } from "./trip-management/driver-salary-form/driver-salary-form.component";
import { ExpenseRequestFormComponent } from "./expense-management/expense-request-form/expense-request-form.component";
import { ExpenseRequestActionFormComponent } from "./expense-management/expense-request-action-form/expense-request-action-form.component";
import { DestinationSummaryPrintComponent } from "./trip-management/destination-summary-print/destination-summary-print.component";

@NgModule({
  declarations: [
    TripManagementComponent,
    TripManagementFormComponent,
    GeneralInformationComponent,
    GuestInformationComponent,
    OtherInformationComponent,
    TripInformationsComponent,
    AddDriverAndVehicleFormComponent,
    AddPlaceFormComponent,
    DynamicComponentLoaderComponent,
    TripManagementByDriverComponent,
    DriverTaskFormComponent,
    TripManagementPrintComponent,
    UpdateLocationFormComponent,
    ExpenseManagementComponent,
    ExpenseManagementFormComponent,
    DriverSalaryFormComponent,
    ExpenseRequestFormComponent,
    ExpenseRequestActionFormComponent,
    DestinationSummaryPrintComponent,
  ],
  imports: [
    CommonModule,
    TripManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    PasswordModule,
    SidebarModule,
    TableModule,
    MultiSelectModule,
    TooltipModule,
    SelectButtonModule,
    DropdownModule,
    CalendarModule,
    DividerModule,
    AccordionModule,
    RadioButtonModule,
    SplitButtonModule,
    MenuModule,
    ChartModule,
    AvatarModule,
    InputTextareaModule,
    OverlayPanelModule,
    OrderListModule,
    ChipsModule,
    CardModule,
    ToggleButtonModule,
    InputNumberModule,
    IconFieldModule,
    InputIconModule,
    InputGroupModule,
    InputGroupAddonModule,
    StepsModule,
    EditorModule,
    FieldsetModule,
    ChipModule,
    DataViewModule,
    TagModule,
    SharedModule,
    NgxPrintModule,
    NgxPrintModule,
    ImageModule,
  ],
})
export class TripManagementModule {}
