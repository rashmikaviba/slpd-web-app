import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { FloatLabelModule } from 'primeng/floatlabel';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';
import { QRCodeModule } from 'angularx-qrcode';

import { VehicleMaintenanceRoutingModule } from './vehicle-maintenance-routing.module';
import { VehicleMaintenanceComponent } from './vehicle-maintenance/vehicle-maintenance.component';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { NgxPrintModule } from 'ngx-print';
import { TagModule } from 'primeng/tag';
import { SharedModule } from 'src/app/shared.module';
import { AddVehicleMaintenanceComponent } from './vehicle-maintenance/add-vehicle-maintenance/add-vehicle-maintenance.component';
import { VehicleMaintenanceInvoiceComponent } from './vehicle-maintenance/vehicle-maintenance-invoice/vehicle-maintenance-invoice.component';


@NgModule({
  declarations: [
    VehicleMaintenanceComponent,
    AddVehicleMaintenanceComponent,
    VehicleMaintenanceInvoiceComponent
  ],
  imports: [
    CommonModule,
    VehicleMaintenanceRoutingModule,
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
    FloatLabelModule,
    ImageModule,
    BadgeModule,
    QRCodeModule,
    NgxScannerQrcodeModule,
    FileUploadModule,
  ]
})
export class VehicleMaintenanceModule { }
