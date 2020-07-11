import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';


import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Perfil } from '../../../models/perfil.model';
import { ModalUploadService } from '../../../components/modal-upload/modal-upload.service';
import { UsuarioService, PerfilService } from '../../../services/service.index';


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
    public usuarioService: UsuarioService,
    public perfilService: PerfilService,
    public modalUploadService: ModalUploadService,
    public route: Router,
  ) {
    this.usuario = usuarioService.usuario;
   }

  ngOnInit(): void {
    this.perfilService.cargarComboPerfil()
    .subscribe ( perfiles => this.perfiles = perfiles);

    this.modalUploadService.notificacion
    .subscribe(resp => {
      const token = localStorage.getItem('token');
      this.usuario.img = resp.usuario.img;
      this.usuarioService.guardarStorage(resp.usuario._id, token, resp.usuario );
      this.usuarioService.cargarStorage();
    });
  }

  mostrarModal( id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

  actualizar(usuario: Usuario) {
    this.usuario.nombre = usuario.nombre;
    this.usuario.username = usuario.username;
    this.usuario.password = usuario.password;
    this.usuario.perfil = usuario.perfil;

    this.usuarioService.crearUsuario ( this.usuario )
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
    this.usuarioService.cambiarImagen( this.imagenSubir, this.usuario._id);
  }

}
