import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';
import { Perfil } from '../../../models/perfil.model';
import { PerfilService } from '../../../services/perfil/perfil.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.css']
})

export class PerfilComponent implements OnInit {

  perfilForm: FormGroup;
  modoCrear = true;
  perfil: Perfil;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public router: Router,
    public perfilService: PerfilService,
    ) {
      this.crearFormulario();
    }

  ngOnInit(): void {
    if (!this.modoCrear){
      this.cargarDataAlFormulario(this.perfil);
    }
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
        descripcion: [{value: res.descripcion, disabled: true}]
      });
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
      this.activeModal.close('yes');
    });

  }
}
