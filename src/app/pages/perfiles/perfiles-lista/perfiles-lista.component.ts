import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Perfil } from 'src/app/models/perfil.model';
import { PerfilComponent } from '../perfil-form/perfil-form.component';
import { PerfilService } from '../../../services/perfil/perfil.service';

import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles-lista.component.html',
  styleUrls: ['./perfiles-lista.component.css']
})
export class PerfilesComponent implements OnInit {

  cargando = true;
  perfil: Perfil;
  perfiles: Perfil [] = [];
  totalRegistros = 0;

constructor(
    public perfilService: PerfilService,
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
      this.perfilService.guardado.subscribe( res => {
        this.cargaTabla();
        this.termino = '';

      });
    }

    cargaTabla(){
      this.perfilService.cargarPerfiles()
        .subscribe((list: any) => {
          const array = list.perfiles;
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
      this.dialog.open(PerfilComponent, dialogConfig);
    }

    onEdit(perfil: Perfil){
      const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '400px';
      dialogConfig.height = '350px';
      this.dialog.open(PerfilComponent, dialogConfig);
      this.perfilService.cargandoPerfil.emit(perfil);
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
            this.totalRegistros = this.perfiles.length;
            this.perfiles = [...this.perfiles];
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
