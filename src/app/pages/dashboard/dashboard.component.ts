import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NgIf, NgForOf } from "@angular/common";
import { UserStorageService } from '../../services/storage/user-storage.service';
import { Router, RouterLink } from '@angular/router';
import { ProductRegistrationService } from '../../services/productRegistration/product-registration.service';
import { MatCard } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { AngularMaterailModules } from "../../AngularMeterialModules";
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgForOf, MatCard, MatDividerModule, AngularMaterailModules, RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  products: any[] = [];
  searchProductForm!: FormGroup;

  isLoggedIn: boolean = UserStorageService.isAdminLoggedIn();

  constructor(private auth: AuthService,
    private prodService: ProductRegistrationService,
    private dashboardService: DashboardService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }



  getAllProducts() {
    this.products = [];
    this.prodService.getAllProducts().subscribe(response => {
      response.forEach(element => {
        element.processedImage = 'data:image/jpeg;base64,' + element.byteImage;
        this.products.push(element);
      })
    })
  }

  onSubmit() {
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
    this.dashboardService.getAllProductsByName(title).subscribe(response => {
      response.forEach(element => {
        element.processedImage = 'data:image/jpeg;base64,' + element.byteImage;
        this.products.push(element);
      })
    })
  }




  ngOnInit(): void {

    this.router.events.subscribe(() => {
      this.isLoggedIn = UserStorageService.isAdminLoggedIn();
    })

    this.getAllProducts();
    // this.auth.canAccess();

    this.searchProductForm = this.fb.group({
      title: [null]
    });
  }



  deleteProduct(productId: any) {
    this.dashboardService.deleteProduct(productId).subscribe(response => {
      if (response == null) {
        this.snackBar.open('Product deleted successfully', 'Close', { duration: 5000 });
        // this.getAllProducts();
        this.products = this.products.filter(p => p.productId !== productId);
      }
      else {
        this.snackBar.open(response.message, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    })
  }

}
