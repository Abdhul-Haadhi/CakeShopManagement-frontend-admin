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
import { RoleService } from '../../services/role/role.service';


@Component({
  selector: 'app-employee-registration',
  standalone: true,
  imports: [AngularMaterailModules, MatToolbar, MatFormFieldModule, MatCard, MatFormField, ReactiveFormsModule, NgIf, NgForOf, DatePipe, JsonPipe],
  templateUrl: './employee-registration.component.html',
  styleUrl: './employee-registration.component.scss'
})
export class EmployeeRegistrationComponent implements OnInit {

  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }


  // hide = signal(true);
  // clickEvent(event: MouseEvent) {
  //   this.hide.set(!this.hide());
  //   event.stopPropagation();
  // }

  // togglePasswordVisibility() {
  //   this.hidePassword = !this.hidePassword;
  // }


  hidePassword = true;
  EmpRegForm: FormGroup;
  showForm = false;
  submitted = false;
  saveButtonLabel: string = 'Save';
  isButtonDisabled = false;
  mode = 'add';
  selectedData!: { employeeId: any; };
  // maxDate: Date;
  // minDate: Date;

  roles: any[] = [];


  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  displayedColumns: string[] = [
    'employeeName',
    'email',
    'phone',
    'address',
    'role',
    'joinDate',
    'actions',
  ];


  constructor(private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private empService: EmployeeRegistrationService,
    private roleService: RoleService,
    private _dialog: MatDialog,
  ) {
    // this.maxDate = new Date();
    // this.minDate = new Date();
  }

  ngOnInit(): void {

    this.EmpRegForm = this.fb.group({
      // employeeId: [null, [Validators.required]],
      employeeName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z ]+$'),]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$'),]),
      address: new FormControl('', [Validators.required, Validators.maxLength(150),]),
      roleId: new FormControl('', [Validators.required]),
      // joinDate: new FormControl('', [Validators.required]),
      // password: new FormControl('', [Validators.required]),
    });

    this.populateData();

    const data = history.state.employee;

    if (data) {
      this.editData(data);
      this.showForm = true;
    }

    this.loadRoles();

  }

  public populateData(): void {
    try {
      this.empService.getAllEmployees().subscribe({
        next: (dataList: any) => {
          console.log("getiinggg:", dataList);

          if (dataList.length <= 0) {
            return;
          }

          this.dataSource = new MatTableDataSource(dataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        },
        error: (error) => {
          this.snackBar.open(error.message, 'ERROR', { duration: 3000 })
        }
      });
    }
    catch (error) {
      this.snackBar.open(error.message, 'ERROR', { duration: 3000 });
    }

  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res: any) => {
        this.roles = res;
      }
    });
  }

  // formatDate(date: Date): string {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');

  //   return `${year}-${month}-${day}`;
  // }

  openAddForm() {
    this.showForm = true;
    this.mode = 'add';
    this.saveButtonLabel = 'Save';
    this.EmpRegForm.enable();
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
            roleId: this.EmpRegForm.get('roleId').value
            // password: this.EmpRegForm.get('password').value,
            // joinDate: this.formatDate(this.EmpRegForm.get('joinDate')?.value),
          };

          this.empService.addEmployee(payload).subscribe({
            next: (response: any) => {
              console.log("RESPONSE:", payload);
              if (response.employeeId != null) {
                this.snackBar.open('Employee added successfully', 'Ok', { duration: 3000 });
                this.refreshData();
              }
              else {
                this.snackBar.open(response.message, 'ERROR', { duration: 3000 });
              }
            },
            error: (error) => {
              this.snackBar.open(error.error?.message, 'ERROR', { duration: 3000 });
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
          roleId: this.EmpRegForm.get('roleId').value,
          // password: this.EmpRegForm.get('password').value,
          // joinDate: this.formatDate(this.EmpRegForm.get('joinDate')?.value),
        };

        formData.forEach((value, key) => {
          console.log("FORMDATA:", key, value);
        });

        this.empService.editData(this.selectedData.employeeId, payload).subscribe({
          next: (response: any) => {
            this.snackBar.open('Employee details updated successfully', 'Ok', { duration: 3000 });
            this.refreshData();
            this.closeForm();

          },
          error: (error) => {
            this.snackBar.open(error.error?.message || 'Update failed', 'Error', { duration: 3000 });
          }
        });

      }

      this.mode = 'add';
      this.EmpRegForm.disable();
      this.isButtonDisabled = true;
      this.refreshData();
      this.closeForm();

    }
    catch (error) {
      let message = 'Something went wrong';

      if (error.error) {
        if (typeof error.error === 'string') {
          message = error.error;
        } else if (error.error.message) {
          message = error.error.message;
        }
      }

      this.snackBar.open(message, 'ERROR', { duration: 3000 });
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

    this.EmpRegForm.patchValue({
      ...data,
      // joinDate: data.joinDate ? new Date(data.joinDate) : null
    });


    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public deleteData(employeeId: any): void {
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
            this.snackBar.open('Employee deleted successfully!', 'Close', { duration: 3000 });
            this.refreshData();

          },
          error: (error) => {
            console.error("DELETE ERROR:", error);
            this.snackBar.open(error?.error?.message || 'Delete failed', 'Close', { duration: 3000 });
          }
        });
      });
    }
    catch (error) {
      this.snackBar.open('Action failed with error ' + error, 'Close', { duration: 3000 });
    }
  }


  public resetData(): void {
    this.EmpRegForm.reset();
    this.EmpRegForm.updateValueAndValidity();
    this.saveButtonLabel = this.mode === 'edit' ? 'Edit' : 'Save';
    this.EmpRegForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;

    if (this.mode === 'edit' && this.selectedData) {
      this.EmpRegForm.patchValue({
        ...this.selectedData
      })
    }
  }

  closeForm() {
    this.showForm = false;
    this.EmpRegForm.reset();
    this.EmpRegForm.enable();
    this.saveButtonLabel = 'Save'
    this.submitted = false;
    this.isButtonDisabled = false;
  }

  public refreshData(): void {
    this.populateData();
  }

  public addLoginCredentials(employee: any): void {
    try {
      const dialogRef = this._dialog.open(RegDialogComponent, {
        data: {
          employeeId: employee.employeeId,
          employeeName: employee.employeeName,
          email: employee.email,
          roleId: employee.roleId
        },
      });

      dialogRef.afterClosed().subscribe({
        next: (value: any) => {
          if (value) {
            this.snackBar.open(
              'Login account created Successfully!', 'Ok', { duration: 3000 }
            );
          }
        },
      });
    } catch (error: any) {
      this.snackBar.open('Action Failed!', 'Close', { duration: 3000 });
    }
  }


}
