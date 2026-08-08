import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AngularMaterailModules } from "../../../AngularMeterialModules";
import { InventoryService } from '../../../services/inventory/inventory.service';


export interface InventoryItem {
  id: string;
  name: string;
  batchNo: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  expiryDate: Date | null;
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
export class InventoryReportComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'id',
    'name',
    'batchNo',
    'reorderLevel',
    'quantity',
    'expiryDate',
    // 'status'
    // 'stockStatus',
    'expiryStatus'
  ]

  dataSource!: MatTableDataSource<InventoryItem>;

  generatedTime = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  totalItems = 0;
  lowStockItems = 0;
  outOfStockItems = 0;
  expiredItems = 0;


  inventoryData: InventoryItem[] = [];

  constructor(private inventoryService: InventoryService,
  ) { }


  ngOnInit(): void {
    this.loadReport();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  processInventoryData() {
    this.totalItems = 0;
    this.lowStockItems = 0;
    this.outOfStockItems = 0;
    this.expiredItems = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.totalItems = this.inventoryData.length;

    this.inventoryData.forEach(item => {
      if (item.quantity === 0) {
        item.stockStatus = "Out of Stock";
        this.outOfStockItems++;
      }
      else if (item.quantity > 0 && item.quantity <= item.reorderLevel) {
        item.stockStatus = 'Low Stock';
        this.lowStockItems++;
      }
      else {
        item.stockStatus = "In Stock";
      }

      // 

      if (!item.expiryDate) {

        item.expiryStatus = "No Expiry";

      }
      else {

        const expiry = new Date(item.expiryDate);
        expiry.setHours(0, 0, 0, 0);

        const diffDays = Math.ceil(
          (expiry.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
        );

        if (diffDays < 0) {

          item.expiryStatus = "Expired";

          // Count only expired stock that still exists
          if (item.quantity > 0) {
            this.expiredItems++;
          }

        }
        else if (diffDays <= 7) {

          item.expiryStatus = "Expiring Soon";

        }
        else {

          item.expiryStatus = "Good";

        }

      }
    });



    this.dataSource = new MatTableDataSource(this.inventoryData);
  }

  loadReport() {
    this.inventoryService.getInventoryReport().subscribe((res: any[]) => {
      this.inventoryData = res.map(item => ({
        id: item.itemSku,
        name: item.itemName,
        batchNo: item.batchNumber,
        quantity: item.currentQuantity,
        unit: item.unit,
        reorderLevel: item.reorderLevel,
        expiryDate: item.expiryDate ? new Date(item.expiryDate) : null
      }));
      this.processInventoryData();
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    });

  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }


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
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Batches: ${this.totalItems}`, 14, 36);


    const bodyData = this.dataSource.filteredData.map(item => [
      item.id,
      item.name,
      item.batchNo,
      item.quantity.toString(),
      item.expiryDate.toLocaleDateString(),
      // item.stockStatus,
      item.expiryStatus
    ]);

    autoTable(doc, {
      startY: 38,
      head: [['ID', 'Item Name', 'Batch No', 'Qty', 'Expiry Date', 'Expiry Status']],
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

    doc.setFontSize(10);

    doc.text(
      "Generated by Cake Shop Management System",
      14,
      doc.internal.pageSize.height - 10
    );
  }

  // printReport() {
  //   window.print();
  // }

}
