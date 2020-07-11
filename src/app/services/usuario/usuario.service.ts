import { Injectable } from '@angular/core';

import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient} from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    // tslint:disable-next-line: variable-name
    public _subirArchivoService: SubirArchivoService,
    private toastr: ToastrService
  ) {
    this.cargarStorage();
   }

   estaLogueado() {
     return (this.token.length > 5) ? true : false;
   }

   cargarStorage() {
     if (localStorage.getItem('token')) {
       this.token = localStorage.getItem('token');
       this.usuario = JSON.parse(localStorage.getItem('usuario'));
     } else {
       this.token = '';
       this.usuario = null;
     }
   }

   guardarStorage(id: string, token: string, usuario: Usuario) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;

   }

   logout() {
     this.usuario = null;
     this.token = '';

     localStorage.removeItem('id');
     localStorage.removeItem('token');
     localStorage.removeItem('usuario');

     this.router.navigate(['/login']);
   }

  login( usuario: Usuario ) {

    const url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario)
    .pipe(map( (resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        return true;
    })
    , catchError(err => {
      Swal.fire({
          title: '<strong>No se pudo inicar sesión</strong>',
          text: err.error.mensaje,
          icon: 'error',
          confirmButtonText: 'Reintentar'
      });
      // this.toastr.error(err.error.mensaje, 'No se puedo iniciar sesión');
      return throwError(err);
    }));
  }

  cargarUsuario(id: string) {
    const url = URL_SERVICIOS + '/usuario/' + id;
    return this.http.get(url)
    .pipe(map( (resp: any) => resp.usuario));
  }


  checkUsername(username: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + username;
    return this.http.get(url)
    .pipe(map((resp: any) => {
      if (resp.usuarios.length > 0) {
        if (resp.usuarios[0].username !== username) {
          // this.toastr.info('Usuario Disponible', 'Correcto');
          return { isUsernameAvailable: true };
        } else {
          // this.toastr.warning('Usuario no disponible', 'Error');
          return { notAvailable: true };
        }
      } else {
        // this.toastr.info('Usuario Disponible', 'Correcto');
        return { isUsernameAvailable: true };
      }
    }));
  }

  crearUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario';

    if (usuario._id) {
      // Actualizar Usuario
      url += '/' + usuario._id;
      url += '?token=' + this.token;

      return this.http.put( url, usuario)
        .pipe(map( (resp: any) => {
          this.toastr.success('Usuario Actualizado Correctamente', 'Operación Exitosa!');
          // Swal.fire('Usuario Actualizado Correctamente', usuario.username, 'success');
          return true;
      })
      , catchError(err => {
        this.toastr.error(err.error.errors.errors.username.message, err.error.mensaje);
        // Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
        return throwError(err);
      }));

    } else {
      // Crear Usuario
      url += '?token=' + this.token;
      return this.http.post(url, usuario)
      .pipe(map ( (resp: any) => {
        this.toastr.success('Usuario Registrado Correctamente', 'Operación Exitosa!');
        // Swal.fire('Usuario Creado', usuario.username, 'success');
        return true;
      }), catchError(err => {
        console.log(err);
        this.toastr.error(err.error.errors.errors.username.message, err.error.mensaje);
        // Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
        return throwError(err);
      }));
    }
  }

  cambiarImagen(archivo: File, id: string) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
    .then( (resp: any) => {
      this.usuario.img = resp.usuario.img;

      // this.Toast.fire('Imagen Actualizada', '', 'success');
      this.toastr.success('Imagen Actualizada', 'Operación Exitosa!');

      this.guardarStorage(id, this.token, this.usuario);

    })
    .catch( resp => {
      this.toastr.error(resp.errors.mensaje, resp.error.errors.message);
      // Swal.fire(resp.errors.mensaje, resp.error.errors.message, 'error');
    });

  }

  cargarUsuarios() {
    const url = URL_SERVICIOS + '/usuario';
    return this.http.get(url);
  }


  buscarUsuarios(termino: string) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get( url )
      .pipe(map((resp: any) => resp.usuarios ));
  }

  borrarUsuario( id: string) {

  let url = URL_SERVICIOS + '/usuario/' + id ;
  url += '?token=' + this.token;

  return this.http.delete(url)
  .pipe(map( resp => {
    this.toastr.info('El usuario ha sido eliminado correctamente', 'Eliminado!');
    return true;
  }));

  }
}
