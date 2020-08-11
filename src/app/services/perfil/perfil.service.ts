import { Injectable, EventEmitter } from '@angular/core';
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
  public guardado: EventEmitter<Perfil> = new EventEmitter<Perfil>();
  public cargandoPerfil: EventEmitter<Perfil> = new EventEmitter<Perfil>();

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
          this.toastr.success('Perfil Actualizado Correctamente', 'Operación exitosa!');
          return true;
        })
        , catchError(err => {
          this.toastr.error(err.error.mensaje, 'Error al actualizar el registro');
          return throwError(err);
        }));
      } else {
        // Crear perfil
        url += '?token=' + this.token;
        return this.http.post(url, perfil)
        .pipe(map ( (resp: any) => {
          this.toastr.success('Perfil Registrado Correctamente', 'Operación exitosa!');
          return true;
        }), catchError(err => {
          this.toastr.error(err.error.mensaje, 'Error al crear el registro');
          return throwError(err);
        }));
    }
  }


  borrarPerfil( id: string) {
    let url = URL_SERVICIOS + '/perfil/' + id ;
    url += '?token=' + this.token;

    return this.http.delete(url)
    .pipe(map( resp => {
      this.toastr.info('El perfil ha sido eliminado correctamente', 'Eliminado!');
      return true;
    })
    , catchError(err => {
      this.toastr.error(err.error.mensaje);
      return throwError(err);
    }));
    }

}
