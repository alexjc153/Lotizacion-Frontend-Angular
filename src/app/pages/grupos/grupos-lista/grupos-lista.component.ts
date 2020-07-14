import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/models/grupo.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GrupoService } from '../../../services/grupo/grupo.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GrupoComponent } from '../grupo-form/grupo-form.component';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos-lista.component.html',
  styleUrls: ['./grupos-lista.component.css']
})
export class GruposComponent implements OnInit {

  cargando = false;
  grupo: Grupo;
  grupos: Grupo [] = [];
  totalRegistros = 0;

constructor(
    private modalService: NgbModal,
    public grupoService: GrupoService,
    public router: Router,
    ) {
      this.cargarGrupos();
    }

    ngOnInit(): void {
      this.cargarGrupos();
    }

  nuevoGrupo() {

    const modal = this.modalService.open(GrupoComponent);
    modal.componentInstance.modoCrear = true;

    modal.result.then((yes) => {
      this.cargarGrupos();
    },
    (cancel) => {

    });
  }


  editarGrupo(grupo: Grupo){
    const modal = this.modalService.open(GrupoComponent);

    modal.componentInstance.modoCrear = false;
    modal.componentInstance.grupo = grupo;

    modal.result.then((yes) => {
      this.cargarGrupos();
    },
    (cancel) => {

    });

  }

  cargarGrupos() {
    this.cargando = true;
    this.grupoService.cargarGrupos()
    .subscribe( (resp: any) => {
      this.totalRegistros = resp.total;
      this.grupos = resp.grupos;
      this.cargando = false;

    });
  }

  borrarGrupo(grupo: Grupo) {
    Swal.fire({
      title: 'Eliminar grupo',
      text: 'Está seguro de borrar el grupo: ' + grupo.nombre + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF5451',
      cancelButtonColor: 'secondary',
      confirmButtonText: 'Sí, borrar grupo!',
      cancelButtonText: 'Cancelar'
    }).then((borrar) => {
      if (borrar.value) {
        this.grupoService.borrarGrupo(grupo._id)
        .subscribe(() => {
          const index = this.grupos.findIndex( encontrado => encontrado._id === grupo._id);
          this.grupos.splice(index, 1);
          this.totalRegistros = this.grupos.length;
          this.grupos = [...this.grupos];
      }
      );
    }
    });
  }

  buscarGrupo(termino: string) {

    if (termino.length <= 0) {
      this.cargarGrupos();
      return;
    }

    this.cargando = true;

    this.grupoService.buscarGrupos(termino)
    .subscribe((grupos: Grupo[]) => {

      this.grupos = grupos;
      this.cargando = false;
    });

  }

}
