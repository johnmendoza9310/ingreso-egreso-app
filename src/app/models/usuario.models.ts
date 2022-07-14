export class Usuario {
  //convertir usuario guardado en firebase a mi clase
  //crear instancia de usuario
//   static fromFirebase({ email, nombre, uid }: {email: string, nombre: string, uid: string})
  static fromFirebase({ email, nombre, uid }: any){
    return new Usuario(uid, nombre, email);
  }

  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) {}
}
