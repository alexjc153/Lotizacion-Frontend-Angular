import { Component, OnInit } from '@angular/core';
import { Perfil } from '../../models/perfil.model';
import { UsuarioService } from '../../services/service.index';
import { PerfilService } from '../../services/service.index';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidadoresService } from '../../services/validaciones/validadores.service';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';



@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: []
})

export class UsuarioComponent implements OnInit {

  usuarioForm: FormGroup;
  modoCrear = true;
  perfiles: Perfil [] = [];
  usuario: Usuario;
  imagenTemp: any;
  nombreMostrar: string;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public router: Router,
    // tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService,
    // tslint:disable-next-line: variable-name
    public _perfilService: PerfilService,
    // tslint:disable-next-line: variable-name
    public _modalUploadService: ModalUploadService,
    public validadores: ValidadoresService
  ) {
    this.crearFormulario();
    this.usernameChanges();
  }

  ngOnInit(): void {

      if (this.modoCrear) {
        this.usuarioForm.controls.username.setAsyncValidators(this.validadores.validarUsername(this._usuarioService));
      } else {
        this.cargarDataAlFormulario(this.usuario);
      }

      this._perfilService.cargarComboPerfil()
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
        id: [''],
        nombre: ['', Validators.required],
        username: ['', Validators.required],
        password1: ['', Validators.required],
        password2: [''],
        perfil: ['', Validators.required],
    }, {
      validators: this.validadores.passwordsIguales('password1', 'password2')
    });
  }

  usernameChanges(){
    this.usuarioForm.get('username').valueChanges.subscribe(resp => {
      this.usuarioForm.controls.username.setAsyncValidators(this.validadores.validarUsername(this._usuarioService));
    });
  }

  cargarDataAlFormulario(usuario: Usuario){

    this._usuarioService.cargarUsuario(usuario._id)
    // tslint:disable-next-line: no-shadowed-variable
    .subscribe (usuario => {
      this.nombreMostrar = usuario.nombre,

      // this.usuarioForm.setValue({
      this.usuarioForm.reset({
        id: usuario._id,
        nombre: usuario.nombre,
        username: usuario.username,
        perfil: usuario.perfil._id
      });
    });
  }

  mostrarModal( id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
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

    this._usuarioService.crearUsuario ( usuario )
    .subscribe( () => {
      this.activeModal.dismiss();
      this.router.navigate(['/usuarios']);
      this._usuarioService.cargarUsuarios();
    });
  }

}
