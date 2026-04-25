import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AngularMaterailModules } from "../AngularMeterialModules";
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { UserStorageService } from '../services/storage/user-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AngularMaterailModules, MatFormFieldModule, MatCard, MatCardContent, MatFormField, MatLabel, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  hidePassword = true;


  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {

  }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required,Validators.email]],
      password: [null, [Validators.required]]
    })
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }


  onSubmit(): void {
    const username = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;


    this.authService.login(username, password).subscribe({
      next: (response) => {

        this.snackBar.open('Login Success', 'Ok', {duration: 5000});
        this.router.navigateByUrl('dashboard');

        // if (UserStorageService.isAdminLoggedIn()) {
        //   this.router.navigateByUrl('dashboard');
        // }
        // else if(UserStorageService.isCustomerLoggedIn()){
        //   this.router.navigateByUrl('customer-dashboard')
        // }

      },
      error: (error) => {
        this.snackBar.open('Bad credintials', 'ERROR', { duration: 5000 });
      }
    })
  }

}
