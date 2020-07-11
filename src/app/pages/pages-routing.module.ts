import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { LoginGuardGuard } from '../services/service.index';
import { ProfileComponent } from './usuarios/userProfile/userProfile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GraficasComponent } from './graficas/graficas.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { UsuariosComponent } from './usuarios/usuarios-lista/usuarios-lista.component';


import { UsuarioComponent } from './usuarios/usuario-form/usuario-form.component';
import { PerfilesComponent } from './perfiles/perfiles-lista/perfiles-lista.component';


const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuardGuard],
        children:
        [
            { path: 'perfilUsuario', component: ProfileComponent, data: {titulo: 'Perfil de Usuario'} },
            { path: 'dashboard', component: DashboardComponent, data: {titulo: 'Dashboard'} },
            { path: 'graficas', component: GraficasComponent, data: {titulo: 'Gráficas'} },
            { path: 'busqueda/:termino', component: BusquedaComponent, data: {titulo: 'Buscador'} },

            // Matenimientos
            { path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Usuarios'} },
            { path: 'usuario/:id', component: UsuarioComponent, data: {titulo: 'Usuario'} },
            { path: 'usuario/verificarUsernameNotTaken', component: UsuarioComponent },

            { path: 'perfiles', component: PerfilesComponent, data: {titulo: 'Perfiles'} },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
        ],
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
