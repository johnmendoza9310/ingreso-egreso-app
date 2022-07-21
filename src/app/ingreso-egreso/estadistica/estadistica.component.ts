import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';;
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit {
  public ingresos: number = 0;
  public egresos: number = 0;

  public totalIngresos: number = 0;
  public totalEgresos: number = 0;

  // Doughnut
  public doughnutChartLabels: string[] = [
    'Ingresos',
    'Egresos',
  ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [] }
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';


  // constructor(private store: Store<AppState>) {}
  constructor(private store: Store<AppStateWithIngreso>) {}


  //el reducer de ingresos egresos se cargo de forma perezosa, AppState no sabe que tambien tiene ingresoEgreso, el proble es de interfaz
  //Se implementa extension de AppState original que contenga ingresosegresos
  ngOnInit(): void {
    this.store
      .select('ingresosEgresos')
      .subscribe(({ items }) => this.generarEstadistica(items));
  }

  generarEstadistica(items: IngresoEgreso[]): void {

    this.totalIngresos = 0;
    this.totalEgresos = 0;
    this.ingresos = 0;
    this.egresos = 0;
    
    
    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    }

    this.doughnutChartData.datasets = [{data: [this.totalIngresos, this.totalEgresos]}]
  }
}
