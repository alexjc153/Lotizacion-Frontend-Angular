import { Injectable, EventEmitter } from '@angular/core';

import { Categoria } from 'src/app/models/categoria.model';

import { HttpClient} from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {

  categoria: Categoria;
  token: string;
  public guardado: EventEmitter<Categoria> = new EventEmitter<Categoria>();
  public cargandoCategoria: EventEmitter<Categoria> = new EventEmitter<Categoria>();

  constructor(
    public http: HttpClient,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.token = localStorage.getItem('token');
   }

   cargarCategoria(id: string) {
    const url = URL_SERVICIOS + '/categoria/' + id;
    return this.http.get(url)
    .pipe(map( (resp: any) =>
        resp.categoria
    ));
  }

  buscarCategorias(termino: string) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/categorias/' + termino;
    return this.http.get( url )
      .pipe(map((resp: any) => resp.categorias ));

  }

  cargarCategorias(){
    const url = URL_SERVICIOS + '/categoria';
    return this.http.get(url);
  }

  crearCategoria(categoria: Categoria){
    let url = URL_SERVICIOS + '/categoria';

    if (categoria._id) {
      // Actualizar categoria
      url += '/' + categoria._id;
      url += '?token=' + this.token;

      return this.http.put( url, categoria)
        .pipe(map( (resp: any) => {
          this.toastr.success('Categoria Actualizado Correctamente', 'Operación exitosa!');
          return true;
        })
        , catchError(err => {
          this.toastr.error(err.error.mensaje, 'Error al actualizar el registro');
          return throwError(err);
        }));
    } else {
        // Crear categoria
        url += '?token=' + this.token;

        return this.http.post(url, categoria)
        .pipe(map ( (resp: any) => {
          this.toastr.success('Categoria Registrado Correctamente', 'Operación exitosa!');
          return true;
        }), catchError(err => {
          this.toastr.error(err.error.mensaje, 'Error al crear el registro');
          return throwError(err);
        }));
    }
  }


  borrarCategoria( id: string) {
    let url = URL_SERVICIOS + '/categoria/' + id ;
    url += '?token=' + this.token;

    return this.http.delete(url)
    .pipe(map( resp => {
      this.toastr.info('El categoria ha sido eliminado correctamente', 'Eliminado!');
      return true;
    }));
  }
}
