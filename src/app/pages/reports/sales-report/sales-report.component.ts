import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import { Scale } from 'chart.js/dist';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AngularMaterailModules } from "../../../AngularMeterialModules";
import { DecimalPipe, NgIf } from '@angular/common';
import { OrderService } from '../../../services/order/order.service';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

Chart.register(...registerables);

export interface TopProduct {
  rank: number;
  name: string;
  category: string;
  qtySold: number;
  revenue: number;
}

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [AngularMaterailModules, DecimalPipe, FormsModule, NgIf],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.scss'
})
export class SalesReportComponent implements OnInit, AfterViewInit {

  @ViewChild('barChart') barChartCanvas!: ElementRef;
  @ViewChild('lineChart') lineChartCanvas!: ElementRef;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedRange: string = 'monthly';

  totalOrders = 0;
  totalRevenue = 0; // Rs.
  totalItemsSold = 0;
  avgOrderValue = 0
  barChart: any;
  lineChart: any;

  displayedColumns: string[] = [
    'rank',
    'name',
    'category',
    'qtySold',
    'revenue'
  ];

  startDate!: Date | null;
  endDate!: Date | null;

  constructor(private orderService: OrderService) { }

  dataSource = new MatTableDataSource<TopProduct>;

  ngOnInit(): void {
    // this.loadReport();
    this.onRangeChange('monthly');
  }

  ngAfterViewInit(): void {
    // this.renderCharts();
  }



  loadReport() {

    if (!this.startDate || !this.endDate) {
      return;
    }

    const start = this.formatDate(this.startDate);
    const end = this.formatDate(this.endDate);


    this.orderService.getSalesReport(start, end).subscribe(res => {

      console.log("Sales Report Response:", res);

      this.totalOrders = res.totalOrders;
      this.totalRevenue = res.totalRevenue;
      this.totalItemsSold = res.totalItemsSold;
      this.avgOrderValue = Math.round(res.averageOrderValue);

      console.log("Top Products:", res.topProducts);

      this.dataSource.data = res.topProducts.map((p: any, index: number) => ({
        rank: index + 1,
        name: p.productName,
        category: p.categoryName,
        qtySold: p.qtySold,
        revenue: p.revenue
      }));

      console.log("Datasource:", this.dataSource.data);

      if (this.barChart) this.barChart.destroy();
      if (this.lineChart) this.lineChart.destroy();

      this.renderCharts(res.monthlySales);
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onRangeChange(range: string) {
    this.selectedRange = range;
    const today = new Date();

    switch (range) {
      case 'daily':
        this.startDate = new Date(today);
        this.endDate = new Date(today);
        break;

      case 'weekly':
        this.startDate = new Date(today);
        this.startDate.setDate(today.getDate() - 6);
        this.endDate = new Date(today);
        break;

      case 'monthly':
        this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        this.endDate = new Date(today);
        break;

      case 'yearly':
        this.startDate = new Date(today.getFullYear(), 0, 1);
        this.endDate = new Date(today);
        break;

      case 'custom':
        this.startDate = null;
        this.endDate = null;
        return;
    }
    this.loadReport();
  }

  renderCharts(monthlyData: any[]) {
    this.barChart = new Chart(this.barChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: monthlyData.map(x => x.month),
        datasets: [{
          label: 'Orders',
          data: monthlyData.map(x => x.orders),
          backgroundColor: '#0284c7',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });


    this.lineChart = new Chart(this.lineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: monthlyData.map(x => x.month),
        datasets: [{
          label: 'Revenue',
          data: monthlyData.map(x => x.revenue),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });

  }

  printReport() {
    window.print();
  }

  exportToPDF() {
    const reportElement = document.getElementById('report-content')!;

    html2canvas(reportElement, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Sales_Report_${new Date().toLocaleDateString()}.pdf`);
    });
  }



}
