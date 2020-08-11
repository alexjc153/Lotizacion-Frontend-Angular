import { Component, OnInit, ViewChild } from '@angular/core';
import { Categoria } from '../../../models/categoria.model';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CategoriaService } from '../../../services/categoria/categoria.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CategoriaComponent } from '../categoria-form/categoria-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias-lista',
  templateUrl: './categorias-lista.component.html',
  styleUrls: ['./categorias-lista.component.css']
})
export class CategoriasComponent implements OnInit {

  cargando = true;
  categoria: Categoria;
  categorias: Categoria [] = [];
  totalRegistros = 0;

  constructor(
    public categoriaService: CategoriaService,
    public router: Router,
    private dialog: MatDialog,
  ) {
    this.cargaTabla();
  }

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['nombre', 'descripcion', 'grupo', 'acciones'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  termino: string;

  ngOnInit(): void {
    this.cargaTabla();
    this.categoriaService.guardado.subscribe( res => {
      this.cargaTabla();
      this.termino = '';
    });
  }

  cargaTabla(){
    this.categoriaService.cargarCategorias()
      .subscribe((list: any) => {
        const array = list.categorias;
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
    this.dialog.open(CategoriaComponent, dialogConfig);
  }

  onEdit(categoria: Categoria){
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.height = '350px';
    this.dialog.open(CategoriaComponent, dialogConfig);
    this.categoriaService.cargandoCategoria.emit(categoria);
  }

  borrarCategoria(categoria: Categoria) {
    Swal.fire({
      title: 'Eliminar categoría',
      text: 'Está seguro de borrar la categoria: ' + categoria.nombre + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF5451',
      cancelButtonColor: 'secondary',
      confirmButtonText: 'Sí, borrar categoría!',
      cancelButtonText: 'Cancelar'
    }).then((borrar) => {
      if (borrar.value) {
        this.categoriaService.borrarCategoria(categoria._id)
        .subscribe(() => {
          const index = this.categorias.findIndex( encontrado => encontrado._id === categoria._id);
          this.categorias.splice(index, 1);
          this.totalRegistros = this.categorias.length;
          this.categorias = [...this.categorias];
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
