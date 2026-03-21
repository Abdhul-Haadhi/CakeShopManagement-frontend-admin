import { Component } from '@angular/core';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { AngularMaterailModules } from "../AngularMeterialModules";
import { NgIf } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardContent, MatFormField, MatLabel, AngularMaterailModules, NgIf, HttpClientModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  signupForm!: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ){

  }


  ngOnInit(): void{
    this.signupForm = this.fb.group({
      username: [null, [Validators.required]],
      email:[null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    })
  }


  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void{
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;

    if(password != confirmPassword){
      this.snackBar.open('Password does not match.', 'Close', {duration: 5000, panelClass: 'error-snackbar'});
      return;
    }

    this.authService.register(this.signupForm.value).subscribe({
      next: (response) => {
        this.snackBar.open('Sign up successfull', 'Close', {duration: 5000});
        this.router.navigateByUrl("/login");
      },
      error: (error) => {
        this.snackBar.open('Sign up failed. Please try again', 'Close', {duration: 5000});
      }
    });      
      
  }


}
