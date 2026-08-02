import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StockService } from '../../services/stock/stock.service';
import { AngularMaterailModules } from "../../AngularMeterialModules";

@Component({
  selector: 'app-inventory-stock',
  standalone: true,
  imports: [MatDialogActions, MatDialogContent, AngularMaterailModules, ReactiveFormsModule],
  templateUrl: './inventory-stock.component.html',
  styleUrl: './inventory-stock.component.scss'
})
export class InventoryStockComponent implements OnInit {

  stockForm: FormGroup;
  minDate: Date;

  constructor(private fb: FormBuilder,
    private stockService: StockService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<InventoryStockComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any
  ) {
    const today = new Date();
    this.minDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
   }

  ngOnInit(): void {

    this.stockForm = this.fb.group({
      quantityAdded: ['', [Validators.required, Validators.min(0.01)]],
      expiryDate: [''],
      batchNumber: ['Loading...'],
    });

    this.stockService.getNextBatchNumber(this.item.inventoryId).subscribe({
      next: (batchNum) => {
        this.stockForm.patchValue({ batchNumber: batchNum });
      },
      error: () => {
        this.stockForm.patchValue({ batchNumber: 'Auto-generated' })
      }
    });
  }

  saveStock(): void {
    if (this.stockForm.invalid) {
      return;
    }

    const payload = {
      inventoryId: this.item.inventoryId,
      quantityAdded: this.stockForm.value.quantityAdded,
      expiryDate: this.stockForm.value.expiryDate,
    };

    this.stockService.addStock(payload).subscribe({
      next: () => {
        this.snackBar.open("Stock added successfully", "OK", { duration: 3000 });

        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(error.error.message, "ERROR", { duration: 3000 });
      }
    });
  }



  generateBatchNumber(): string {
    const today = new Date();
    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const random = Math.floor(Math.random() * 9000) + 1000;

    return `BATCH-${year}${month}${day}-${random}`;
  }

}
