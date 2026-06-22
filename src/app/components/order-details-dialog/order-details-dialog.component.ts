import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-order-details-dialog',
  standalone: true,
  imports: [NgIf, NgFor, MatDialogContent, MatDialogActions, MatDialogModule],
  templateUrl: './order-details-dialog.component.html',
  styleUrl: './order-details-dialog.component.scss'
})
export class OrderDetailsDialogComponent implements OnInit {

  orders: any[] = [];
  expandedOrderId: number | null = null;
  selectedPreviewImage: string = '';

  @ViewChild('imagePreviewDialog') imagePreviewDialog!: TemplateRef<any>;

  constructor(
    private dialogRef: MatDialogRef<OrderDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
  ) { }


  ngOnInit(): void {

  }

  openImageLightbox(base64String: string) {
    this.selectedPreviewImage = base64String;
    this.dialog.open(this.imagePreviewDialog, {
      panelClass: 'lightbox-dialog-wrapper',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
