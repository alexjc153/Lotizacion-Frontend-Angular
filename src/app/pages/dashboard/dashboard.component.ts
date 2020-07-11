import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/service.index';
import { PerfilService } from '../../services/perfil/perfil.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  constructor( 
    public _usuarioService: UsuarioService,
    public _perfilService: PerfilService ) { }

  totalUsuarios: number;
  totalPerfiles: number;


  ngOnInit(): void {
    this._usuarioService.cargarUsuarios().subscribe((resp: any) => {
      this.totalUsuarios = resp.total; });
    this._perfilService.cargarPerfiles().subscribe((resp: any) => {
        this.totalPerfiles = resp.total; });
  }

}
