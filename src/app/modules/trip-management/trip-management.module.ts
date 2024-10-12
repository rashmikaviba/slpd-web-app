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

import { TripManagementFormComponent } from "./trip-management/trip-management-form/trip-management-form.component";
import { GeneralInformationComponent } from "./trip-management/trip-management-form/general-information/general-information.component";
import { GuestInformationComponent } from "./trip-management/trip-management-form/guest-information/guest-information.component";
import { OtherInformationComponent } from "./trip-management/trip-management-form/other-information/other-information.component";
import { TripInformationsComponent } from "./trip-management/trip-management-form/trip-informations/trip-informations.component";
import { AddDriverAndVehicleFormComponent } from "./trip-management/add-driver-and-vehicle-form/add-driver-and-vehicle-form.component";
import { TripManagementByDriverComponent } from "./trip-management/trip-management-by-driver/trip-management-by-driver.component";
import { AddPlaceFormComponent } from "./trip-management/trip-management-form/trip-informations/add-place-form/add-place-form.component";

@NgModule({
  declarations: [
    TripManagementComponent,
    TripManagementFormComponent,
    GeneralInformationComponent,
    GuestInformationComponent,
    OtherInformationComponent,
    TripInformationsComponent,
    AddDriverAndVehicleFormComponent,
    TripManagementByDriverComponent,
    AddPlaceFormComponent,
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
  ],
})
export class TripManagementModule {}
