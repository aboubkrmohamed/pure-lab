import { PatientsTrendData as PatientsTrendData  } from './../../../../core/services/models/summary.model';
import { Component, OnInit, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { SummaryService } from '../../../../core/services/summary-service';

Chart.register(...registerables);

@Component({
  selector: 'app-patients-trend',
  imports: [BaseChartDirective],
  templateUrl: './patients-trend.html',
  styleUrl: './patients-trend.scss',
})
export class PatientsTrend implements OnInit{
private service = inject(SummaryService);

  trend = signal<PatientsTrendData | null>(null);

  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  ngOnInit() {
    this.service.getTrend().subscribe(t => {
      this.trend.set(t);
      this.chartData = {
        labels: t.points.map(p => p.hour),
        datasets: [{
          data: t.points.map(p => p.patients),
          borderColor: '#e8671f',
          backgroundColor: 'rgba(232,103,31,.15)',
          fill: true,
          tension: 0.35,
        }],
      };
    });
  }
}
