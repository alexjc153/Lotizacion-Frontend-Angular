import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfilComponent } from './perfil.component';
import { PerfilService } from '../../services/perfil/perfil.service';
import { Perfil } from 'src/app/models/perfil.model';
import Swal from 'sweetalert2';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
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
    public _perfilService: PerfilService,
    public router: Router,
    ) {
      this.cargarPerfiles();
      this.perfil = _perfilService.perfil;

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
    this._perfilService.cargarPerfiles()
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
        this._perfilService.borrarPerfil(perfil._id).subscribe(() => this.cargarPerfiles());
      }
    });
  }

  buscarPerfil(termino: string) {

    if (termino.length <= 0) {
      this.cargarPerfiles();
      return;
    }

    this.cargando = true;

    this._perfilService.buscarPerfiles(termino)
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
