import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore ) { }

  //informacipon de cuándo esta activo el usuario
  initAuthListener(){

    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
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
