import { NgModule } from '@angular/core';

import { MaterialModule } from '../material/material.module';

// Pipe Module
import { PipesModule } from '../pipes/pipes.module';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
// import { PAGES_ROUTES } from './pages.routes';


import { PagesComponent } from './pages.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { GraficasComponent } from './graficas/graficas.component';
import { ProfileComponent } from './usuarios//userProfile/userProfile.component';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosComponent } from './usuarios/usuarios-lista/usuarios-lista.component';


import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { GruposComponent } from './grupos/grupos-lista/grupos-lista.component';
import { PagesRoutingModule } from './pages-routing.module';
import { UsuarioComponent } from './usuarios/usuario-form/usuario-form.component';
import { PerfilesComponent } from './perfiles/perfiles-lista/perfiles-lista.component';
import { PerfilComponent } from './perfiles/perfil-form/perfil-form.component';
import { GrupoComponent } from './grupos/grupo-form/grupo-form.component';
import { CategoriasComponent } from './categorias/categorias-lista/categorias-lista.component';
import { CategoriaComponent } from './categorias/categoria-form/categoria-form.component';



@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        GraficasComponent,
        ProfileComponent,
        UsuariosComponent,
        UsuarioComponent,
        PerfilesComponent,
        PerfilComponent,
        ModalUploadComponent,
        BusquedaComponent,
        GruposComponent,
        GrupoComponent,
        CategoriasComponent,
        CategoriaComponent,
    ],
    exports: [
        PagesComponent,
        DashboardComponent,
        GraficasComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        PagesRoutingModule,
        PipesModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule

    ],
    entryComponents: []
})

export class PagesModule {}
