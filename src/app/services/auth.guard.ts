import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
//tap efecto secundario
import { Observable, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authServices: AuthService, private router: Router) {}

  canLoad(): Observable<boolean> {
    return this.authServices.isAuth().pipe(
      tap((estado) => {
        if (!estado) {
          this.router.navigate(['/login']);
        }
      }),
      take(1) ///Cada ves que entro al modulo debo disparar una nueva suscripcion, entonces se debe cancelar la subscripcion cuando se resuelva la primer vez
    );
  }

  //Código antes de implementar el canload
  // canActivate(): Observable<boolean>{
  //   return this.authServices.isAuth()
  //   .pipe(
  //     tap( estado => {
  //       if( !estado){this.router.navigate(['/login'])}
  //     }))
  // }
}
