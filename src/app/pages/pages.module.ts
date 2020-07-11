import { NgModule } from '@angular/core';

// Angular Material Modules
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';

// Pipe Module
import { PipesModule } from '../pipes/pipes.module';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
// import { PAGES_ROUTES } from './pages.routes';


import { PagesComponent } from './pages.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { GraficasComponent } from './graficas/graficas.component';
import { ProfileComponent } from './userProfile/userProfile.component';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuarios/usuario.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { PerfilComponent } from './perfiles/perfil.component';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { GruposComponent } from './grupos/grupos.component';
import { PagesRoutingModule } from './pages-routing.module';


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
        GruposComponent
    ],
    exports: [
        PagesComponent,
        DashboardComponent,
        GraficasComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        // PAGES_ROUTES,
        PagesRoutingModule,
        PipesModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
    ],
    entryComponents: [PerfilComponent]
})

export class PagesModule {}
