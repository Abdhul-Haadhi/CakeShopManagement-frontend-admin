import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AngularMaterailModules } from "../../../AngularMeterialModules";
import { NgIf } from "@angular/common";
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from '../../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeRegistrationService } from '../../../services/employeeRegistration/employee-registration.service';

@Component({
  selector: 'app-reg-dialog',
  standalone: true,
  imports: [FormsModule, AngularMaterailModules, NgIf, MatFormFieldModule, MatFormField, ReactiveFormsModule],
  templateUrl: './reg-dialog.component.html',
  styleUrl: './reg-dialog.component.scss'
})
export class RegDialogComponent implements OnInit {

  public title: string = '';
  public loginDetailsForm: FormGroup;
  submitted = false;
  buttonLabel: string = 'Save';
  loginData: any;
  hidePassword = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private httpService: HttpService,
    private _dialogRef: MatDialogRef<RegDialogComponent>,
    private empRegService: EmployeeRegistrationService,
    private snackBar: MatSnackBar,
  ) {
    this.loginDetailsForm = this.fb.group({
      employeeId: new FormControl(''),
      userName: new FormControl({ value: '', disabled: true }),
      email: new FormControl({ value: '', disabled: true }),
      password: new FormControl('', [Validators.required]),
      role: new FormControl(''),
    });
  }


  ngOnInit(): void {
    this.loginDetailsForm.patchValue({
      employeeId: this.data.employeeId,
      userName: this.data.employeeName,
      email: this.data.email,
      role: this.data.role
    });
  }

  // public populateData(): void {
  //   this.httpService.getUserData(this.data).subscribe({
  //     next: (response: any) => {
  //       if (response) {
  //         this.loginData = response;
  //         this.patchFormData(response);
  //         this.buttonLabel = 'Edit';
  //       } else {
  //         if (this.data.role == 'EMPLOYEE') {
  //           this.loginDetailsForm.patchValue({
  //             employeeId: this.data.id,
  //           });
  //         } else {
  //           this.loginDetailsForm.patchValue({
  //             customerId: this.data.id,
  //           });
  //         }
  //       }
  //     },
  //     error: (error: any) => {
  //       this.snackBar.open(error.message, 'ERROR', { duration: 5000 })
  //     },
  //   });
  // }

  // public patchFormData(data: any): void {
  //   this.loginDetailsForm.patchValue({
  //     firstName: data.firstName,
  //     lastName: data.lastName,
  //     userName: data.userName,
  //     role: data.role,
  //   });

  //   if (data) {
  //     this.loginDetailsForm
  //       .get('password')
  //       ?.removeValidators(Validators.required);
  //     this.loginDetailsForm.get('password')?.updateValueAndValidity();
  //   } else {
  //     this.loginDetailsForm.get('password')?.addValidators(Validators.required);
  //     this.loginDetailsForm.get('password')?.updateValueAndValidity();
  //   }
  // }

  public onSubmit(): void {
    try {
      if (this.loginDetailsForm.invalid) {
        return;
      }
      // const payload = {
      //   employeeId: this.data.employeeId,
      //   userName: this.loginDetailsForm.value.employeeName,
      //   email: this.loginDetailsForm.value.email,
      //   password: this.loginDetailsForm.value.password,
      //   role: 'EMPLOYEE'
      // };

      const formData = this.loginDetailsForm.getRawValue();

      const payload = {
        employeeId: formData.employeeId,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      console.log("Dialog data:", this.data);
      // console.log("Payload:", payload);

      this.empRegService.createEmployeeLogin(payload).subscribe({
        next: (response: any) => {
          console.log(response);

          this.snackBar.open(response || 'Login created successfully!', 'Ok', { duration: 5000 });
          this._dialogRef.close(true);
        },
        error: (error: any) => {
          this.snackBar.open(error.error || 'Error', 'Ok', { duration: 5000 });
        }
      })
    } catch (error: any) {
      this.snackBar.open('Login creation error!', 'Ok', { duration: 5000 });
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }


}
