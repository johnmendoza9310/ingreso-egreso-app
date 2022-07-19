import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {
  public ingresosEgresos: IngresoEgreso[] = [];
  private _ingresosSubs!: Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this._ingresosSubs = this.store.select('ingresosEgresos')
    .subscribe( ({ items })=> this.ingresosEgresos = items );
  }

  ngOnDestroy(): void {
    this._ingresosSubs.unsubscribe();
  }
  public borrar(item: IngresoEgreso):void{
    const value = item.uid;
    this.ingresoEgresoService.borrarIngresoEgreso(value!)
    .then( () => Swal.fire('Borrado', 'Item borrado', 'success'))
    .catch( err=> Swal.fire('Borrado', err.message, 'error'))
  }

}
