import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularMaterailModules } from '../../../AngularMeterialModules';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InventoryService } from '../../../services/inventory/inventory.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InventorySummary {

  id: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  unit: string;

  stockStatus?: string;

}

@Component({
  selector: 'app-inventory-summary-report',
  standalone: true,
  imports: [CommonModule, AngularMaterailModules],
  templateUrl: './inventory-summary-report.component.html',
  styleUrl: './inventory-summary-report.component.scss'
})
export class InventorySummaryReportComponent implements OnInit {

  displayedColumns = [
    'id',
    'name',
    'reorderLevel',
    'quantity',
    'stockStatus'
  ];

  dataSource!: MatTableDataSource<InventorySummary>;
  inventoryData: InventorySummary[] = [];
  generatedTime = new Date();

  totalItems = 0;
  lowStockItems = 0;
  outOfStockItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport() {
    this.inventoryService.getInventorySummaryReport().subscribe((res: any) => {
      console.log("getitng:", res);

      this.inventoryData = res.map(item => ({
        id: item.itemSku,
        name: item.itemName,
        quantity: item.currentQuantity,
        reorderLevel: item.reorderLevel,
        unit: item.unit
      }));
      this.processInventory();
    });
  }

  processInventory() {
    this.totalItems = this.inventoryData.length;
    this.lowStockItems = 0;
    this.outOfStockItems = 0;

    this.inventoryData.forEach(item => {
      if (item.quantity == 0) {
        item.stockStatus = 'Out of Stock';
        this.outOfStockItems++;
      }
      else if (item.quantity <= item.reorderLevel) {
        item.stockStatus = 'Low Stock';
        this.lowStockItems++;
      }
      else {
        item.stockStatus = 'In Stock';
      }
    });
    this.dataSource = new MatTableDataSource(this.inventoryData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Inventory Summary Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Items: ${this.totalItems}`, 14, 36);

    autoTable(doc, {
      startY: 38,
      head: [['Item ID', 'Item Name', 'Reorder Level', 'Current Qty', 'Status']],
      body: this.dataSource.filteredData.map(item => [
        item.id,
        item.name,
        item.reorderLevel,
        `${item.quantity} ${item.unit}`,
        item.stockStatus
      ])
    });
    doc.save("Inventory_Summary_Report.pdf");
  }
}
