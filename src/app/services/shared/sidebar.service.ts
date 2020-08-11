import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any = [
    {
      titulo: 'Principal',
      icono: ' mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url: '/dashboard'},
        { titulo: 'Gráficas', url: '/graficas'}
      ]
    },
    {
      titulo: 'Mantenimientos',
      icono: ' mdi mdi-folder-lock-open',
      submenu: [
        { titulo: 'Usuarios', url: '/usuarios'},
        { titulo: 'Perfiles', url: '/perfiles'},
        { titulo: 'Grupos', url: '/grupos'},
        { titulo: 'Categorías', url: '/categorias'}
      ]
    }
  ];

  constructor() { }
}
