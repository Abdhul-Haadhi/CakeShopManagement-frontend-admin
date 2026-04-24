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
import { EmployeeRegistrationService } from '../../services/employeeRegistration/employee-registration.service';
import { MatDialog } from '@angular/material/dialog';
import { RegDialogComponent } from './reg-dialog/reg-dialog.component';

interface Roles {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-employee-registration',
  standalone: true,
  imports: [AngularMaterailModules, MatToolbar, MatFormFieldModule, MatCard, MatFormField, ReactiveFormsModule, NgIf, NgForOf, DatePipe, JsonPipe],
  templateUrl: './employee-registration.component.html',
  styleUrl: './employee-registration.component.scss'
})
export class EmployeeRegistrationComponent implements OnInit {


  // listOfRoles: Roles[] = [
  //   { value: 'White', viewValue: 'White' },
  //   { value: 'Yellow', viewValue: 'Yellow' },
  //   { value: 'Orange', viewValue: 'Orange' },
  //   { value: 'Green', viewValue: 'Green' },
  //   { value: 'Blue', viewValue: 'Blue' },
  //   { value: 'Purple', viewValue: 'Purple' },
  //   { value: 'Pink', viewValue: 'Pink' },
  //   { value: 'Red', viewValue: 'Red' },
  //   { value: 'black', viewValue: 'Black' },
  //   { value: 'No colors', viewValue: 'No colors' },
  // ];


  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }




  // hide = signal(true);
  // clickEvent(event: MouseEvent) {
  //   this.hide.set(!this.hide());
  //   event.stopPropagation();
  // }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }


  hidePassword = true;
  EmpRegForm: FormGroup;
  showForm = false;
  submitted = false;
  saveButtonLabel: string = 'Save';
  isButtonDisabled = false;
  mode = 'add';
  selectedData!: { employeeId: any; };
  maxDate: Date;
  minDate: Date;


  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  displayedColumns: string[] = [
    'employeeName',
    'email',
    'phone',
    'address',
    'joinDate',
    'actions',
  ];


  constructor(private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private empService: EmployeeRegistrationService,
    private _dialog: MatDialog,
  ) {
    this.maxDate = new Date();
    this.minDate = new Date();
  }

  ngOnInit(): void {

    this.EmpRegForm = this.fb.group({
      // employeeId: [null, [Validators.required]],
      employeeName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z ]+$'),]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$'),]),
      address: new FormControl('', [Validators.required, Validators.maxLength(150),]),
      joinDate: new FormControl('', [Validators.required]),
      // password: new FormControl('', [Validators.required]),
    });

    this.populateData();

    const data = history.state.employee;


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
      this.snackBar.open(error.message, 'ERROR', { duration: 5000 });
    }

  }




  onSubmit(): void {
    Object.values(this.EmpRegForm.controls).forEach(control => {
      control.markAsTouched();
    });
    console.log("FORM VALUE:", this.EmpRegForm.value);
    try {
      if (this.mode === 'add') {
        if (this.EmpRegForm.valid) {
          const payload = {
            employeeName: this.EmpRegForm.get('employeeName').value,
            email: this.EmpRegForm.get('email').value,
            phone: this.EmpRegForm.get('phone').value,
            address: this.EmpRegForm.get('address').value,
            // password: this.EmpRegForm.get('password').value,
            joinDate: new Date(this.EmpRegForm.get('joinDate').value).toISOString()
          };

          this.empService.addEmployee(payload).subscribe({
            next: (response: any) => {
              console.log("RESPONSE:", payload);
              if (response.employeeId != null) {
                this.snackBar.open('Employee added successfully', 'Ok', { duration: 5000 });
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

          for (const i in this.EmpRegForm.controls) {
            this.EmpRegForm.controls[i].markAsDirty();
            this.EmpRegForm.controls[i].updateValueAndValidity();
          }
        }

      } else if (this.mode === 'edit') {
        const formData: FormData = new FormData();

        const payload = {
          employeeName: this.EmpRegForm.get('employeeName').value,
          email: this.EmpRegForm.get('email').value,
          phone: this.EmpRegForm.get('phone').value,
          address: this.EmpRegForm.get('address').value,
          // password: this.EmpRegForm.get('password').value,
          joinDate: new Date(this.EmpRegForm.get('joinDate').value).toISOString()
        };

        formData.forEach((value, key) => {
          console.log("FORMDATA:", key, value);
        });

        this.empService.editData(this.selectedData.employeeId, payload).subscribe({
          next: (response: any) => {
            this.snackBar.open('Employee details updated successfully', 'Ok', { duration: 5000 });
          },
          error: (error) => {
            this.snackBar.open('Update failed', 'Error', { duration: 5000 });
          }
        });
      }
      this.mode = 'add';
      this.EmpRegForm.disable();
      this.isButtonDisabled = true;
      this.refreshData();
    }
    catch (error) {
      this.snackBar.open("Something went wrong ", "Error", { duration: 5000 })
    }


  }

  // onSubmit() {
  //   try {
  //     this.submitted = true;
  //     if (this.EmpRegForm.invalid) {
  //       return;
  //     }
  //     if (this.mode === 'add') {
  //       this.empService.addEmployee(this.EmpRegForm.value).subscribe({
  //         next: (response: any) => {
  //           if (
  //             this.dataSource &&
  //             this.dataSource.data &&
  //             this.dataSource.data.length > 0
  //           ) {
  //             this.dataSource = new MatTableDataSource([
  //               response,
  //               ...this.dataSource.data,
  //             ]);
  //           } else {
  //             this.dataSource = new MatTableDataSource([response]);
  //           }
  //           if (response.employeeId != null) {
  //             this.snackBar.open('Employee added successfully', 'Ok', { duration: 5000 });
  //           }
  //           // this.addNotification('Employee Added Successfully');
  //         },
  //         error: (error) => {
  //           this.snackBar.open(error.message, 'ERROR', { duration: 5000 });
  //         },
  //       });
  //     } else if (this.mode === 'edit') {
  //       this.empService
  //         .editData(this.selectedData?.employeeId, this.EmpRegForm.value)
  //         .subscribe({
  //           next: (response) => {
  //             let elementIndex = this.dataSource.data.findIndex(
  //               (element) => element.id === this.selectedData?.employeeId
  //             );
  //             this.dataSource.data[elementIndex] = response;
  //             this.dataSource = new MatTableDataSource(this.dataSource.data);
  //             this.snackBar.open('Employee details updated successfully', 'Ok', { duration: 5000 });
  //           },
  //           error: (error) => {
  //             this.snackBar.open('Update failed', 'Error', { duration: 5000 });
  //           },
  //         });
  //     }
  //     this.mode = 'add';
  //     this.EmpRegForm.disable();
  //     this.isButtonDisabled = true;
  //     this.closeForm();
  //   } catch (error) {
  //     this.snackBar.open('Update failed', 'Error', { duration: 5000 });
  //   }
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  public editData(data: any): void {

    this.EmpRegForm.patchValue({
      ...data,
      addedDate: data.addedDate ? new Date(data.addedDate + 'Z') : null
    });


    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public deleteData(employeeId: any): void {

    // const employeeId = employee.employeeId;
    // const userId = employee.userId;

    console.log("FULL OBJECT:", employeeId);

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


        this.empService.deleteEmployee(employeeId).subscribe({
          next: (response) => {
            console.log("Delete response:", response);

            const index = this.dataSource.data.findIndex((element) => element.employeeId === employeeId);
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            // this.messageService.showSuccess('Data deleted successfully!');
            this.snackBar.open('Employee deleted successfully!', 'Close', { duration: 5000 });
            this.refreshData();

          },
          error: (error) => {
            console.error("DELETE ERROR:", error);
            this.snackBar.open(error?.error?.message || 'Delete failed', 'Close', { duration: 5000 });
          }
        });

        // this.empService.deleteEmployeeLogin(userId).subscribe({
        //   next: (response) => {
        //     const index = this.dataSource.data.findIndex((element) => element.userId === userId);
        //     if (index !== -1) {
        //       this.dataSource.data.splice(index, 1);
        //     }
        //   }
        // })
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
    this.isButtonDisabled = false;
  }

  public addLoginCredentials(employee: any): void {
    try {
      const dialogRef = this._dialog.open(RegDialogComponent, {
        data: {
          employeeId: employee.employeeId,
          employeeName: employee.employeeName,
          email: employee.email,
          role: 'EMPLOYEE'
        },
      });

      dialogRef.afterClosed().subscribe({
        next: (value: any) => {
          if (value) {
            this.snackBar.open(
              'Login account created Successfully!', 'Ok', { duration: 5000 }
            );
          }
        },
      });
    } catch (error: any) {
      this.snackBar.open('Action Failed!', 'Close', { duration: 5000 });
    }
  }


}
