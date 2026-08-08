import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PermissionService } from '../../services/permission/permission.service';
import { AngularMaterailModules } from "../../AngularMeterialModules";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService } from '../../services/role/role.service';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { NgForOf, NgIf } from '@angular/common';

// --- Added for Table Features ---
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    AngularMaterailModules,
    MatFormFieldModule,
    MatFormField,
    NgIf,
    NgForOf,
    MatToolbar,
    ReactiveFormsModule,
    MatDialogModule,
    MatListModule
  ],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.scss'
})
export class RoleManagementComponent implements OnInit {

  permissions: any[] = [];

  // Upgraded from array to MatTableDataSource for filtering/pagination
  roles: MatTableDataSource<any> = new MatTableDataSource<any>();

  roleForm!: FormGroup;
  isEditMode = false;
  selectedRoleId!: number;

  // Controls the visibility of the Add/Edit form
  showForm: boolean = false;

  displayedColumns: string[] = [
    'roleId',
    'roleName',
    'description',
    'permissions',
    'actions'
  ];

  // ViewChild decorators for Paginator and Sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private permissionService: PermissionService,
    private roleService: RoleService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      description: [''],
      permissionIds: [[]]
    });

    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe((res: any) => {
      console.log("getting roles:", res);
      // Assign data to the MatTableDataSource
      this.roles.data = res;

      // Link paginator and sort after data loads
      this.roles.paginator = this.paginator;
      this.roles.sort = this.sort;
    });
  }

  loadPermissions() {
    this.permissionService.getAllPermissions().subscribe(res => {
      this.permissions = res;
    });
  }

  // --- New Methods for Table UI ---
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.roles.filter = filterValue.trim().toLowerCase();

    if (this.roles.paginator) {
      this.roles.paginator.firstPage();
    }
  }

  refreshData() {
    this.loadRoles();
  }
  
  saveRole() {
    if (this.roleForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.roleService.updateRole(
        this.selectedRoleId,
        this.roleForm.value
      ).subscribe(() => {
        this.loadRoles();
        this.cancelEdit();
        this.showForm = false; // Hide form after update
      });
    } else {
      this.roleService.addRole(
        this.roleForm.value
      ).subscribe(() => {
        this.loadRoles();
        this.cancelEdit();
        this.showForm = false; // Hide form after save
      });
    }
  }

  openPermissionsDialog(templateRef: TemplateRef<any>, role: any) {
    // Convert the array of IDs into an array of readable names
    let permissionNames = [];
    if (role.permissionIds && role.permissionIds.length > 0) {
      permissionNames = this.permissions
        .filter(p => role.permissionIds.includes(p.permissionId))
        .map(p => p.permissionName);
    }

    // Open the dialog, passing the template and the data
    this.dialog.open(templateRef, {
      width: '450px',
      data: {
        roleName: role.roleName,
        permissions: permissionNames.length > 0 ? permissionNames : ['No permissions assigned']
      }
    });
  }


  editRole(role: any) {
    this.isEditMode = true;
    this.showForm = true; // Open the form
    this.selectedRoleId = role.roleId;

    this.roleForm.patchValue({
      roleName: role.roleName,
      description: role.description,
      permissionIds: role.permissionIds
    });
  }

  deleteRole(id: number) {
    if (confirm("Are you sure you want to delete this role?")) {
      this.roleService.deleteRole(id).subscribe(() => {
        this.loadRoles();
      });
    }
  }

  cancelEdit() {
    this.isEditMode = false;
    this.roleForm.reset();
    this.roleForm.patchValue({
      permissionIds: []
    });
  }

  getPermissionNames(permissionIds: number[]): string {
    if (!permissionIds || permissionIds.length === 0) {
      return "No Permissions";
    }

    return this.permissions
      .filter(p => permissionIds.includes(p.permissionId))
      .map(p => p.permissionName)
      .join(", ");
  }
}