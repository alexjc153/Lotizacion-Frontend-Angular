import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import Swal from 'sweetalert2';
import { Router, NavigationEnd } from '@angular/router';
import { Perfil } from '../../../models/perfil.model';
import { PerfilService } from '../../../services/perfil/perfil.service';
import { PerfilComponent } from '../perfil-form/perfil-form.component';



@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles-lista.component.html',
  styleUrls: ['./perfiles-lista.component.css']
})

export class PerfilesComponent implements OnInit {

  cargando = false;
  perfil: Perfil;
  perfiles: Perfil [] = [];
  totalRegistros = 0;

  mySubscription: any;

  constructor(
    private modalService: NgbModal,
    public perfilService: PerfilService,
    public router: Router,
    ) {
      this.cargarPerfiles();
      this.perfil = perfilService.perfil;
    }

  ngOnInit(): void {
    this.cargarPerfiles();
  }

  nuevoPerfil() {

    const modal = this.modalService.open(PerfilComponent);
    modal.componentInstance.modoCrear = true;

    modal.result.then((yes) => {
      this.cargarPerfiles();
    },
    (cancel) => {

    });
  }


  editarPerfil(perfil: Perfil){
    const modal = this.modalService.open(PerfilComponent);

    modal.componentInstance.modoCrear = false;
    modal.componentInstance.perfil = perfil;

    modal.result.then((yes) => {
      this.cargarPerfiles();
    },
    (cancel) => {

    });

  }

  cargarPerfiles() {
    this.cargando = true;
    this.perfilService.cargarPerfiles()
    .subscribe( (resp: any) => {
      this.totalRegistros = resp.total;
      this.perfiles = resp.perfiles;
      this.cargando = false;
    });
  }

  borrarPerfil(perfil: Perfil) {
    Swal.fire({
      title: 'Eliminar perfil',
      text: 'Está seguro de borrar el perfil: ' + perfil.nombre + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF5451',
      cancelButtonColor: 'secondary',
      confirmButtonText: 'Sí, borrar perfil!',
      cancelButtonText: 'Cancelar'
    }).then((borrar) => {
      if (borrar.value) {
        this.perfilService.borrarPerfil(perfil._id)
        .subscribe(() => {
          const index = this.perfiles.findIndex( encontrado => encontrado._id === perfil._id);
          this.perfiles.splice(index, 1);
          this.perfiles = [...this.perfiles];
      }
      );
    }
    });
  }

  buscarPerfil(termino: string) {

    if (termino.length <= 0) {
      this.cargarPerfiles();
      return;
    }

    this.cargando = true;

    this.perfilService.buscarPerfiles(termino)
    .subscribe((perfiles: Perfil[]) => {

      this.perfiles = perfiles;
      this.cargando = false;
    });

  }

}
