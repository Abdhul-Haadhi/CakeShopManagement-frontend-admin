import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AngularMaterailModules } from "../../../AngularMeterialModules";
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { CustomerRegistrationService } from '../../../services/customerRegistration/customer-registration.service';



export interface CustomerData {
  customerId: string;
  customerName: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
  firstOrderDate: Date;
  status?: string;
}


@Component({
  selector: 'app-customer-report',
  standalone: true,
  imports: [AngularMaterailModules, NgClass, DatePipe, DecimalPipe],
  templateUrl: './customer-report.component.html',
  styleUrl: './customer-report.component.scss'
})
export class CustomerReportComponent implements OnInit {

  displayedColumns: string[] = [
    'customerName',
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
  registeredCustomers = 0;
  guestCustomers = 0;

  customers: CustomerData[] = [];

  constructor(private customerService: CustomerRegistrationService) {

  }

  ngOnInit(): void {
    this.customerService.getCustomerReport().subscribe((res: any) => {
      console.log("getting:", res);

      this.customers = res.map((customer: any) => ({
        ...customer,
        lastOrderDate: customer.lastOrderDate
          ? new Date(customer.lastOrderDate)
          : null,
        firstOrderDate: customer.firstOrderDate
          ? new Date(customer.firstOrderDate)
          : null
      }));
      this.processCustomerData();
    });
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  // processCustomerData() {
  //   const today = new Date();
  //   const currentMonth = today.getMonth();
  //   const currentYear = today.getFullYear();
  //   const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));


  //   this.customers.forEach(customer => {
  //     if (customer.totalSpent >= 40000) {
  //       customer.status = 'VIP';
  //       this.vipCustomers++;
  //       this.activeCustomers++;
  //     }
  //     else if (customer.lastOrderDate >= thirtyDaysAgo) {
  //       customer.status = 'Active';
  //       this.activeCustomers++;
  //     }
  //     else {
  //       customer.status = 'Inactive';
  //     }

  //     if (customer.lastOrderDate.getMonth() === currentMonth && customer.lastOrderDate.getFullYear() === currentYear && customer.totalOrders === 1) {
  //       this.newCustomersThisMonth++;
  //     }

  //   });

  //   this.totalCustomers = this.customers.length;

  //   if (this.newCustomersThisMonth === 0) {
  //     this.newCustomersThisMonth = 7;
  //   }

  //   this.dataSource = new MatTableDataSource(this.customers);

  // }

  // processCustomerData() {
  //   const today = new Date();
  //   const currentMonth = today.getMonth();
  //   const currentYear = today.getFullYear();

  //   this.totalCustomers = this.customers.length;

  //   this.activeCustomers = this.customers.filter(c =>
  //     c.status === 'Active' || c.status === 'Regular'
  //   ).length;

  //   this.regularCustomers = this.customers.filter(c =>
  //     c.status === 'Regular'
  //   ).length;

  //   this.newCustomersThisMonth = this.customers.filter(c => {
  //     const firstOrder = new Date(c.firstOrderDate);

  //     return (
  //       firstOrder.getMonth() === currentMonth &&
  //       firstOrder.getFullYear() === currentYear
  //     );
  //   }).length;

  //   this.dataSource = new MatTableDataSource(this.customers);
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;

  // }


  processCustomerData() {

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    this.totalCustomers = this.customers.length;

    this.registeredCustomers = this.customers.filter(c =>
      c.status === 'Registered'
    ).length;

    this.guestCustomers = this.customers.filter(c =>
      c.status === 'Guest'
    ).length;

    this.newCustomersThisMonth = this.customers.filter(c => {

      const firstOrder = new Date(c.firstOrderDate);

      return (
        firstOrder.getMonth() === currentMonth &&
        firstOrder.getFullYear() === currentYear
      );

    }).length;

    this.dataSource = new MatTableDataSource(this.customers);

    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

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
      c.customerName,
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
          if (data.cell.raw === 'Registered') data.cell.styles.textColor = [22, 163, 74];
          if (data.cell.raw === 'Guest') data.cell.styles.textColor = [239, 68, 68];
        }
      }
    });

    doc.save(`Customer_Report_${new Date().toLocaleDateString()}.pdf`);
  }

  printReport() {
    window.print();
  }

}
