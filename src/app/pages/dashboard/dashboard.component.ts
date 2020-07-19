import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/service.index';
import { PerfilService } from '../../services/perfil/perfil.service';
import { GrupoService } from '../../services/grupo/grupo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  constructor( 
    public usuarioService: UsuarioService,
    public perfilService: PerfilService,
    public grupoService: GrupoService ) { }

  totalUsuarios: number;
  totalPerfiles: number;
  totalGrupos: number;


  ngOnInit(): void {
    this.usuarioService.cargarUsuarios().subscribe((resp: any) => {
      this.totalUsuarios = resp.total; });
    this.perfilService.cargarPerfiles().subscribe((resp: any) => {
        this.totalPerfiles = resp.total; });
    this.grupoService.cargarGrupos().subscribe((resp: any) => {
      this.totalGrupos = resp.total;
    })
  }

}
