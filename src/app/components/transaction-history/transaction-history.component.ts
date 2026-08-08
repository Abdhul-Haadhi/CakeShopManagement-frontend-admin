import { Component, Inject, OnInit } from '@angular/core';
import { StockService } from '../../services/stock/stock.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DecimalPipe, NgIf, NgClass } from '@angular/common';
import { AngularMaterailModules } from '../../AngularMeterialModules';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [AngularMaterailModules, DecimalPipe, NgIf, NgClass],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent implements OnInit {

  displayedColumns: string[] = [
    'date',
    'type',
    'quantity',
    'batch',
    'reference',
    'remark'
  ];

  dataSource = new MatTableDataSource<any>();

  constructor(private stockService: StockService,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private dialogRef: MatDialogRef<TransactionHistoryComponent>,
  ) { }


  ngOnInit(): void {
    this.stockService.getStockTransactions(this.item.inventoryId).subscribe((res: any) => {
      console.log("ress:", res);
      
      this.dataSource.data = res;
    })
  }


  getChipClass(type: string): string {
    switch (type) {
      case 'IN':
        return 'text-chip-green';

      case 'OUT':
        return 'text-chip-red';

      case 'ADJUSTMENT':
        return 'text-chip-orange';

      default:
        return 'text-chip-grey';
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
