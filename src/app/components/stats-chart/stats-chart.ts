import { Component, Input, OnInit } from '@angular/core';
import { PokemonStat } from '../../models/pokemon.model';
import { ChartConfiguration, ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  standalone: true,
  imports: [CommonModule, BaseChartDirective], 
  selector: 'app-stats-chart',
  templateUrl: './stats-chart.html',
  styleUrls: ['./stats-chart.scss']
})
export class StatsChartComponent implements OnInit {
  @Input() stats!: PokemonStat[];

  radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent'
        },
        pointLabels: {
          font: {
            size: 12,
            weight: 'bold'
          },
          color: '#666'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    }
  };

  radarChartData!: ChartData<'radar'>;

  ngOnInit(): void {
    this.prepareChartData();
  }

  ngOnChanges(): void {
    this.prepareChartData();
  }

  private prepareChartData(): void {
    if (!this.stats) return;
    
    this.radarChartData = {
      labels: this.stats.map(stat => stat.name),
      datasets: [
        {
          data: this.stats.map(stat => stat.base_stat),
          label: 'Stats',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        }
      ]
    };
  }
}