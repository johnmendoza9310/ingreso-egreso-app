import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';


import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

import { map, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.models';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription!: Subscription;
  private _user!: Usuario;

  get user(){
    return this._user;
  }

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState> ) { }

  //informacipon de cuándo esta activo el usuario
  initAuthListener(){

    this.auth.authState.subscribe( fuser => {

      if (fuser) {
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`)
        .valueChanges()
        .subscribe((fireStoreUser: any) => {
          const user = Usuario.fromFirebase(fireStoreUser);
          this._user = user;
          // const temUser = new Usuario('abc', 'borrarme', 'fjfhfjf@gmail.com');
          // this.store.dispatch(authActions.setUser({user: user}))
          this.store.dispatch(authActions.setUser({user})) //cuando la propiedad y el valor son iguales
          
        });
      } else {
        this._user = {
            uid: '',
            nombre: '',
            email: ''
        }
        this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(ingresoEgresoActions.unSetItems());
      }
    })

  }


  //Regresa una promesa
  crearUsuario(nombre: string, email: string, password: string){

    return this.auth.createUserWithEmailAndPassword(email, password)
    .then( fbuser => {
      const newUser = new Usuario(fbuser.user!.uid, nombre, email);
      
      //Petición para crear documento de base de datos por cada usuario
      return this.firestore.doc(`${fbuser.user!.uid}/usuario`).set({...newUser})
    })

  }

  loginUsuario(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fbuser => fbuser!=null) //si es diferente de null regresa true
    )

  }
}
