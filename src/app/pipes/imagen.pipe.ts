import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {

    let url = URL_SERVICIOS + '/img';

    if (!img) {
      return url + '/usuarios/xxx';
    }

    switch (tipo) {
      case 'usuario':
          url += '/usuarios/' + img;
          break;

      default:
        console.log ('Tipo de imagen no existe, usuarios');
        url += 'usuarios/xxx';
        break;
    }

    return url;
  }

}
