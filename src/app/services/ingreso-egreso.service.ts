import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  //fireStore para crear colección en firebase
  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService
  ) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    console.log('ingreso', { ...ingresoEgreso });


    //Borrar una propiedad
    // delete ingresoEgreso.uid;

    const { description, monto, tipo } = ingresoEgreso; //IngresoEgreso tiene uid?
    //creando coleccion
    return this.fireStore
      .doc(`${this.authService.user.uid}/ingresos-egresos`)
      .collection('items')
      .add({ description, monto, tipo });
    // .then((ref)=>console.log('exito', ref))
    // .catch( err => console.warn(err, '--ERROR--'));
  }

  initIngresosEgresosListener(uid: string): Observable<any> {
    return (
      this.fireStore
        .collection(`${uid}/ingresos-egresos/items`)
        .snapshotChanges()
        //logica obtener los elementos pero con uid
        .pipe(
          map((snapshot) => {
            // console.log(snapshot);

            //map: barre cada uno de los elementos del arreglo
            return snapshot.map((doc) => {
              // console.log(doc.payload.doc.data());
              // const data:any = doc.payload.doc.data();

              //transormar cada uno de los elementos del arrego
              return {
                uid: doc.payload.doc.id,
                ...(doc.payload.doc.data() as any),
              };
            });
          })
        )
    );
    // .subscribe((algo) => {
    //   console.log(algo);
    // });
  }

  public borrarIngresoEgreso(uidItem: string): Promise<void> {
    const uid = this.authService.user.uid;
    console.log(`${uid}/ingresos-egresos/items/${uidItem}`);
    
    return this.fireStore
      .doc(`/${uid}/ingresos-egresos/items/${uidItem}`)
      .delete();
  }
}
