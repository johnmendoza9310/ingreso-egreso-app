import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';


import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubs!: Subscription;
  ingresosSubs!: Subscription;

  constructor(private store: Store<AppState>, 
              private ingresoEgresoService: IngresoEgresoService) {}

  ngOnInit(): void {
    this.userSubs = this.store
      .select('user')
      .pipe(
        //Este observable emite dos veces el user, uno con vacio y otro con informacion
        //filer evita que pase la información si es vacia
        filter((auth) => auth.user.uid != '')
      )
      .subscribe(({user}) => {
        this.ingresosSubs = this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
        .subscribe( ingresosEgresosFB => {
          this.store.dispatch( ingresoEgresoActions.setItems({ items: ingresosEgresosFB }) )
        })
      });
  }

  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
    this.ingresosSubs?.unsubscribe();
  }
}
