import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import { Scale } from 'chart.js/dist';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AngularMaterailModules } from "../../../AngularMeterialModules";
import { DecimalPipe } from '@angular/common';

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
  imports: [AngularMaterailModules,DecimalPipe],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.scss'
})
export class SalesReportComponent implements OnInit, AfterViewInit {

  @ViewChild('barChart') barChartCanvas!: ElementRef;
  @ViewChild('lineChart') lineChartCanvas!: ElementRef;

  selectedRange: string = 'monthly';

  totalOrders = 745;
  totalRevenue = 352000; // Rs.
  totalItemsSold = 1250;
  avgOrderValue = 535;

  barChart: any;
  lineChart: any;

  displayedColumns: string[] = [
    'rank',
    'name',
    'category',
    'qtySold',
    'revenue'
  ];

  dataSource = new MatTableDataSource<TopProduct>([
    { rank: 1, name: 'Chocolate Truffle Cake (1kg)', category: 'Cakes', qtySold: 124, revenue: 310000 },
    { rank: 2, name: 'Red Velvet Cupcake', category: 'Desserts', qtySold: 340, revenue: 85000 },
    { rank: 3, name: 'Butter Croissant', category: 'Baking', qtySold: 215, revenue: 53750 },
    { rank: 4, name: 'Custom Birthday Cake', category: 'Custom Orders', qtySold: 45, revenue: 225000 }
  ]);

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.renderCharts();
  }

  onRangeChange(range: string) {
    this.selectedRange = range;
  }

  renderCharts() {
    this.barChart = new Chart(this.barChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Total Orders',
          data: [120, 150, 180, 130, 190, 240],
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
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue (LKR.)',
          data: [50000, 75000, 80000, 60000, 100000, 140000],
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
