import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AngularMaterailModules } from "../../../AngularMeterialModules";
import { NgIf } from "@angular/common";
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-category',
  standalone: true,
  imports: [FormsModule, AngularMaterailModules, NgIf, ReactiveFormsModule, HttpClientModule],
  templateUrl: './post-category.component.html',
  styleUrl: './post-category.component.scss'
})
export class PostCategoryComponent implements OnInit{

  categoryForm!: FormGroup;
  showForm = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ){}

  ngOnInit(): void{
    this.categoryForm = this.fb.group({
      categoryName: [null, [Validators.required]],
      description: [null, [Validators.required]]
    })
  }

  addCategory(){
    if(this.categoryForm.valid){
      this.adminService.addCategory(this.categoryForm.value).subscribe({
        next: (response) => {
          if(response.categoryId != null){
            this.snackBar.open('Category posted successfully', 'Ok', {duration: 5000});
            this.router.navigateByUrl('dashboard');
          }
          else{
            this.snackBar.open(response.message, 'Close', {duration: 5000, panelClass: 'error-snackbar'});
          }
        }
      });
    }
    else{
      this.categoryForm.markAllAsTouched();
    }
  }


  public resetData(): void {
    this.categoryForm.reset();
    this.categoryForm.updateValueAndValidity();
    this.categoryForm.enable();
    this.submitted = false;
  }

  closeForm() {
    this.showForm = false;
    this.categoryForm.reset();
    this.submitted = false;
  }

}
