import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { AngularMaterailModules } from '../../AngularMeterialModules';
import { MatCard } from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgForOf, DatePipe, JsonPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { CustomerRegistrationService } from '../../services/customerRegistration/customer-registration.service';


@Component({
  selector: 'app-customer-registration',
  standalone: true,
  imports: [AngularMaterailModules, MatToolbar, MatFormFieldModule, MatCard, MatFormField, ReactiveFormsModule, NgIf, NgForOf, DatePipe, JsonPipe],
  templateUrl: './customer-registration.component.html',
  styleUrl: './customer-registration.component.scss'
})
export class CustomerRegistrationComponent implements OnInit {

  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  hidePassword = true;
  CustRegForm: FormGroup;
  showForm = false;
  submitted = false;
  saveButtonLabel: string = 'Save';
  isButtonDisabled = false;
  mode = 'add';
  selectedData!: { customerId: any; };
  maxDate: Date;
  minDate: Date;


  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'customerName',
    'email',
    'phone',
    'address',
    'joinDate',
    'actions',
  ];


  constructor(private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private customerService: CustomerRegistrationService,
    private _dialog: MatDialog,
  ) {
    this.maxDate = new Date();
    this.minDate = new Date();
  }


  ngOnInit(): void {

    this.CustRegForm = this.fb.group({
      // customerId: [null, [Validators.required]],
      customerName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z ]+$'),]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$'),]),
      address: new FormControl('', [Validators.required, Validators.maxLength(150),]),
      joinDate: new FormControl('', [Validators.required]),
      // password: new FormControl('', [Validators.required]),
    });

    this.populateData();

    const data = history.state.customer;


    if (data) {
      this.editData(data);
      this.showForm = true;
    }

  }


  public populateData(): void {
    try {
      this.customerService.getAllCustomers().subscribe({
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
      this.snackBar.open(error.message, 'ERROR', { duration: 5000 });
    }

  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    Object.values(this.CustRegForm.controls).forEach(control => {
      control.markAsTouched();
    });
    console.log("FORM VALUE:", this.CustRegForm.value);
    try {
      if (this.mode === 'add') {
        if (this.CustRegForm.valid) {
          const payload = {
            customerName: this.CustRegForm.get('customerName').value,
            email: this.CustRegForm.get('email').value,
            phone: this.CustRegForm.get('phone').value,
            address: this.CustRegForm.get('address').value,
            // password: this.CustRegForm.get('password').value,
            // joinDate: new Date(this.CustRegForm.get('joinDate').value).toISOString()
            joinDate: this.formatDate(this.CustRegForm.get('joinDate')?.value)
          };

          this.customerService.addCustomer(payload).subscribe({
            next: (response: any) => {
              console.log("RESPONSE:", payload);
              if (response.customerId != null) {
                this.snackBar.open('Customer added successfully', 'Ok', { duration: 5000 });
                this.refreshData();
              }
              else {
                this.snackBar.open(response.message, 'ERROR', { duration: 5000 });
              }
            },
            error: (error) => {
              console.log("FULL ERROR:", error);
              this.snackBar.open(error.error?.message || 'Save failed', 'Error', { duration: 5000 });
            }
          })

        }
        else {
          console.log("wrong");

          for (const i in this.CustRegForm.controls) {
            this.CustRegForm.controls[i].markAsDirty();
            this.CustRegForm.controls[i].updateValueAndValidity();
          }
        }

      } else if (this.mode === 'edit') {
        const formData: FormData = new FormData();

        const payload = {
          customerName: this.CustRegForm.get('customerName').value,
          email: this.CustRegForm.get('email').value,
          phone: this.CustRegForm.get('phone').value,
          address: this.CustRegForm.get('address').value,
          // password: this.CustRegForm.get('password').value,
          joinDate: new Date(this.CustRegForm.get('joinDate').value).toISOString()
        };

        formData.forEach((value, key) => {
          console.log("FORMDATA:", key, value);
        });

        this.customerService.editData(this.selectedData.customerId, payload).subscribe({
          next: (response: any) => {
            this.snackBar.open('Customer details updated successfully', 'Ok', { duration: 5000 });
            this.refreshData();
            this.closeForm();
          },
          error: (error) => {
            this.snackBar.open('Update failed', 'Error', { duration: 5000 });
          }
        });
      }
      this.mode = 'add';
      this.CustRegForm.disable();
      this.isButtonDisabled = true;
      this.refreshData();
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

    this.CustRegForm.patchValue({
      ...data,
      addedDate: data.addedDate ? new Date(data.addedDate + 'Z') : null
    });


    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public deleteData(customerId: any): void {

    console.log("FULL OBJECT:", customerId);

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


        this.customerService.deleteCustomer(customerId).subscribe({
          next: (response) => {
            console.log("Delete response:", response);

            const index = this.dataSource.data.findIndex((element) => element.customerId === customerId);
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.snackBar.open('Customer deleted successfully!', 'Close', { duration: 5000 });
            this.refreshData();

          },
          error: (error) => {
            console.error("DELETE ERROR:", error);
            this.snackBar.open(error?.error?.message || 'Delete failed', 'Close', { duration: 5000 });
          }
        });
      });
    }
    catch (error) {
      this.snackBar.open('Action failed with error ' + error, 'Close', { duration: 5000 });
    }
  }

  public resetData(): void {
    this.CustRegForm.reset();
    this.CustRegForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.CustRegForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public refreshData(): void {
    this.populateData();
  }

  closeForm() {
    this.showForm = false;
    this.CustRegForm.reset();
    this.CustRegForm.enable();
    this.saveButtonLabel = 'Save'
    this.submitted = false;
    this.isButtonDisabled = false;
  }


}
