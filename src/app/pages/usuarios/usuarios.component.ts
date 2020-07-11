import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { UsuarioComponent } from './usuario.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
})

export class UsuariosComponent implements OnInit {

  cargando = false;

  usuario: Usuario;
  usuarios: Usuario [] = [];
  forma: FormGroup;
  totalRegistros = 0;

  mySubscription: any;

  constructor(
    private modalService: NgbModal,
    // tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService,
    public router: Router,
  ) {

    this.cargarUsuarios();
    this.usuario = _usuarioService.usuario;

    // Refresh ventana al guardar registro desde Modal
      // tslint:disable-next-line: only-arrow-functions
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      // Trick the Router into believing it's last link wasn't previously loaded
      this.router.navigated = false;
    }
  });

  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  nuevoUsuario() {
    const modal = this.modalService.open(UsuarioComponent);
    modal.result.then(
      this.handleModalUsuarioFormClose.bind(this),
      this.handleModalUsuarioFormClose.bind(this),
    );
    modal.componentInstance.modoCrear = true;
  }

  handleModalUsuarioFormClose() {
    // alert('Se ha cerrado el modal');
  }

  editarUsuario(usuario: Usuario){
    const modal = this.modalService.open(UsuarioComponent);
    modal.result.then(
      this.handleModalUsuarioFormClose.bind(this),
      this.handleModalUsuarioFormClose.bind(this),
    );
    modal.componentInstance.modoCrear = false;
    modal.componentInstance.usuario = usuario;
  }


  cargarUsuarios() {

    this.cargando = true;

    this._usuarioService.cargarUsuarios()
    .subscribe( (resp: any) => {
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
  });
  }

  borrarUsuario(usuario: Usuario) {

    if (usuario._id === this._usuarioService.usuario._id) {
      Swal.fire('Error', 'No puede borrar su propio usuario.', 'error');
      return;
    }

    Swal.fire({
      title: 'Eliminar Usuario',
      text: 'Está seguro de borrar el usuario: ' + usuario.nombre + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF5451',
      cancelButtonColor: 'secondary',
      confirmButtonText: 'Sí, borrar usuario!',
      cancelButtonText: 'Cancelar'
    }).then((borrar) => {
      if (borrar.value) {
        this._usuarioService.borrarUsuario(usuario._id)
        .subscribe(() => this.cargarUsuarios()
        );
      }
    });

  }

  buscarUsuario(termino: string) {

    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios(termino)
    .subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      this.cargando = false;
    });

  }

}
