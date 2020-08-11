import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/categoria.model';
import { Router } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria/categoria.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Grupo } from '../../../models/grupo.model';
import { GrupoService } from '../../../services/grupo/grupo.service';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaComponent implements OnInit {

  categoriaForm: FormGroup;
  modoCrear = true;
  @Input() categoria: Categoria;
  grupos: Grupo [] = [];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public categoriaService: CategoriaService,
    public dialogRef: MatDialogRef<CategoriaComponent>,
    public grupoService: GrupoService
  ) {
    this.crearFormulario();
    this.categoriaService.cargandoCategoria.subscribe(res => {
      this.cargarDataAlFormulario(res);
    });
  }

  ngOnInit(): void {
    if (!this.modoCrear){
    }
    this.categoriaService.cargarCategorias();

    this.grupoService.cargarComboGrupo()
        .subscribe ( grupos => this.grupos = grupos);
  }

  get nombreNoValido(){
    // tslint:disable-next-line: max-line-length
    return this.categoriaForm.get('nombre').invalid && this.categoriaForm.get('nombre').touched && !this.categoriaForm.get('nombre').pristine;
  }

  get grupoNoValido(){
    return this.categoriaForm.get('grupo').invalid && this.categoriaForm.get('grupo').touched && !this.categoriaForm.get('grupo').pristine;
  }

  crearFormulario(){
    this.categoriaForm = this.fb.group({
        id: [null],
        nombre: [null, Validators.required],
        descripcion: [null],
        grupo: ['', Validators.required],
    });
  }

  cargarDataAlFormulario(categoria: Categoria){

    this.categoriaService.cargarCategoria(categoria._id)
    .subscribe (res => {
      this.categoriaForm = this.fb.group({
        id: [res._id],
        nombre: [res.nombre, Validators.required],
        descripcion: [res.descripcion],
        grupo: [res.grupo, Validators.required],
      });
      this.modoCrear = false;
    });
  }

  registrarCategoria() {

    if (this.categoriaForm.invalid) {
      return Object.values(this.categoriaForm.controls).forEach (control => {
        control.markAllAsTouched();
      });
    }

    const categoria = new Categoria(
      this.categoriaForm.value.nombre,
      this.categoriaForm.value.descripcion,
      this.categoriaForm.value.grupo,
      this.categoriaForm.value.id,
    );

    this.categoriaService.crearCategoria(categoria)
    .subscribe((resp) =>  {
      this.categoriaService.guardado.emit(categoria);
      this.onClose();
    });

  }

  onClose() {
    this.categoriaForm.reset();
    this.crearFormulario();
    this.dialogRef.close();
  }

}
