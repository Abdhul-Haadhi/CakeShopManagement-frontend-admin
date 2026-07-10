import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AngularMaterailModules } from '../../AngularMeterialModules';
import { StockService } from '../../services/stock/stock.service';


@Component({
  selector: 'app-stock-history',
  standalone: true,
  imports: [AngularMaterailModules],
  templateUrl: './stock-history.component.html',
  styleUrl: './stock-history.component.scss'
})
export class StockHistoryComponent implements OnInit {

  displayedColumns = [
    'batch',
    'quantity',
    'received',
    'expiry'
  ];

  dataSource = new MatTableDataSource<any>();

  constructor(private stockService: StockService,
    @Inject(MAT_DIALOG_DATA) public item: any,
  ) { }


  ngOnInit(): void {

    this.stockService.getStockHistory(this.item.inventoryId).subscribe((res: any) => {
      this.dataSource.data = res;
    });

  }



}
