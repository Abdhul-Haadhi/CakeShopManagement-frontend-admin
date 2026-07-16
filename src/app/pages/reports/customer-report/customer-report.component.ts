import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AngularMaterailModules } from "../../../AngularMeterialModules";
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';



export interface CustomerData {
  customerId: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
  status?: string;
}


@Component({
  selector: 'app-customer-report',
  standalone: true,
  imports: [AngularMaterailModules, NgClass, DatePipe, DecimalPipe],
  templateUrl: './customer-report.component.html',
  styleUrl: './customer-report.component.scss'
})
export class CustomerReportComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'name',
    'phone',
    'totalOrders',
    'totalSpent',
    'lastOrderDate',
    'status'
  ];

  dataSource!: MatTableDataSource<CustomerData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  totalCustomers = 0;
  newCustomersThisMonth = 0;
  activeCustomers = 0;
  vipCustomers = 0;

  customers: CustomerData[] = [
    { customerId: 'C-001', name: 'Perera', phone: '0771234567', totalOrders: 12, totalSpent: 45000, lastOrderDate: new Date('2026-07-10') },
    { customerId: 'C-002', name: 'Michael', phone: '0719876543', totalOrders: 2, totalSpent: 8500, lastOrderDate: new Date('2026-07-12') },
    { customerId: 'C-003', name: 'Smith', phone: '0764567890', totalOrders: 1, totalSpent: 3000, lastOrderDate: new Date('2025-12-15') },
    { customerId: 'C-004', name: 'David', phone: '0701112222', totalOrders: 25, totalSpent: 125000, lastOrderDate: new Date('2026-07-01') },
    { customerId: 'C-005', name: 'Silva', phone: '0773334444', totalOrders: 5, totalSpent: 18000, lastOrderDate: new Date('2026-06-28') },
    { customerId: 'C-006', name: 'Amanda', phone: '0773334444', totalOrders: 7, totalSpent: 22000, lastOrderDate: new Date('2026-06-29') },
    { customerId: 'C-007', name: 'Stefan', phone: '0773334444', totalOrders: 6, totalSpent: 20000, lastOrderDate: new Date('2026-06-30') },
  ];

  ngOnInit(): void {
    this.processCustomerData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  processCustomerData() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));


    this.customers.forEach(customer => {
      if (customer.totalSpent >= 40000) {
        customer.status = 'VIP';
        this.vipCustomers++;
        this.activeCustomers++;
      }
      else if (customer.lastOrderDate >= thirtyDaysAgo) {
        customer.status = 'Active';
        this.activeCustomers++;
      }
      else {
        customer.status = 'Inactive';
      }

      if (customer.lastOrderDate.getMonth() === currentMonth && customer.lastOrderDate.getFullYear() === currentYear && customer.totalOrders === 1) {
        this.newCustomersThisMonth++;
      }

    });

    this.totalCustomers = this.customers.length;

    if (this.newCustomersThisMonth === 0) {
      this.newCustomersThisMonth = 7;
    }

    this.dataSource = new MatTableDataSource(this.customers);

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  exportToPDF() {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('Customer Analysis Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Table mapping
    const bodyData = this.dataSource.filteredData.map(c => [
      c.name,
      c.phone,
      c.totalOrders.toString(),
      `Rs. ${c.totalSpent.toLocaleString()}`,
      c.lastOrderDate.toLocaleDateString(),
      c.status
    ]);

    autoTable(doc, {
      startY: 36,
      head: [['Customer Name', 'Contact', 'Orders', 'Total Spent', 'Last Order', 'Status']],
      body: bodyData,
      theme: 'grid',
      headStyles: { fillColor: [3, 74, 156] },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 5) {
          if (data.cell.raw === 'VIP') data.cell.styles.textColor = [147, 51, 234]; // Purple
          if (data.cell.raw === 'Active') data.cell.styles.textColor = [22, 163, 74]; // Green
          if (data.cell.raw === 'Inactive') data.cell.styles.textColor = [100, 116, 139]; // Gray
        }
      }
    });

    doc.save(`Customer_Report_${new Date().toLocaleDateString()}.pdf`);
  }

  printReport() {
    window.print();
  }

}
