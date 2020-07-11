import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Perfil } from 'src/app/models/perfil.model';
import { PerfilService } from 'src/app/services/service.index';
import { Router } from '@angular/router';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {

perfilForm: FormGroup;
modoCrear = true;
perfil: Perfil;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public router: Router,
    // tslint:disable-next-line: variable-name
    public _perfilService: PerfilService,
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

  this._perfilService.cargarPerfil(perfil._id)
  // tslint:disable-next-line: no-shadowed-variable
  .subscribe (perfil => {
    this.perfilForm.setValue({
      id: perfil._id,
      nombre: perfil.nombre,
      descripcion: perfil.descripcion
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

  this._perfilService.crearPerfil(perfil)
  .subscribe(() =>  {
    this.activeModal.dismiss();
    this.router.navigate(['/perfiles']);
    this._perfilService.cargarPerfiles();
  });

}

}
