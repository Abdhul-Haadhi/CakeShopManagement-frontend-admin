import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularMaterailModules } from "../../AngularMeterialModules";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PermissionService } from '../../services/permission/permission.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';

// --- Added for Table Features ---
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-permission-management',
  standalone: true,
  imports: [
    AngularMaterailModules,
    MatFormFieldModule,
    MatFormField,
    NgIf,
    MatToolbar,
    ReactiveFormsModule
  ],
  templateUrl: './permission-management.component.html',
  styleUrl: './permission-management.component.scss'
})
export class PermissionManagementComponent implements OnInit {

  // Upgraded from standard array to MatTableDataSource
  permissions: MatTableDataSource<any> = new MatTableDataSource<any>();

  permissionForm!: FormGroup;
  isEditMode = false;
  selectedPermissionId!: number;

  // Controls the visibility of the Add/Edit form
  showForm: boolean = false;

  // Re-added 'actions' to match the new HTML template
  displayedColumns: string[] = [
    'permissionId',
    'permissionName',
    'description',
    // 'actions'
  ];

  // ViewChild decorators for Paginator and Sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.permissionForm = this.fb.group({
      permissionName: ['', Validators.required],
      description: ['']
    });
    this.loadPermissions();
  }

  loadPermissions() {
    this.permissionService.getAllPermissions().subscribe((res: any[]) => {
      // Assign data to the MatTableDataSource
      this.permissions.data = res;

      // Link paginator and sort after data loads
      this.permissions.paginator = this.paginator;
      this.permissions.sort = this.sort;
    });
  }

  // --- New Methods for Table UI ---
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.permissions.filter = filterValue.trim().toLowerCase();

    if (this.permissions.paginator) {
      this.permissions.paginator.firstPage();
    }
  }

  refreshData() {
    this.loadPermissions();
  }
  // ---------------------------------

  savePermission() {
    if (this.permissionForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.permissionService.updatePermission(this.selectedPermissionId, this.permissionForm.value).subscribe(() => {
        this.loadPermissions();
        this.cancelEdit();
        this.showForm = false; // Hide form after update
      });
    } else {
      this.permissionService.addPermission(this.permissionForm.value).subscribe(() => {
        this.loadPermissions();
        this.permissionForm.reset();
        this.showForm = false; // Hide form after save
      });
    }
  }

  editPermission(permission: any) {
    this.isEditMode = true;
    this.showForm = true; // Open the form sliding animation
    this.selectedPermissionId = permission.permissionId;

    this.permissionForm.patchValue({
      permissionName: permission.permissionName,
      description: permission.description
    });
  }

  deletePermission(id: number) {
    if (confirm("Are you sure you want to delete this permission?")) {
      this.permissionService.deletePermission(id).subscribe(() => {
        this.loadPermissions();
      });
    }
  }

  cancelEdit() {
    this.isEditMode = false;
    this.permissionForm.reset();
  }
}