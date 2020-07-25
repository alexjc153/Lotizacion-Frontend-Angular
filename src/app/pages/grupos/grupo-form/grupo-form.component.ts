import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { Grupo } from '../../../models/grupo.model';
import { GrupoService } from '../../../services/grupo/grupo.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo-form.component.html',
  styleUrls: ['./grupo-form.component.css']
})
export class GrupoComponent implements OnInit {

  grupoForm: FormGroup;
  modoCrear = true;
  @Input() grupo: Grupo;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public grupoService: GrupoService,
    public dialogRef: MatDialogRef<GrupoComponent>,
    ) {
      this.crearFormulario();
      this.grupoService.cargandoGrupo.subscribe(res => {
        this.cargarDataAlFormulario(res);
      });
    }

  ngOnInit(): void {
    if (!this.modoCrear){
    }
    this.grupoService.cargarGrupos();
  }

  get nombreNoValido(){
    return this.grupoForm.get('nombre').invalid && this.grupoForm.get('nombre').touched && !this.grupoForm.get('nombre').pristine;
  }

  crearFormulario(){
    this.grupoForm = this.fb.group({
        id: [null],
        nombre: [null, Validators.required],
        descripcion: [null],
    });
  }

  cargarDataAlFormulario(grupo: Grupo){

    this.grupoService.cargarGrupo(grupo._id)
    .subscribe (res => {
      this.grupoForm = this.fb.group({
        id: [res._id],
        nombre: [res.nombre, Validators.required],
        descripcion: [res.descripcion],
      });
      this.modoCrear = false;
    });
  }

  registrarGrupo() {

    if (this.grupoForm.invalid) {
      return Object.values(this.grupoForm.controls).forEach (control => {
        control.markAllAsTouched();
      });
    }

    const grupo = new Grupo(
      this.grupoForm.value.nombre,
      this.grupoForm.value.descripcion,
      this.grupoForm.value.id,
    );

    this.grupoService.crearGrupo(grupo)
    .subscribe(() =>  {
      this.grupoService.guardado.emit(grupo);
      this.onClose();
    });

  }

  onClose() {
    this.grupoForm.reset();
    this.crearFormulario();
    this.dialogRef.close();
  }

}
