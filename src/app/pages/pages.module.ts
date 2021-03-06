import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {DecimalPipe} from '@angular/common';

import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { TabsModule } from "ngx-bootstrap/tabs";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { AlertModule } from "ngx-bootstrap/alert";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { ModalModule } from "ngx-bootstrap/modal";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { PopoverModule } from "ngx-bootstrap/popover";
import { RangeSliderModule } from "ngx-range-slider";
import { NgxSpinnerModule } from "ngx-bootstrap-spinner";

import { IndexComponent } from "./index/index.component";
import { ProfilepageComponent } from "./examples/profilepage/profilepage.component";
import { RegisterpageComponent } from "./examples/registerpage/registerpage.component";
import { LandingpageComponent } from "./examples/landingpage/landingpage.component";
import { HomeComponent } from './vues/home/home.component';
import { ProviderComponent } from './vues/provider/provider.component';
import { ProjectComponent } from './vues/project/project.component';


import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table'; 
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { ReglesComponent } from './vues/regles/regles.component';
import { AttrProviderComponent } from './vues/attr-provider/attr-provider.component';
import { AtomComponent } from './vues/atom/atom.component';
import { ConditionComponent } from './vues/condition/condition.component';
import { PriceComponent } from './vues/price/price.component';
import { NavbarComponent } from './vues/navbar/navbar.component';
import { SpinnerComponent } from './vues/spinner/spinner.component';
import { FooterComponent } from './vues/footer/footer.component'; 

@NgModule({
  imports: [
    CommonModule,
    RangeSliderModule,
    BrowserModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxSpinnerModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    CollapseModule.forRoot(),
    JwBootstrapSwitchNg2Module,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule
  ],
  declarations: [
    IndexComponent,
    ProfilepageComponent,
    RegisterpageComponent,
    LandingpageComponent,
    HomeComponent,
    ProviderComponent,
    ProjectComponent,
    ReglesComponent,
    AttrProviderComponent,
    AtomComponent,
    ConditionComponent,
    PriceComponent,
    NavbarComponent,
    SpinnerComponent,
    FooterComponent
  ],
  exports: [
    IndexComponent,
    ProfilepageComponent,
    RegisterpageComponent,
    LandingpageComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DecimalPipe]
})
export class PagesModule {}
