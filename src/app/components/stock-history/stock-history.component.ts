import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AngularMaterailModules } from '../../AngularMeterialModules';
import { StockService } from '../../services/stock/stock.service';
import { DecimalPipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-stock-history',
  standalone: true,
  imports: [AngularMaterailModules, DecimalPipe, NgIf, ReactiveFormsModule],
  templateUrl: './stock-history.component.html',
  styleUrl: './stock-history.component.scss'
})
export class StockHistoryComponent implements OnInit {

  displayedColumns = [
    'batch',
    'added',
    'remaining',
    'received',
    'expiry',
    'status'
  ];


  dataSource = new MatTableDataSource<any>();
  transactionData = new MatTableDataSource<any>();
  deductForm!: FormGroup;
  selectedBatch: any;


  constructor(private stockService: StockService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public item: any,
  ) { }


  ngOnInit(): void {

    this.deductForm = this.fb.group({
      quantity: ['', [Validators.required]],
      reason: ['', [Validators.required]],
    });

    this.loadHistory();
    this.loadTransactions();

  }

  loadHistory() {
    this.stockService.getStockHistory(this.item.inventoryId).subscribe((res: any) => {
       console.log('batch API Response:', res);
      this.dataSource.data = res;
    });
  }

  loadTransactions() {
    this.stockService.getStockTransactions(this.item.inventoryId).subscribe((res: any) => {
      console.log('Transaction API Response:', res);
      this.transactionData.data = res;
    });
  }

  selectBatch(batch: any) {

    this.selectedBatch = batch;

  }

  deductStock() {
    if (!this.selectedBatch) {
      this.snackBar.open("Select a batch first", "Close", { duration: 3000 });
      return;
    }
    this.stockService.deductStock(this.selectedBatch.stockId, this.deductForm.value).subscribe({
      next: () => {
        this.snackBar.open("Stock deducted", "Close", { duration: 3000 });
        this.deductForm.reset();
        this.loadHistory();
        this.loadTransactions();
      },
      error: (err) => {
        this.snackBar.open(err.error.message, "Close", { duration: 3000 });
      }
    })
  }


  getExpiryStatus(expiryDate: string): string {
    if (!expiryDate) {
      return 'No Expiry';
    }

    const today = new Date();

    const expiry = new Date(expiryDate);

    const diff = Math.ceil(expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diff < 0) {
      return 'Expired';
    }

    if (diff <= 7) {
      return 'Expiring Soon';
    }

    return 'Good';
  }



}
