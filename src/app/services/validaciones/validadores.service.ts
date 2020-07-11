import { Injectable, Pipe } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioService } from '../service.index';
import { FormControl, FormGroup, Form, AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';

interface ErrorValidate {
  [s: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {
  [x: string]: any;

  constructor(
    // tslint:disable-next-line: variable-name
    private _usuarioService: UsuarioService
  ) {}

  passwordsIguales(pass1: string, pass2: string) {
    return ( formGroup: FormGroup ) => {
      const pass1Control = formGroup.controls[pass1];
      const pass2Control = formGroup.controls[pass2];

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    };
  }

  validarUsername(usuarioService: UsuarioService) {
    return (control: FormControl) => {
      const valor = control.value;
      return usuarioService.checkUsername(valor)
      .pipe(
        map(response => {
          return response.isUsernameAvailable ? null : {notAvailable: true};
        })
      );
    };
  }
}
