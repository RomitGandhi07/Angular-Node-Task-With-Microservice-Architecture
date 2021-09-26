import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddEditUserComponent } from './Admin/UserComponents/add-edit-user/add-edit-user.component';
import { MaterialModule } from './material/material.module';
import { UserListComponent } from './Admin/UserComponents/user-list/user-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { CellcustomComponent } from './Admin/UserComponents/cellcustom/cellcustom.component';
import { InitialscustomComponent } from './Admin/UserComponents/initialscustom/initialscustom.component';
import { CreateRoleFormComponent } from './Admin/RoleComponents/create-role-form/create-role-form.component';
import {  SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { RoleListComponent } from './Admin/RoleComponents/role-list/role-list.component';
import { CustomcellComponent } from './Admin/RoleComponents/customcell/customcell.component';

import { UserSidebarComponent } from './User/user-sidebar/user-sidebar.component';
import { HomeComponent } from './User/home/home.component';
import { NameListComponent } from './User/name-list/name-list.component';
import { CustomActionComponent } from './User/custom-action/custom-action.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditRoleFormComponent } from './Admin/RoleComponents/edit-role-form/edit-role-form.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';



@NgModule({
  declarations: [
    AppComponent,
    AddEditUserComponent,
    UserListComponent,
    CellcustomComponent,
    InitialscustomComponent,
    CreateRoleFormComponent,
    SidebarComponent,
    LoginComponent,
    RoleListComponent,
    CustomcellComponent,
    UserSidebarComponent,
    HomeComponent,
    NameListComponent,
    CustomActionComponent,
    PageNotFoundComponent,
  EditRoleFormComponent,
  BreadcrumbComponent,
  InternalServerErrorComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    HttpClientModule
],
  providers: [],
  entryComponents: [CellcustomComponent,InitialscustomComponent,CustomcellComponent, CustomActionComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
