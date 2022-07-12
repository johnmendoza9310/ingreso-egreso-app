import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
//tap efecto secundario
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authServices: AuthService,
              private router: Router){}
  canActivate(): Observable<boolean>{
    return this.authServices.isAuth()
    .pipe(
      tap( estado => {
        if( !estado){this.router.navigate(['/login'])}
      }))
  }
  
}
