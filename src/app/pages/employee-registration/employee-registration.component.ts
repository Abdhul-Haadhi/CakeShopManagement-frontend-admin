import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { AngularMaterailModules } from '../../AngularMeterialModules';
import { MatCard } from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgForOf, DatePipe } from '@angular/common';
import { ProductRegistrationService } from '../../services/productRegistration/product-registration.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin/service/admin.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { provideNativeDateAdapter } from '@angular/material/core';
import { EmployeeRegistrationService } from '../../services/employeeRegistration/employee-registration.service';

@Component({
  selector: 'app-employee-registration',
  standalone: true,
  imports: [AngularMaterailModules, MatToolbar, MatFormFieldModule, MatCard, MatFormField, ReactiveFormsModule, NgIf, NgForOf, DatePipe],
  templateUrl: './employee-registration.component.html',
  styleUrl: './employee-registration.component.scss'
})
export class EmployeeRegistrationComponent {


  EmpRegForm: FormGroup;
  showForm = false;
  submitted = false;
  saveButtonLabel: string = 'Save';
  isButtonDisabled = false;
  mode = 'add';
  selectedData!: { productId: any; };
  maxDate: Date;

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  // displayedColumns: string[] = [
  //   // 'productId',
  //   'employeeName',
  //   'byteImage',
  //   'description',
  //   // 'colors',
  //   'size',
  //   'price',
  //   'addedDate',
  //   'actions',
  // ];


  constructor(private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private empService: EmployeeRegistrationService,
  ) { }

  ngOnInit(): void {

    this.EmpRegForm = this.fb.group({
      // employeeId: [null, [Validators.required]],
      employeeName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z ]+$'),]),
      nic: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9}[vVxX]$|^[0-9]{12}')]),
      birthday: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      // password: [null, [Validators.required, Validators.maxLength(500)]],
      address: new FormControl('', [Validators.required, Validators.maxLength(150),]),
      contactNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$'),]),
    });

    this.populateData();

    const data = history.state.product;


    if (data) {
      this.editData(data);
      this.showForm = true;
    }

  }

  public populateData(): void {
    try {
      this.empService.getAllEmployees().subscribe({
        next: (dataList: any) => {
          if (dataList.length <= 0) {
            return;
          }

          this.dataSource = new MatTableDataSource(dataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        },
        error: (error) => {
          this.snackBar.open(error.message, 'ERROR', { duration: 5000 })
        }
      });
    }
    catch (error) {
      // this.messageService.showError('Action failed with error' + error);
    }

  }


  onSubmit(): void {
    console.log("FORM VALUE:", this.EmpRegForm.value);
    try {
      if (this.mode === 'add') {
        if (this.EmpRegForm.valid) {
          const formData: FormData = new FormData();
          formData.append('categoryId', this.EmpRegForm.get('categoryId').value);
          formData.append('productName', this.EmpRegForm.get('productName').value);
          formData.append('description', this.EmpRegForm.get('description').value);
          formData.append('size', this.EmpRegForm.get('size').value);
          formData.append('quantity', this.EmpRegForm.get('quantity').value);
          formData.append('price', this.EmpRegForm.get('price').value);
          const rawDate = this.EmpRegForm.get('addedDate')?.value;
          if (rawDate) {
            const formattedDate = new Date(rawDate).toISOString();
            formData.append('addedDate', formattedDate);
          }

          this.empService.addEmployee(formData).subscribe({
            next: (response: any) => {
              // console.log("RESPONSE:", formData);
              if (response.productId != null) {
                this.snackBar.open('Product added successfully', 'Ok', { duration: 5000 });
                this.router.navigateByUrl('/dashboard');
              }
              else {
                this.snackBar.open(response.message, 'ERROR', { duration: 5000 });
              }
            }
          })

        }
        else {
          console.log("wrong");

          for (const i in this.EmpRegForm.controls) {
            this.EmpRegForm.controls[i].markAsDirty();
            this.EmpRegForm.controls[i].updateValueAndValidity();
          }
        }

      } else if (this.mode === 'edit') {
        const formData: FormData = new FormData();

        formData.append('categoryId', this.EmpRegForm.get('categoryId').value);
        formData.append('productName', this.EmpRegForm.get('productName').value);
        formData.append('description', this.EmpRegForm.get('description').value);
        formData.append('size', this.EmpRegForm.get('size').value);
        formData.append('quantity', this.EmpRegForm.get('quantity').value);
        formData.append('price', this.EmpRegForm.get('price').value);
        const rawDate = this.EmpRegForm.get('addedDate')?.value;
        if (rawDate) {
          const formattedDate = new Date(rawDate).toISOString();
          formData.append('addedDate', formattedDate);
        }

        formData.forEach((value, key) => {
          console.log("FORMDATA:", key, value);
        });

        this.empService.editData(this.selectedData.productId, formData).subscribe({
          next: (response: any) => {
            this.snackBar.open('Product updated successfully', 'Ok', { duration: 5000 });
            this.router.navigateByUrl('/dashboard');
          },
          error: (error) => {
            this.snackBar.open('Update failed', 'Error', { duration: 5000 });
          }
        });
      }
      this.mode = 'add';
      this.EmpRegForm.disable();
      this.isButtonDisabled = true;
    }
    catch (error) {
      this.snackBar.open("Something went wrong ", "Error", { duration: 5000 })
    }


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  public editData(data: any): void {

    this.EmpRegForm.patchValue(data);


    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public deleteData(productId: any): void {

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


        this.empService.deleteEmployee(productId).subscribe({
          next: (response) => {
            const index = this.dataSource.data.findIndex((element) => element.productId === productId);
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            // this.messageService.showSuccess('Data deleted successfully!');
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


  public resetData(): void {
    this.EmpRegForm.reset();
    this.EmpRegForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.EmpRegForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }


  public refreshData(): void {
    this.populateData();
  }

  closeForm() {
    this.showForm = false;
    this.EmpRegForm.reset();
    this.EmpRegForm.enable();
    this.saveButtonLabel = 'Save'
    this.submitted = false;
  }


}
