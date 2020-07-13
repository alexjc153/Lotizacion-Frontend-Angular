import { Component, OnInit, Input } from '@angular/core';

import { Usuario } from '../../../models/usuario.model';
import { Perfil } from '../../../models/perfil.model';

import { FormGroup, Validators, FormBuilder} from '@angular/forms';

import { UsuarioService, PerfilService } from '../../../services/service.index';

import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ValidadoresService } from '../../../services/validaciones/validadores.service';
import { ModalUploadService } from '../../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario-form.component.html',
  styles: []
})

export class UsuarioComponent implements OnInit {

  usuarioForm: FormGroup;
  @Input () modoCrear = true;
  perfiles: Perfil [] = [];
  usuario: Usuario;
  imagenTemp: any;
  nombreMostrar: string;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public router: Router,
    public usuarioService: UsuarioService,
    public perfilService: PerfilService,
    public modalUploadService: ModalUploadService,
    public validadores: ValidadoresService
  ) {
    this.crearFormulario();
    this.usernameChanges();
  }

  ngOnInit(): void {

      if (this.modoCrear) {
        this.usuarioForm.controls.username.setAsyncValidators(this.validadores.validarUsername(this.usuarioService));
      } else {
        this.cargarDataAlFormulario(this.usuario);
      }

      this.perfilService.cargarComboPerfil()
        .subscribe ( perfiles => this.perfiles = perfiles);

  }

  get nombreNoValido(){
    return this.usuarioForm.get('nombre').invalid && this.usuarioForm.get('nombre').touched && !this.usuarioForm.get('nombre').pristine;
  }

  get usernameNoValido(){
    // tslint:disable-next-line: max-line-length
    return this.usuarioForm.get('username').invalid && this.usuarioForm.get('username').touched && !this.usuarioForm.get('username').pristine;
  }

  get password1NoValido(){
    // tslint:disable-next-line: max-line-length
    return this.usuarioForm.get('password1').invalid && this.usuarioForm.get('password1').touched && !this.usuarioForm.get('password1').pristine;
  }

  get perfilNoValido(){
    return this.usuarioForm.get('perfil').invalid && this.usuarioForm.get('perfil').touched && !this.usuarioForm.get('perfil').pristine;
  }

  get password2NoValido(){
    const pass1 = this.usuarioForm.get('password1').value;
    const pass2 = this.usuarioForm.get('password2').value;
    return (pass1 === pass2) ? false : true;
  }

  crearFormulario(){

      this.usuarioForm = this.fb.group({
        id: [null],
        nombre: [null, Validators.required],
        username: [null, Validators.required],
        password1: [null, Validators.required],
        password2: [null],
        perfil: ['', Validators.required],

      }, {
        validators: this.validadores.passwordsIguales('password1', 'password2')
      });
  }

  usernameChanges(){
    this.usuarioForm.get('username').valueChanges.subscribe(resp => {
      this.usuarioForm.controls.username.setAsyncValidators(this.validadores.validarUsername(this.usuarioService));
    });
  }

  cargarDataAlFormulario(usuario: Usuario){

    this.usuarioService.cargarUsuario(usuario._id)
    .subscribe (res => {

      this.nombreMostrar = res.nombre,

      // this.usuarioForm = this.fb.group({
      //   id: [res._id],
      //   nombre: [res.nombre, Validators.required],
      //   username: [res.username, Validators.required],
      //   password1: [null],
      //   password2: [null],
      //   perfil: [res.perfil._id, Validators.required]
      // });

      // this.usuarioForm.controls.username.setAsyncValidators(this.validadores.validarUsername(this.usuarioService));

      this.usuarioForm.reset({
        id: res._id,
        nombre: res.nombre,
        username: res.username,
        perfil: res.perfil._id
      });
    });
  }

  registrarUsuario() {
    if (this.usuarioForm.invalid) {
      return Object.values(this.usuarioForm.controls).forEach (control => {
        control.markAllAsTouched();
      });
    }

    const usuario = new Usuario(
      this.usuarioForm.value.nombre,
      this.usuarioForm.value.username,
      this.usuarioForm.value.password1,
      this.usuarioForm.value.perfil,
      '',
      this.usuarioForm.value.id,
    );

    this.usuarioService.crearUsuario ( usuario )
    .subscribe( () => {
      this.activeModal.close('yes');
    });
  }

}
