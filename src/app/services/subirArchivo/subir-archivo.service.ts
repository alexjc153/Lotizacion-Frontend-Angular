import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }


  subirArchivo(archivo: File, tipo: string, id: string) {

    return new Promise( (resolve, reject) => {

          const formData = new FormData();
          const xhr = new XMLHttpRequest();

          formData.append('imagen', archivo, archivo.name);
          // tslint:disable-next-line: only-arrow-functions
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                // Swal.fire('Correcto', 'Imagen actualizada correctamente', 'success');
                resolve( JSON.parse(xhr.response));
             } else {
              //  Swal.fire('Error al subir archivo', 'No se pudo completar la operación', 'error');
               reject(JSON.parse(xhr.response));
              }

            }
          };

          const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
          xhr.open('PUT', url, true);
          xhr.send(formData);
    });

  }

}
