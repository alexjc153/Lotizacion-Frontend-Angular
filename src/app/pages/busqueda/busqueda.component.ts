import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from 'src/app/models/usuario.model';
import { Perfil } from 'src/app/models/perfil.model';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UsuarioComponent } from '../usuarios/usuario-form/usuario-form.component';
import { PerfilComponent } from '../perfiles/perfil-form/perfil-form.component';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario [] = [];
  perfiles: Perfil [] = [];

  constructor(
    private modalService: NgbModal,
    public activatedRoute: ActivatedRoute,
    public http: HttpClient
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
    });
  }

  handleModalFormClose() {
    // alert('Se ha cerrado el modal');
  }

  editarUsuario(usuario: Usuario){
    const modal = this.modalService.open(UsuarioComponent);
    modal.result.then(
      this.handleModalFormClose.bind(this),
      this.handleModalFormClose.bind(this),
    );
    modal.componentInstance.modoCrear = false;
    modal.componentInstance.usuario = usuario;
  }

  editarPerfil(perfil: Perfil){
    const modal = this.modalService.open(PerfilComponent);
    modal.result.then(
      this.handleModalFormClose.bind(this),
      this.handleModalFormClose.bind(this),
    );
    modal.componentInstance.modoCrear = false;
    modal.componentInstance.perfil = perfil;
  }

}
