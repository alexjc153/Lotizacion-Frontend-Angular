import { Injectable, EventEmitter } from '@angular/core';
import { Grupo } from '../../models/grupo.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  grupo: Grupo;
  token: string;
  public guardado: EventEmitter<Grupo> = new EventEmitter<Grupo>();
  public cargandoGrupo: EventEmitter<Grupo> = new EventEmitter<Grupo>();

  constructor(
    public http: HttpClient,
    private toastr: ToastrService
  ) {
    this.token = localStorage.getItem('token');
   }

  cargarGrupo(id: string) {
    const url = URL_SERVICIOS + '/grupo/' + id;
    return this.http.get(url)
    .pipe(map( (resp: any) => resp.grupo));
  }

  buscarGrupos(termino: string) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/grupos/' + termino;
    return this.http.get( url )
      .pipe(map((resp: any) => resp.grupos ));

  }

  cargarGrupos(){
    const url = URL_SERVICIOS + '/grupo';
    return this.http.get(url);
  }

  crearGrupo(grupo: Grupo){
    let url = URL_SERVICIOS + '/grupo';

    if (grupo._id) {
      // Actualizar grupo
      url += '/' + grupo._id;
      url += '?token=' + this.token;

      return this.http.put( url, grupo)
        .pipe(map( (resp: any) => {
          this.toastr.success('Grupo Actualizado Correctamente', 'Operación exitosa!');
          return true;
        })
        , catchError(err => {
          this.toastr.error(err.error.mensaje, 'Error al actualizar el registro');
          return throwError(err);
        }));
      } else {
        // Crear grupo
        url += '?token=' + this.token;
        return this.http.post(url, grupo)
        .pipe(map ( (resp: any) => {
          this.toastr.success('Grupo Registrado Correctamente', 'Operación exitosa!');
          return true;
        }), catchError(err => {
          this.toastr.error(err.error.mensaje, 'Error al crear el registro');
          return throwError(err);
        }));
    }
  }


  borrarGrupo( id: string) {
    let url = URL_SERVICIOS + '/grupo/' + id ;
    url += '?token=' + this.token;

    return this.http.delete(url)
    .pipe(map( resp => {
      this.toastr.info('El grupo ha sido eliminado correctamente', 'Eliminado!');
      return true;
    }));
    }


}
