import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AngularMaterailModules } from "../../../AngularMeterialModules";
import { NgIf } from "@angular/common";
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-category',
  standalone: true,
  imports: [FormsModule, AngularMaterailModules, NgIf, ReactiveFormsModule, HttpClientModule],
  templateUrl: './post-category.component.html',
  styleUrl: './post-category.component.scss'
})
export class PostCategoryComponent implements OnInit {

  categoryForm!: FormGroup;
  showForm = false;
  submitted = false;
  selectedData!: { categoryId: any; };
  saveButtonLabel: string = 'Save';
  isButtonDisabled = false;
  category: any[] = [];
  mode = 'add';

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) { }


  displayedColumns: string[] = [
    'categoryName',
    'description',
    'actions'
  ];

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      categoryName: [null, [Validators.required]],
      description: [null, [Validators.required]]
    })

    this.populateData();

    const data = history.state.category;


    if (data) {
      this.editData(data);
      this.showForm = true;
    }
  }

  // addCategory() {
  //   if (this.categoryForm.valid) {
  //     this.adminService.addCategory(this.categoryForm.value).subscribe({
  //       next: (response) => {
  //         if (response.categoryId != null) {
  //           this.snackBar.open('Category posted successfully', 'Ok', { duration: 5000 });
  //           this.router.navigateByUrl('dashboard');
  //         }
  //         else {
  //           this.snackBar.open(response.message, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
  //         }
  //       }
  //     });
  //   }
  //   else {
  //     this.categoryForm.markAllAsTouched();
  //   }
  // }


  onSubmit(): void {
    Object.values(this.categoryForm.controls).forEach(control => {
      control.markAsTouched();
    });
    console.log("FORM VALUE:", this.categoryForm.value);
    try {
      if (this.mode === 'add') {
        if (this.categoryForm.valid) {
          const payload = {
            categoryName: this.categoryForm.get('categoryName').value,
            description: this.categoryForm.get('description').value,
          };

          this.adminService.addCategory(payload).subscribe({
            next: (response: any) => {
              console.log("RESPONSE:", payload);
              if (response.categoryId != null) {
                this.snackBar.open('Category added successfully', 'Ok', { duration: 5000 });
                this.refreshData();
              }
              else {
                this.snackBar.open(response.message, 'ERROR', { duration: 5000 });
              }
            }
          })

        }
        else {
          console.log("wrong");

          for (const i in this.categoryForm.controls) {
            this.categoryForm.controls[i].markAsDirty();
            this.categoryForm.controls[i].updateValueAndValidity();
          }
        }

      } else if (this.mode === 'edit') {
        const formData: FormData = new FormData();

        const payload = {
          categoryName: this.categoryForm.get('categoryName').value,
          description: this.categoryForm.get('description').value,
        };

        formData.forEach((value, key) => {
          console.log("FORMDATA:", key, value);
        });

        this.adminService.editCategory(this.selectedData.categoryId, payload).subscribe({
          next: (response: any) => {
            this.snackBar.open('Category details updated successfully', 'Ok', { duration: 5000 });
            this.refreshData();
            this.closeForm();

          },
          error: (error) => {
            this.snackBar.open('Update failed', 'Error', { duration: 5000 });
          }
        });
      }
      this.mode = 'add';
      this.categoryForm.disable();
      this.isButtonDisabled = true;
      this.refreshData();
      this.closeForm();
      this.resetData();

    }
    catch (error) {
      this.snackBar.open("Something went wrong ", "Error", { duration: 5000 })
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

  public populateData(): void {
    try {
      this.adminService.getAllCategories().subscribe({
        next: (dataList: any) => {
          if (dataList.length <= 0) {
            return;
          }

          this.dataSource = new MatTableDataSource(dataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          console.log("categoryyy:",dataList);
          

        },
        error: (error) => {
          this.snackBar.open(error.message, 'ERROR', { duration: 5000 })
        }
      });
    }
    catch (error) {
      this.snackBar.open(error.message, 'ERROR', { duration: 5000 });
    }

  }


  public editData(data: any): void {

    this.categoryForm.patchValue({
      ...data,
    });

    this.categoryForm.updateValueAndValidity();


    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
    this.isButtonDisabled = false;
  }

  public deleteData(categoryId: any): void {

    try {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result && !result.isConfirmed) {
          return;
        }


        this.adminService.deleteCategory(categoryId).subscribe({
          next: (response) => {
            const index = this.dataSource.data.findIndex((element) => element.categoryId === categoryId);
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.snackBar.open('Data deleted successfully!', 'Close', { duration: 5000 });

          },
          error: (error) => {
            this.snackBar.open('Action failed with error ' + error, 'Close', { duration: 5000 });
          }
        });
      });
    }
    catch (error) {
      this.snackBar.open('Action failed with error ' + error, 'Close', { duration: 5000 });
    }

  }


  public refreshData(): void {
    this.populateData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
