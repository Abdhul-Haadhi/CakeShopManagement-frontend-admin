import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PostCategoryComponent } from './admin/components/post-category/post-category.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { ProductRegistrationComponent } from './pages/product-registration/product-registration.component';
import { EmployeeRegistrationComponent } from './pages/employee-registration/employee-registration.component';
import { noAuthGuard } from './no-auth.guard';
import { CustomerRegistrationComponent } from './pages/customer-registration/customer-registration.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { InventoryComponent } from './pages/inventory/inventory.component';




export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "login", component: LoginComponent, canActivate: [noAuthGuard]},
    {path: "dashboard", component: DashboardComponent, canActivate: [authGuard]},
    {path: "product-reg", component: ProductRegistrationComponent, canActivate: [authGuard]},
    {path: "employee-reg", component: EmployeeRegistrationComponent, canActivate: [authGuard]},
    {path: "customer-reg", component: CustomerRegistrationComponent, canActivate: [authGuard]},
    {path: "category", component: PostCategoryComponent},
    {path: "orders", component: OrdersComponent},
    {path: "inventory", component: InventoryComponent},
    
];
