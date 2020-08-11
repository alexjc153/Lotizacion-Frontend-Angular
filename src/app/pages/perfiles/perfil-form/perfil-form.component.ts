import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { Perfil } from '../../../models/perfil.model';
import { PerfilService } from '../../../services/perfil/perfil.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.css']
})
export class PerfilComponent implements OnInit {

  perfilForm: FormGroup;
  modoCrear = true;
  @Input() perfil: Perfil;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public perfilService: PerfilService,
    public dialogRef: MatDialogRef<PerfilComponent>,
    ) {
      this.crearFormulario();
      this.perfilService.cargandoPerfil.subscribe(res => {
        this.cargarDataAlFormulario(res);
      });
    }

  ngOnInit(): void {
    if (!this.modoCrear){
    }
    this.perfilService.cargarPerfiles();
  }

  get nombreNoValido(){
    return this.perfilForm.get('nombre').invalid && this.perfilForm.get('nombre').touched && !this.perfilForm.get('nombre').pristine;
  }

  crearFormulario(){
    this.perfilForm = this.fb.group({
        id: [null],
        nombre: [null, Validators.required],
        descripcion: [null],
    });
  }

  cargarDataAlFormulario(perfil: Perfil){

    this.perfilService.cargarPerfil(perfil._id)
    .subscribe (res => {
      this.perfilForm = this.fb.group({
        id: [res._id],
        nombre: [res.nombre, Validators.required],
        descripcion: [res.descripcion],
      });
      this.modoCrear = false;
    });
  }

  registrarPerfil() {

    if (this.perfilForm.invalid) {
      return Object.values(this.perfilForm.controls).forEach (control => {
        control.markAllAsTouched();
      });
    }

    const perfil = new Perfil(
      this.perfilForm.value.nombre,
      this.perfilForm.value.descripcion,
      this.perfilForm.value.id,
    );

    this.perfilService.crearPerfil(perfil)
    .subscribe(() =>  {
      this.perfilService.guardado.emit(perfil);
      this.onClose();
    });

  }

  onClose() {
    this.perfilForm.reset();
    this.crearFormulario();
    this.dialogRef.close();
  }

}
