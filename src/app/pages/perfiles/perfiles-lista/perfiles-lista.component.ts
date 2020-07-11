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
    // tslint:disable-next-line: variable-name
    public perfilService: PerfilService,
    public router: Router,
    ) {
      this.cargarPerfiles();
      this.perfil = perfilService.perfil;

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
    this.cargarPerfiles();
  }

  nuevoPerfil() {
    const modal = this.modalService.open(PerfilComponent);
    modal.result.then(
      this.handleModalPerfilFormClose.bind(this),
      this.handleModalPerfilFormClose.bind(this),
    );
    modal.componentInstance.modoCrear = true;
  }

  handleModalPerfilFormClose() {
    // alert('Se ha cerrado el modal');
  }

  editarPerfil(perfil: Perfil){
    const modal = this.modalService.open(PerfilComponent);
    modal.result.then(
      this.handleModalPerfilFormClose.bind(this),
      this.handleModalPerfilFormClose.bind(this),
    );
    modal.componentInstance.modoCrear = false;
    modal.componentInstance.perfil = perfil;
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
        this.perfilService.borrarPerfil(perfil._id).subscribe(() => this.cargarPerfiles());
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

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
