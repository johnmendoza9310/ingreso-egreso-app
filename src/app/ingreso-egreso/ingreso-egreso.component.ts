import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoEgresoForm!: FormGroup;
  public tipo: string = 'ingreso';
  public cargando: boolean = false;
  private _loadingSubs!: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {

    this._loadingSubs = this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading)
    this._initForm();
  }
  ngOnDestroy(): void {
    this._loadingSubs.unsubscribe();
      
  }

  private _initForm(): void {
    this.ingresoEgresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }

  public guardar(): void {

    // this.store.dispatch(ui.isLoading());
    // setTimeout(() => {
    //   //cancelar loading
    //   this.store.dispatch(ui.stopLoading());
    // }, 2500);


    if (this.ingresoEgresoForm.invalid) {
      return;
    }
    // console.log(this.ingresoEgresoForm.value);
    // console.log(this.tipo);
    
    this.store.dispatch(ui.isLoading());

    const { descripcion, monto } = this.ingresoEgresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoEgresoForm.reset();
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Registro creado', descripcion, 'success');
      })
      .catch((err) => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Error', err.message, 'error');
      });
  }
}
