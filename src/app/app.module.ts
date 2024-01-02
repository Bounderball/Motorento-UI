import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { myRouting } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './user/home/home.component';
import { ContactComponent } from './user/contact/contact.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { CatalogComponent } from './user/catalog/catalog.component';
import { HistoryComponent } from './user/history/history.component';
import { EmployeeComponent } from './employee/employee.component';
import { AdminComponent } from './admin/admin.component';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { ManageCarsComponent } from './admin/manage-cars/manage-cars.component';
import { ManageModelsComponent } from './admin/manage-models/manage-models.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GearPipe } from './Gear.pipe';
import { RentComponent } from './user/rent/rent.component';
import { EditOrderComponent } from './admin/edit-order/edit-order.component';
import { EditModelComponent } from './admin/edit-model/edit-model.component';
import { EditCarComponent } from './admin/edit-car/edit-car.component';
import { InWorkingOrderPipe } from './inWorkingOrder.pipe';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { SexPipe } from './Sex.pipe';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    HomeComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    CatalogComponent,
    HistoryComponent,
    EmployeeComponent,
    AdminComponent,
    ManageOrdersComponent,
    ManageCarsComponent,
    ManageModelsComponent,
    ManageUsersComponent,
    PageNotFoundComponent,
    GearPipe,
    SexPipe,
    RentComponent,
    EditOrderComponent,
    EditModelComponent,
    EditCarComponent,
    InWorkingOrderPipe,
    EditUserComponent
  ],
  imports: [
    BrowserModule,FormsModule,myRouting,HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
