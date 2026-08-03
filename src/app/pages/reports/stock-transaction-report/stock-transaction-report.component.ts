import { NgClass, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularMaterailModules } from '../../../AngularMeterialModules';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StockService } from '../../../services/stock/stock.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';


export interface TransactionData {
  transactionId: number;
  transactionDate: Date;
  itemSku: string;
  itemName: string;
  batchNumber: string;
  transactionType: string;
  quantity: number;
  remainingQuantity: number;
  employeeName: string;
}

@Component({
  selector: 'app-stock-transaction-report',
  standalone: true,
  imports: [AngularMaterailModules, NgClass, DatePipe, DecimalPipe],
  templateUrl: './stock-transaction-report.component.html',
  styleUrl: './stock-transaction-report.component.scss'
})
export class StockTransactionReportComponent implements OnInit {

  displayedColumns: string[] = [
    'transactionId',
    'date',
    'itemSku',
    'itemName',
    'batchNumber',
    'transactionType',
    'quantity',
    'remainingQuantity',
    'employeeName'
  ];


  dataSource!: MatTableDataSource<TransactionData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  // Summary Card Variables
  totalTransactions = 0;
  stockInCount = 0;
  stockOutCount = 0;
  todaysTransactions = 0;

  transactions: TransactionData[] = [];

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.stockService.getStockTransactionReport().subscribe((res: any) => {
      console.log("getting transactions:", res);

      this.transactions = res.map((trans: any) => ({
        ...trans,
        transactionDate: new Date(trans.transactionDate)
      }));
      this.processTransactionData();
    });
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

  }


  processTransactionData() {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    this.totalTransactions = this.transactions.length;

    this.stockInCount = this.transactions.filter(t =>
      t.transactionType === 'Stock In'
    ).length;

    this.stockOutCount = this.transactions.filter(t =>
      t.transactionType === 'Stock Out'
    ).length;

    this.todaysTransactions = this.transactions.filter(t => {
      const transDate = new Date(t.transactionDate);
      return (
        transDate.getDate() === currentDay &&
        transDate.getMonth() === currentMonth &&
        transDate.getFullYear() === currentYear
      );
    }).length;

    this.dataSource = new MatTableDataSource(this.transactions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) => {

      const value = (
        data.itemSku +
        data.itemName +
        data.batchNumber +
        data.employeeName +
        data.transactionType
      ).toLowerCase();

      return value.includes(filter);
    };

    this.dataSource.filter = filterValue;
  }

  exportToPDF() {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('Stock Transaction Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Table mapping
    const bodyData = this.dataSource.filteredData.map(t => [
      t.transactionId,
      t.transactionDate.toLocaleDateString(),
      t.itemSku,
      t.itemName,
      t.batchNumber,
      t.transactionType,
      t.quantity,
      t.remainingQuantity,
      t.employeeName
    ]);

    autoTable(doc, {
      startY: 36,
      head: [['ID', 'Date', 'Item SKU', 'Item Name', 'Batch', 'Type', 'Qty', 'Remaining', 'Employee']],
      body: bodyData,
      theme: 'grid',
      headStyles: { fillColor: [3, 74, 156] }, // Deep Blue header
      didParseCell: function (data) {
        // Change text color for Transaction Type and Qty
        if (data.section === 'body') {
          // Column 4 (Type) and Column 5 (Qty)
          if (data.column.index == 5 || data.column.index == 6) {
            const rowType = data.row.raw[5]; // Check the transactionType string
            if (rowType === 'Stock In') {
              data.cell.styles.textColor = [21, 128, 61]; // Green
            } else if (rowType === 'Stock Out') {
              data.cell.styles.textColor = [185, 28, 28]; // Red
            }
          }
        }
      }
    });

    doc.save(`Stock_Transactions_${new Date().toLocaleDateString()}.pdf`);
  }

}
