import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  constructor( 
    // tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService,
    public router: Router,
    ) { }

  usuario: Usuario;

  ngOnInit(): void {
    this.usuario = this._usuarioService.usuario;
  }

  buscar(termino: string){
    this.router.navigate(['/busqueda', termino]);
  }

}
