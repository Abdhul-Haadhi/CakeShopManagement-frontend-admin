import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularMaterailModules } from "../../AngularMeterialModules";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { NgIf, NgForOf, DatePipe, JsonPipe, NgClass } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { InventoryService } from '../../services/inventory/inventory.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { InventoryStockComponent } from '../../components/inventory-stock/inventory-stock.component';
import { StockHistoryComponent } from '../../components/stock-history/stock-history.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [AngularMaterailModules, MatToolbar, MatFormFieldModule, MatCard, MatFormField, ReactiveFormsModule, NgIf, NgForOf, MatSortModule, NgClass],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {

  ItemRegForm: FormGroup;
  showForm = false;
  saveButtonLabel: string = 'Save';
  submitted = false;
  isButtonDisabled = false;
  mode = 'add';
  selectedData!: any;
  listOfCategories: any = [];

  currentItemSku: string = '';

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  categories = [
    'BAKING',
    'DAIRY',
    'DECORATION',
    'PACKAGING',
    'OTHER'
  ];


  units = [
    'KG',
    'G',
    'L',
    'ML',
    'PCS'
  ];

  displayedColumns: string[] = [
    'itemId',
    'itemName',
    'category',
    'unit',
    'reorderLevel',
    'currentQuantity',
    'stockStatus',
    // 'expiryStatus',
    'actions',
  ];



  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private inventoryService: InventoryService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.ItemRegForm = this.fb.group({
      itemId: ['Loading...'],
      itemName: new FormControl('', [Validators.required,]),
      category: new FormControl('', [Validators.required,]),
      unit: new FormControl('', [Validators.required,]),
      reorderLevel: new FormControl('', [Validators.required,]),
    });

    // this.inventoryService.getItemSku().subscribe({
    //   next: (itemSku) => {
    //     this.ItemRegForm.patchValue({ itemId: itemSku });
    //   },
    //   error: () => {
    //     this.ItemRegForm.patchValue({ itemId: 'Auto-generated' });
    //   }
    // })

    this.populateData();

  }


  public populateData(): void {
    try {
      this.inventoryService.getAllItems().subscribe({
        next: (dataList: any) => {
          console.log("getiinggg:", dataList);

          if (dataList.length <= 0) {
            return;
          }

          this.dataSource = new MatTableDataSource(dataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        },
        error: (error) => {
          this.snackBar.open(error.error?.message, 'ERROR', { duration: 3000 })
        }
      });
    }
    catch (error) {
      this.snackBar.open(error.error?.message, 'ERROR', { duration: 3000 });
    }

  }


  loadNextSku(): void {
    this.ItemRegForm.patchValue({ itemId: 'Loading...' });
    this.inventoryService.getItemSku().subscribe({
      next: (itemSku) => {
        this.currentItemSku = itemSku;
        this.ItemRegForm.patchValue({ itemId: itemSku });
      },
      error: () => {
        this.currentItemSku = 'Auto-generated';
        this.ItemRegForm.patchValue({ itemId: 'Auto-generated' });
      }
    });
  }


  getStockStatus(item: any) {
    if (item.currentQuantity == 0) {
      return "Out of Stock";
    }
    if (item.currentQuantity <= item.reorderLevel) {
      return "Low Stock";
    }
    return "In Stock";
  }


  openStockDialog(item: any): void {
    const dialogRef = this.dialog.open(InventoryStockComponent, {
      width: '500px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.populateData();
      }
    });
  }


  openHistory(item: any) {
    this.dialog.open(StockHistoryComponent, {
      width: '900px',
      data: item,
    });
  }

  // openTransactions(item:any){
  //   this.dialog.open(TransactionHistoryComponent,{
  //     width:'800px',
  //     data:item
  //   })
  // }


  onSubmit(): void {
    Object.values(this.ItemRegForm.controls).forEach(control => {
      control.markAsTouched();
    });
    console.log("FORM VALUE:", this.ItemRegForm.value);

    try {
      if (this.mode === 'add') {
        if (this.ItemRegForm.valid) {
          const payload = {
            itemName: this.ItemRegForm.get('itemName').value,
            category: this.ItemRegForm.get('category').value,
            unit: this.ItemRegForm.get('unit').value,
            reorderLevel: this.ItemRegForm.get('reorderLevel').value,
          };

          this.inventoryService.addItems(payload).subscribe({
            next: (response: any) => {
              console.log("RESPONSE:", payload);

              if (response.inventoryId != null) {
                this.snackBar.open('Item added successfully', 'Ok', { duration: 3000 });
                this.refreshData();
                this.closeForm();
              }
            },
            error: (err) => {
              console.error("ADD ERROR:", err);
              const errorMessage = err.error?.message || 'Item already exists or an error occurred.';
              this.snackBar.open(errorMessage, 'ERROR', { duration: 3000 });
            }
          });
        }
        else {
          console.log("wrong");
          for (const i in this.ItemRegForm.controls) {
            this.ItemRegForm.controls[i].markAsDirty();
            this.ItemRegForm.controls[i].updateValueAndValidity();
          }
        }
      }
      else if (this.mode === 'edit') {

        const payload = {
          itemName: this.ItemRegForm.get('itemName').value,
          category: this.ItemRegForm.get('category').value,
          unit: this.ItemRegForm.get('unit').value,
          reorderLevel: this.ItemRegForm.get('reorderLevel').value,
        };

        this.inventoryService.editInventory(this.selectedData.inventoryId, payload).subscribe({
          next: (response: any) => {
            this.snackBar.open('Inventory item updated successfully', 'Ok', { duration: 3000 });
            this.refreshData();
            this.closeForm();
          },
          error: (error) => {
            console.error("UPDATE ERROR:", error);
            const errorMessage = error.error?.message || 'Update failed';
            this.snackBar.open(errorMessage, 'Error', { duration: 3000 });
          }
        });
      }
      this.mode = 'add';
      this.ItemRegForm.disable();
      this.isButtonDisabled = true;
      this.refreshData();
      this.closeForm();
    }
    catch (error) {
      this.snackBar.open("Something went wrong ", "Error", { duration: 3000 });
    }
  }

  public editData(data: any): void {

    this.showForm = true;
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
    this.ItemRegForm.enable();

    this.ItemRegForm.patchValue({
      ...data,
      itemId: data.itemSku || data.itemId,
    });

  }


  public deleteData(inventoryId: any): void {

    console.log("FULL OBJECT:", inventoryId);

    try {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result && !result.isConfirmed) {
          return;
        }


        this.inventoryService.deleteItem(inventoryId).subscribe({
          next: (response) => {
            console.log("Delete response:", response);

            const index = this.dataSource.data.findIndex((element) => element.inventoryId === inventoryId);
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.snackBar.open('Item deleted successfully!', 'Close', { duration: 3000 });
            this.refreshData();

          },
          error: (error) => {
            console.error("DELETE ERROR:", error);
            this.snackBar.open(error.error?.message || 'Delete failed', 'Close', { duration: 3000 });
          }
        });
      });
    }
    catch (error) {
      this.snackBar.open('Action failed with error ' + error, 'Close', { duration: 3000 });
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  public resetData(): void {
    this.ItemRegForm.reset();
    this.ItemRegForm.updateValueAndValidity();
    // this.saveButtonLabel = 'Save';
    this.saveButtonLabel = this.mode === 'edit' ? 'Edit' : 'Save';
    this.ItemRegForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;

    if (this.mode === 'add') {
      this.ItemRegForm.patchValue({ itemId: this.currentItemSku });
    }
    else if (this.mode === 'edit' && this.selectedData) {
      // Restore original selected item data on reset
      this.ItemRegForm.patchValue({
        ...this.selectedData,
        itemId: this.selectedData.itemSku || this.selectedData.itemId
      });
    }
  }


  public refreshData(): void {
    this.populateData();
  }

  closeForm() {
    this.showForm = false;
    this.ItemRegForm.reset();
    this.ItemRegForm.enable();
    this.saveButtonLabel = 'Save'
    this.submitted = false;
    this.isButtonDisabled = false;
  }

  openAddForm() {
    this.showForm = true;
    this.mode = 'add';
    this.saveButtonLabel = 'Save';
    this.ItemRegForm.enable();
    this.loadNextSku();
  }

}
