import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public nombre: string = '';
  private _userSubs!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this._userSubs = this.store
      .select('user')
      .pipe( //solo deja pasar datos diferentes a null
        filter(({user})=> user !=null)
      )
      .subscribe(({ user }) => (this.nombre = user.nombre));
  }
  ngOnDestroy(): void {
    this._userSubs.unsubscribe();
  }
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
