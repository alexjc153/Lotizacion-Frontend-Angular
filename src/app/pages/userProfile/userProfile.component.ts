import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';

import { UsuarioService, PerfilService } from '../../services/service.index';
import { Perfil } from '../../models/perfil.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './userProfile.component.html'
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  perfiles: Perfil [] = [];
  imagenSubir: File;
  imagenTemp: any;
  admin: any;

  constructor(
    // tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService,
    // tslint:disable-next-line: variable-name
    public _perfilService: PerfilService,
    // tslint:disable-next-line: variable-name
    public _modalUploadService: ModalUploadService,
    public route: Router,
  ) {
    this.usuario = _usuarioService.usuario;
   }

  ngOnInit(): void {
    this._perfilService.cargarComboPerfil()
    .subscribe ( perfiles => this.perfiles = perfiles);

    this._modalUploadService.notificacion
    .subscribe(resp => {
      const token = localStorage.getItem('token');
      this.usuario.img = resp.usuario.img;
      this._usuarioService.guardarStorage(resp.usuario._id, token, resp.usuario );
      this._usuarioService.cargarStorage();
    });
  }

  mostrarModal( id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }

  actualizar(usuario: Usuario) {
    this.usuario.nombre = usuario.nombre;
    this.usuario.username = usuario.username;
    this.usuario.password = usuario.password;
    this.usuario.perfil = usuario.perfil;

    this._usuarioService.crearUsuario ( this.usuario )
    .subscribe();
  }


  seleccionImagen( archivo: File) {

    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire('Sólo Imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result;

  }

  cambiarImagen() {
    this._usuarioService.cambiarImagen( this.imagenSubir, this.usuario._id);
  }

}
