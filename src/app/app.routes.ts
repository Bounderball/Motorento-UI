import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserComponent } from "./user/user.component";
import { HomeComponent } from "./user/home/home.component";
import { ContactComponent } from "./user/contact/contact.component";
import { LoginComponent } from "./user/login/login.component";
import { RegisterComponent } from "./user/register/register.component";
import { CatalogComponent } from "./user/catalog/catalog.component";
import { RentComponent } from "./user/rent/rent.component";
import { HistoryComponent } from "./user/history/history.component";

import { EmployeeComponent } from "./employee/employee.component";

import { AdminComponent } from "./admin/admin.component";
import { ManageOrdersComponent } from "./admin/manage-orders/manage-orders.component";
import { ManageCarsComponent } from "./admin/manage-cars/manage-cars.component";
import { ManageModelsComponent } from "./admin/manage-models/manage-models.component";
import { ManageUsersComponent } from "./admin/manage-users/manage-users.component";

import { EditOrderComponent } from "./admin/edit-order/edit-order.component";
import { EditModelComponent } from "./admin/edit-model/edit-model.component";

import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { EditCarComponent } from "./admin/edit-car/edit-car.component";
import { EditUserComponent } from "./admin/edit-user/edit-user.component";


export const myRoutes:Routes=[
    {path:"",redirectTo:"user/home",pathMatch:'full'},
    {path:"user",component:UserComponent,children:[
        {path:"",redirectTo:"home",pathMatch:'full'},
        {path:"home",component:HomeComponent},
        {path:"contact",component:ContactComponent},
        {path:"login",component:LoginComponent},
        {path:"register",component:RegisterComponent},
        {path:"catalog",component:CatalogComponent},
        {path:"rent",component:RentComponent},
        {path:"history",component:HistoryComponent}
    ]},
    {path:"employee",component:EmployeeComponent},
    {path:"admin",component:AdminComponent,children:[
        {path:"",redirectTo:"manage-orders",pathMatch:'full'},
        {path:"manage-orders",component:ManageOrdersComponent},
        {path:"manage-cars",component:ManageCarsComponent},
        {path:"manage-models",component:ManageModelsComponent},
        {path:"manage-users",component:ManageUsersComponent},
        {path:"edit-order",component:EditOrderComponent},
        {path:"edit-car",component:EditCarComponent},
        {path:"edit-model",component:EditModelComponent},
        {path:"edit-user",component:EditUserComponent}
    ]},
    {path:"**",component:PageNotFoundComponent}
];

export const myRouting:ModuleWithProviders<any>=RouterModule.forRoot(myRoutes);