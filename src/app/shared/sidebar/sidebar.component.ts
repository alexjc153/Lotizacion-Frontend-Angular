import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from '../../services/service.index';
import { Usuario } from 'src/app/models/usuario.model';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  constructor(
    // tslint:disable-next-line: variable-name
    public _sidebar: SidebarService,
    // tslint:disable-next-line: variable-name
    public usuarioService: UsuarioService
    ) { }

    usuario: Usuario;

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
  }

}
