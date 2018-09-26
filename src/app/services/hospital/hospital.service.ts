import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SubirArchivoService, UsuarioService } from '../service.index';
import { Hospital } from '../../models/hospital.model';

@Injectable()
export class HospitalService {

  constructor(
    public router: Router,
    public http: HttpClient,
    public _subirArchivoService: SubirArchivoService,
    public _usuarioService: UsuarioService
    ) { }

  cargarHospitales(desde: number = 0, todos: boolean = false) {
    let url = `${URL_SERVICIOS}/hospital?desde=${desde}&todos=${todos}`;

    return this.http.get(url);
  }

  buscarHospital(termino: string, desde: number = 0) {
    let url = `${URL_SERVICIOS}/busqueda/coleccion/hospitales/${termino}?desde=${desde}`;

    return this.http.get(url);
  }

  obtenerHospital(id: string) {
    let url = `${URL_SERVICIOS}/hospital/${id}`;

    return this.http.get(url).map((resp: any) => {
      return resp.hospital;
    });
  }

  borrarHospital(id: string) {
    let url = `${URL_SERVICIOS}/hospital/${id}?token=${this._usuarioService.token}`;

    return this.http.delete(url)
              .map(resp => {
                swal('Hospital borrado', '', 'success');
                return true;
              });
  }

  actualizarHospital(hospital: Hospital) {
    let url = `${URL_SERVICIOS}/hospital/${hospital._id}?token=${this._usuarioService.token}`;

    return this.http.put(url, hospital).map((resp: any) => {
      swal('Hospital actualizado!', hospital.nombre, 'success');
      return resp.hospital;
    });
  }

  crearHospital(nombre: string) {
    let url = `${URL_SERVICIOS}/hospital?token=${this._usuarioService.token}`;

    return this.http.post(url, {nombre}).map((resp: any) => {
      swal('¡Hospital creado!', nombre, 'success');
      return resp.hospital;
    });
  }

}
