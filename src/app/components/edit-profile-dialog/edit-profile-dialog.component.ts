import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { AngularMaterailModules } from "../../AngularMeterialModules";
import { MatFormField } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { EditProfileService } from '../../services/editProfile/edit-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [MatDialogContent, AngularMaterailModules, MatFormField, ReactiveFormsModule, NgIf],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrl: './edit-profile-dialog.component.scss'
})
export class EditProfileDialogComponent {

  profileForm: FormGroup;
  submitted = false;
  selectedData!: { userId: any; };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProfileDialogComponent>,
    private editProfileSevice: EditProfileService,
    private snackBar: MatSnackBar,
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }


  updateProfile() {
    if (this.profileForm.valid) {

      const formData = this.profileForm.value;

      if (formData.newPassword !== formData.confirmPassword) {
        // alert('Passwords do not match');
        this.snackBar.open("Password does not match", 'Ok', { duration: 5000 });
        return;
      }

      console.log(formData);

      // Call backend API here
      this.editProfileSevice.editProfile(formData).subscribe({
        next: (response: any) => {
          console.log("getting:", response);

          this.snackBar.open(response || 'Admin details updated successfully', 'Ok', { duration: 5000 });
        },
        error: (error) => {
          console.log(error);

          this.snackBar.open(error.error.message || 'Update failed', 'Error', { duration: 5000 });
        }
      });

      this.dialogRef.close();
    }
  }
}
