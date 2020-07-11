import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

declare function init_plugins();


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('username') inputEl: ElementRef;

  iniciando = false;

  constructor(
    public router: Router,
    // tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService,
    private toastr: ToastrService,
    private title: Title)
    {}

    // tslint:disable-next-line: use-lifecycle-interface
    ngAfterViewInit() {
      setTimeout(() => this.inputEl.nativeElement.focus());
  }

  ngOnInit(): void {
    init_plugins();
    this.title.setTitle('Lotización | Login');
  }

  ingresar(forma: NgForm) {

    if (forma.invalid) {
      return;
    }

    const usuario = new Usuario(null, forma.value.username, forma.value.password, null);

    this.iniciando = true;
    this._usuarioService.login(usuario)
      .subscribe(() => {
        this.toastr.success('Bienvenido al sistema');
        this.router.navigate(['/dashboard']);
    });
  }

}
