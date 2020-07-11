import { Injectable } from '@angular/core';
import { Perfil } from '../../models/perfil.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  perfil: Perfil;
  token: string;

  constructor(
    public http: HttpClient,
    private toastr: ToastrService
  ) {
    this.token = localStorage.getItem('token');
   }

  cargarComboPerfil() {
    const url = URL_SERVICIOS + '/perfil';
    return this.http.get(url)
    .pipe(map (( resp: any) => {
        return resp.perfiles;
    }));
  }

  cargarPerfil(id: string) {
    const url = URL_SERVICIOS + '/perfil/' + id;
    return this.http.get(url)
    .pipe(map( (resp: any) => resp.perfil));
  }

  buscarPerfiles(termino: string) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/perfiles/' + termino;
    return this.http.get( url )
      .pipe(map((resp: any) => resp.perfiles ));

  }

  cargarPerfiles(){
    const url = URL_SERVICIOS + '/perfil';
    return this.http.get(url);
  }

  crearPerfil(perfil: Perfil){
    let url = URL_SERVICIOS + '/perfil';

    if (perfil._id) {
      // Actualizar perfil
      url += '/' + perfil._id;
      url += '?token=' + this.token;

      return this.http.put( url, perfil)
        .pipe(map( (resp: any) => {
          // Swal.fire('Perfil Actualizado Correctamente', perfil.nombre, 'success');
          this.toastr.success('Perfil Actualizado Correctamente', 'Operación exitosa!');
          return true;
        })
        , catchError(err => {
          this.toastr.error(err.error.mensaje, 'Error al actualizar el registro');
          // Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
      } else {
        // Crear perfil
        url += '?token=' + this.token;
        return this.http.post(url, perfil)
        .pipe(map ( (resp: any) => {
          this.toastr.success('Perfil Registrado Correctamente', 'Operación exitosa!');
          // Swal.fire('Perfil Creado', perfil.nombre, 'success');
          return true;
        }), catchError(err => {
          this.toastr.error(err.error.mensaje, 'Error al crear el registro');
          // Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
    }
  }


  borrarPerfil( id: string) {
    let url = URL_SERVICIOS + '/perfil/' + id ;
    url += '?token=' + this.token;

    return this.http.delete(url)
    .pipe(map( resp => {
      // Swal.fire(
      //   'Eliminado!',
      //   'El perfil ha sido eliminado correctamente.',
      //   'success'
      // );
      this.toastr.info('El perfil ha sido eliminado correctamente', 'Eliminado!');
      return true;
    }));
    }

}
