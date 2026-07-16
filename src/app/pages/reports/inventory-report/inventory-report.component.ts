import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AngularMaterailModules } from "../../../AngularMeterialModules";


export interface InventoryItem {
  id: string;
  name: string;
  batchNo: string;
  quantity: number;
  expiryDate: Date;
  // status?: string;
  stockStatus?: string;
  expiryStatus?: string;
}

@Component({
  selector: 'app-inventory-report',
  standalone: true,
  imports: [CommonModule, AngularMaterailModules],
  templateUrl: './inventory-report.component.html',
  styleUrl: './inventory-report.component.scss'
})
export class InventoryReportComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'name',
    'batchNo',
    'quantity',
    'expiryDate',
    // 'status'
    'stockStatus',
    'expiryStatus'
  ]

  dataSource!: MatTableDataSource<InventoryItem>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  totalItems = 0;
  lowStockItems = 0;
  outOfStockItems = 0;
  expiredItems = 0;

  // Mock Data
  inventoryData: InventoryItem[] = [
    { id: 'ITM-0001', name: 'Sugar', batchNo: 'SUG-20260705-0001', quantity: 50, expiryDate: new Date('2026-12-31') },
    { id: 'ITM-0002', name: 'Flour', batchNo: 'FLO-20260708-0001', quantity: 5, expiryDate: new Date('2026-10-15') },
    { id: 'ITM-0003', name: 'Vanilla', batchNo: 'VAN-20260709-0001', quantity: 0, expiryDate: new Date('2027-01-20') },
    { id: 'ITM-0004', name: 'Baking Powder', batchNo: 'BAK-20260710-0001', quantity: 12, expiryDate: new Date('2026-07-10') },
    { id: 'ITM-0005', name: 'Dark Chocolate', batchNo: 'DAR-20260710-0001', quantity: 8, expiryDate: new Date('2026-08-30') },
    { id: 'ITM-0006', name: 'Butter', batchNo: 'BUT-20260711-0001', quantity: 25, expiryDate: new Date('2026-09-10') }
  ];

  ngOnInit(): void {
    this.processInventoryData();
  }

  processInventoryData() {
    const today = new Date();

    this.inventoryData.forEach(item => {
      if (item.expiryDate < today) {
        item.expiryStatus = 'Expired';
        this.expiredItems++;
      }
      else if (item.expiryDate > today) {
        item.expiryStatus = 'Good';
        this.expiredItems++;
      }
      if (item.quantity === 0) {
        item.stockStatus = "Out of Stock";
        this.outOfStockItems++;
      }
      else if (item.quantity > 0 && item.quantity <= 10) {
        item.stockStatus = 'Low Stock';
        this.lowStockItems++;
      }
      else {
        item.stockStatus = "In Stock";
      }
    });

    this.totalItems = this.inventoryData.length;

    this.dataSource = new MatTableDataSource(this.inventoryData);
  }

  ngAfterViewInit() {
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

    doc.setFontSize(18);
    doc.text('Inventory Stock Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);


    const bodyData = this.dataSource.filteredData.map(item => [
      item.id,
      item.name,
      item.batchNo,
      item.quantity.toString(),
      item.expiryDate.toLocaleDateString(),
      item.stockStatus,
      item.expiryStatus
    ]);

    autoTable(doc, {
      startY: 36,
      head: [['ID', 'Item Name', 'Batch No', 'Qty', 'Expiry Date', 'Stock Status', 'Expiry Status']],
      body: bodyData,
      theme: 'grid',
      headStyles: { fillColor: [3, 74, 156] },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 5) {
          if (data.cell.raw === 'Out of Stock') data.cell.styles.textColor = [220, 38, 38];
          if (data.cell.raw === 'Low Stock') data.cell.styles.textColor = [217, 119, 6];
          if (data.cell.raw === 'Expired') data.cell.styles.textColor = [71, 85, 105];
          if (data.cell.raw === 'In Stock') data.cell.styles.textColor = [22, 163, 74];
          if (data.cell.raw === 'Good') data.cell.styles.textColor = [22, 163, 74];
        }
      }
    });
    doc.save('Inventory_Stock_Report.pdf');
  }

  // printReport() {
  //   window.print();
  // }

}
