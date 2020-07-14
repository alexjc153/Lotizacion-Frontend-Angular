import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Router } from '@angular/router';
import { Grupo } from '../../../models/grupo.model';
import { GrupoService } from '../../../services/grupo/grupo.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo-form.component.html',
  styleUrls: ['./grupo-form.component.css']
})
export class GrupoComponent implements OnInit {

  grupoForm: FormGroup;
  modoCrear = true;
  grupo: Grupo;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public router: Router,
    public grupoService: GrupoService,
    ) {
      this.crearFormulario();
    }

  ngOnInit(): void {
    if (!this.modoCrear){
      this.cargarDataAlFormulario(this.grupo);
    }
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
        descripcion: [res.descripcion]
      });
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
      this.activeModal.close('yes');
    });

  }

}
