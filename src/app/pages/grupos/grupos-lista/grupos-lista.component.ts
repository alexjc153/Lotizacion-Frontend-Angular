import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Grupo } from 'src/app/models/grupo.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GrupoService } from '../../../services/grupo/grupo.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GrupoComponent } from '../grupo-form/grupo-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

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
    public grupoService: GrupoService,
    public router: Router,
    private dialog: MatDialog,
    ) {
      this.cargaTabla();
    }

    listData: MatTableDataSource<any>;
    displayedColumns: string [] = ['nombre', 'descripcion', 'acciones'];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    termino: string;

    ngOnInit(): void {
      this.cargaTabla();
      this.grupoService.guardado.subscribe( res => {
        this.cargaTabla();
        this.termino = '';
      });
    }

    cargaTabla(){
      this.grupoService.cargarGrupos()
        .subscribe((list: any) => {
          const array = list.grupos;
          this.listData = new MatTableDataSource(array);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
          this.listData.paginator._intl.itemsPerPageLabel = 'Registros por página';
          this.listData.filterPredicate = (data, filter) => {
            const dataStr = data.nombre + data.descripcion;
            return dataStr.toLowerCase().indexOf(filter) !== -1;
          };
        });
    }
// Acá es Material
    onCreate(){
      const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '400px';
      dialogConfig.height = '350px';
      this.dialog.open(GrupoComponent, dialogConfig);
    }

    onEdit(grupo: Grupo){
      const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '400px';
      dialogConfig.height = '350px';
      this.dialog.open(GrupoComponent, dialogConfig);
      this.grupoService.cargandoGrupo.emit(grupo);
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
            this.cargaTabla();
        }
        );
      }
      });
    }

    applyFilter() {
      this.listData.filter = this.termino.trim().toLowerCase();
    }

    limpiarBuscador() {
      this.termino = '';
      this.applyFilter();
    }

}
