import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeRegistrationService } from '../../../services/employeeRegistration/employee-registration.service';
import { RoleService } from '../../../services/role/role.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgFor, NgClass, NgIf, DatePipe } from '@angular/common';
import { AngularMaterailModules } from '../../../AngularMeterialModules';
import { FormsModule } from '@angular/forms';
import { EmployeeReportDto } from '../../../services/employeeRegistration/employee-report-dto.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-employee-report',
  standalone: true,
  imports: [MatTableModule, NgFor, NgClass, NgIf, DatePipe, AngularMaterailModules, FormsModule,],
  templateUrl: './employee-report.component.html',
  styleUrl: './employee-report.component.scss'
})
export class EmployeeReportComponent implements OnInit {

  dataSource!: MatTableDataSource<EmployeeReportDto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Summary Card Metrics
  totalEmployees = 0;
  activeEmployees = 0;
  pendingLoginEmployees = 0;
  joinedThisMonth = 0;

  reportData: EmployeeReportDto[] = [];
  roles: any[] = [];
  selectedRoleId: number | null = null;
  activeOnlyFilter: boolean = false;


  displayedColumns: string[] = [
    'employeeId',
    'employeeName',
    'email',
    'roleName',
    'phone',
    'status',
    'joinDate'
  ];


  constructor(
    private employeeService: EmployeeRegistrationService,
    private roleService: RoleService
  ) { }



  ngOnInit(): void {
    this.loadRoles();
    this.fetchReport();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe((data: any) => {
      this.roles = data;
    });
  }

  fetchReport(): void {
    this.employeeService.getEmployeeReport(this.selectedRoleId || undefined, this.activeOnlyFilter)
      .subscribe((data: EmployeeReportDto[]) => {
        this.reportData = data.map(emp => ({
          ...emp,
          joinDate: emp.joinDate ? new Date(emp.joinDate) : ''
        }));
        this.processReportData();
      });
  }

  processReportData(): void {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    this.totalEmployees = this.reportData.length;
    this.activeEmployees = this.reportData.filter(e => e.status === 'Active').length;
    this.pendingLoginEmployees = this.reportData.filter(e => e.status !== 'Active').length;

    this.joinedThisMonth = this.reportData.filter(e => {
      if (!e.joinDate) return false;
      const joinDate = new Date(e.joinDate);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;

    this.dataSource = new MatTableDataSource(this.reportData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFilterChange(): void {
    this.fetchReport();
  }

  resetFilters(): void {
    this.selectedRoleId = null;
    this.activeOnlyFilter = false;
    this.fetchReport();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToPDF(): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('Employee Directory & Status Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Table Mapping
    const bodyData = this.dataSource.filteredData.map(e => [
      e.employeeId.toString(),
      e.employeeName,
      e.email,
      e.roleName,
      e.phone,
      e.status,
      e.joinDate ? new Date(e.joinDate).toLocaleDateString() : 'N/A'
    ]);

    autoTable(doc, {
      startY: 36,
      head: [['ID', 'Employee Name', 'Email', 'Role', 'Contact', 'Status', 'Join Date']],
      body: bodyData,
      theme: 'grid',
      headStyles: { fillColor: [3, 74, 156] },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 5) {
          if (data.cell.raw === 'Active') data.cell.styles.textColor = [22, 163, 74];
          if (data.cell.raw === 'Pending Login') data.cell.styles.textColor = [217, 119, 6];
        }
      }
    });

    doc.save(`Employee_Report_${new Date().toLocaleDateString()}.pdf`);
  }

  printReport(): void {
    window.print();
  }

}
