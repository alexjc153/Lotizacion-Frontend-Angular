import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/models/grupo.model';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {

  cargando = false;
  grupo: Grupo;
  grupos: Grupo [] = [];
  totalRegistros = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
