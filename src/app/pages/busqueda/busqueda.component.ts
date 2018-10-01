import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  cargando: boolean = true;
  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public http: HttpClient
  ) {
    this.activatedRoute.params.subscribe(params => {
      let termino = params['termino'];
      this.buscar(termino);
    });
  }

  ngOnInit() {
  }

  buscar(termino: string) {
    this.cargando = true;

    let url = URL_SERVICIOS + `/busqueda/todo/${termino}`;

    this.http.get(url).subscribe((resp: any) => {
      this.usuarios = resp.usuarios.tabla;
      this.medicos = resp.medicos.tabla;
      this.hospitales = resp.hospitales.tabla;
      this.cargando = false;
    });
  }

}
