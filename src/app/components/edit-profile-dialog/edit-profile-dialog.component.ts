import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogContent, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularMaterailModules } from "../../AngularMeterialModules";
import { MatFormField } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { EditProfileService } from '../../services/editProfile/edit-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [MatDialogContent, AngularMaterailModules, MatFormField, ReactiveFormsModule, NgIf],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrl: './edit-profile-dialog.component.scss'
})
export class EditProfileDialogComponent implements OnInit {

  profileForm: FormGroup;
  submitted = false;
  selectedData!: { userId: any; };
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private editProfileSevice: EditProfileService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  ngOnInit(): void {

    const role = UserStorageService.getUserRole();

    if (role === 'EMPLOYEE') {
      const employeeId = this.data.employeeId;

      this.editProfileSevice.getEmployeeById(employeeId).subscribe({
        next: (res: any) => {
          this.profileForm.patchValue({
            email: res.email
          });
        }
      });
    }
    else if (role === 'ADMIN') {
      this.profileForm.patchValue({
        email: UserStorageService.getUser()?.email
      });
    }

    // const employeeId=this.data.employeeId;

    // console.log("Employee ID::::", employeeId);

    // this.editProfileSevice.getEmployeeById(employeeId).subscribe({
    //   next:(res:any)=>{
    //     console.log("getting:::",res);

    //     this.profileForm.patchValue({
    //       email:res.email
    //     });
    //   }
    // })
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }


  updateProfile() {
    if (this.profileForm.valid) {

      const formData = this.profileForm.getRawValue();

      if (formData.newPassword !== formData.confirmPassword) {
        // alert('Passwords do not match');
        this.snackBar.open("Password does not match", 'Ok', { duration: 5000 });
        return;
      }
      console.log(formData);

      const role = UserStorageService.getUserRole();

      if (role === 'EMPLOYEE') {
        const payload = {
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }

        this.editProfileSevice.changeEmployeePassword(payload).subscribe({
          next: (response: any) => {
            this.snackBar.open(response, 'Ok', { duration: 5000 });
            this.logout();
          },
          error: (error) => {
            this.snackBar.open(error.error, 'Error', { duration: 5000 });
          }
        });
      }

      // Call backend API here
      else if (role === 'ADMIN') {
        this.editProfileSevice.editProfile(formData).subscribe({
          next: (response: any) => {
            console.log("getting:", response);

            this.snackBar.open(response || 'Admin details updated successfully', 'Ok', { duration: 5000 });
            this.logout();
          },
          error: (error) => {
            console.log(error);

            this.snackBar.open('Update failed', 'Error', { duration: 5000 });
          }
        });
      }
      this.dialogRef.close();
    }
  }

  logout() {
    UserStorageService.signOut();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }


}
