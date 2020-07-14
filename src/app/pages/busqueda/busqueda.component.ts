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

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario [] = [];
  perfiles: Perfil [] = [];
  grupos: Grupo [] = [];

  constructor(
    private modalService: NgbModal,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public grupoService: GrupoService
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
    const url = URL_SERVICIOS + '/busqueda/todo/' + termino;
    this.http.get(url)
    .subscribe( (resp: any) => {
      this.usuarios = resp.usuarios;
      this.perfiles = resp.perfiles;
      this.grupos = resp.grupos;
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

  editarPerfil(perfil: Perfil){
    const modal = this.modalService.open(PerfilComponent);
    modal.componentInstance.modoCrear = false;
    modal.componentInstance.perfil = perfil;

    modal.result.then((yes) => {
      this.router.navigate(['/perfiles']);
    },
    (cancel) => {

    });
  }

  editarGrupo(grupo: Grupo){
    const modal = this.modalService.open(GrupoComponent);
    modal.componentInstance.modoCrear = false;
    modal.componentInstance.grupo = grupo;

    modal.result.then((yes) => {
      this.router.navigate(['/grupos']);
    },
    (cancel) => {

    });
  }

}
