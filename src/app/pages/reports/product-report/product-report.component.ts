import { NgClass, NgFor, NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularMaterailModules } from '../../../AngularMeterialModules';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductReportDto } from '../../../services/productRegistration/ProductReportDto.model';
import { ProductRegistrationService } from '../../../services/productRegistration/product-registration.service';
import { AdminService } from '../../../admin/service/admin.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-report',
  standalone: true,
  imports: [AngularMaterailModules, NgClass, NgFor, NgIf, DatePipe, FormsModule, CurrencyPipe],
  templateUrl: './product-report.component.html',
  styleUrl: './product-report.component.scss'
})
export class ProductReportComponent implements OnInit {

  displayedColumns: string[] = [
    'productSku',
    'productName',
    'categoryName',
    'priceDisplay',
    'variantCount',
    'availabilityStatus',
    'addedDate'
  ];


  dataSource!: MatTableDataSource<ProductReportDto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Summary Card Metrics
  totalProducts = 0;
  inStockProducts = 0;
  outOfStockProducts = 0;
  totalCategories = 0;

  reportData: ProductReportDto[] = [];
  categories: any[] = [];
  selectedCategoryId: number | null = null;
  inStockOnlyFilter: boolean = false;


  selectedProduct: any = null;
  selectedVariants: any[] = [];
  isLoadingVariants: boolean = false;

  constructor(
    private productService: ProductRegistrationService,
    private categoryService: AdminService,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.loadCategories();
    this.fetchReport();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  fetchReport(): void {
    this.productService.getProductReport(this.selectedCategoryId || undefined)
      .subscribe((data: ProductReportDto[]) => {
        let filtered = data.map(prod => ({
          ...prod,
          addedDate: prod.addedDate ? new Date(prod.addedDate) : ''
        }));

        if (this.inStockOnlyFilter) {
          filtered = filtered.filter(p => p.availabilityStatus === 'In Stock');
        }

        this.reportData = filtered;
        this.processReportData();
      });
  }

  processReportData(): void {
    this.totalProducts = this.reportData.length;
    this.inStockProducts = this.reportData.filter(p => p.availabilityStatus === 'In Stock').length;
    this.outOfStockProducts = this.reportData.filter(p => p.availabilityStatus !== 'In Stock').length;

    // Unique Categories Count
    const uniqueCats = new Set(this.reportData.map(p => p.categoryName));
    this.totalCategories = uniqueCats.size;

    this.dataSource = new MatTableDataSource(this.reportData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openVariantsDialog(templateRef: TemplateRef<any>, product: ProductReportDto): void {
    this.selectedProduct = product;
    this.selectedVariants = product.variants || [];
    this.isLoadingVariants = false;

    this.dialog.open(templateRef, {
      width: '450px'
    });
  }

  onFilterChange(): void {
    this.fetchReport();
  }

  resetFilters(): void {
    this.selectedCategoryId = null;
    this.inStockOnlyFilter = false;
    this.fetchReport();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToPDF(): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('Product Inventory & Price Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Table Mapping
    const bodyData = this.dataSource.filteredData.map(p => [
      p.productSku,
      p.productName,
      p.categoryName || 'Unassigned',
      p.priceDisplay,
      p.variantCount.toString(),
      p.availabilityStatus,
      p.addedDate ? new Date(p.addedDate).toLocaleDateString() : 'N/A'
    ]);

    autoTable(doc, {
      startY: 36,
      head: [['SKU', 'Product Name', 'Category', 'Selling Price', 'Variants', 'Status', 'Added Date']],
      body: bodyData,
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] }, // Cake shop warm crimson tone
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 5) {
          if (data.cell.raw === 'In Stock') data.cell.styles.textColor = [22, 163, 74];
          if (data.cell.raw === 'Out of Stock') data.cell.styles.textColor = [217, 119, 6];
          if (data.cell.raw === 'Inactive') data.cell.styles.textColor = [220, 38, 38];
        }
      }
    });

    doc.save(`Product_Report_${new Date().toLocaleDateString()}.pdf`);
  }

  printReport(): void {
    window.print();
  }

}
