import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from 'src/app/models/usuario.model';
import { Perfil } from 'src/app/models/perfil.model';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UsuarioComponent } from '../usuarios/usuario-form/usuario-form.component';
import { PerfilComponent } from '../perfiles/perfil-form/perfil-form.component';
import { Grupo } from 'src/app/models/grupo.model';
import { GrupoComponent } from '../grupos/grupo-form/grupo-form.component';
import { GrupoService } from '../../services/grupo/grupo.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { PerfilService } from 'src/app/services/service.index';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  cargando = true;
  usuarios: Usuario [] = [];
  perfiles: Perfil [] = [];
  grupos: Grupo [] = [];

  constructor(
    private modalService: NgbModal,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public grupoService: GrupoService,
    public perfilService: PerfilService,

    private dialog: MatDialog,
  ) {
    activatedRoute.params
    .subscribe( params => {
      const termino = params.termino;
      this.buscar(termino);
    });
  }

  ngOnInit(): void {
  }

  buscar( termino: string) {
    this.cargando = true;
    const url = URL_SERVICIOS + '/busqueda/todo/' + termino;
    this.http.get(url)
    .subscribe( (resp: any) => {
      this.usuarios = resp.usuarios;
      this.perfiles = resp.perfiles;
      this.grupos = resp.grupos;
      this.cargando = false;
    });
  }

  handleModalFormClose() {
    // alert('Se ha cerrado el modal');
  }

  editarUsuario(usuario: Usuario){
    const modal = this.modalService.open(UsuarioComponent);
    modal.componentInstance.modoCrear = false;
    modal.componentInstance.usuario = usuario;

    modal.result.then((yes) => {
      this.router.navigate(['/usuarios']);
    },
    (cancel) => {

    });
  }

  onEditPerfil(perfil: Perfil){

    const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.height = '350px';
    this.dialog.open(PerfilComponent, dialogConfig);
    this.perfilService.cargandoPerfil.emit(perfil);
    this.router.navigate(['/perfiles']);
  }

  onEditGrupo(grupo: Grupo){

    const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.height = '350px';
    this.dialog.open(GrupoComponent, dialogConfig);
    this.grupoService.cargandoGrupo.emit(grupo);
    this.router.navigate(['/grupos']);
  }

}
