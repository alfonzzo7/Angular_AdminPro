import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SubirArchivoService, UsuarioService } from '../service.index';
import { Medico } from '../../models/medico.model';

@Injectable()
export class MedicoService {

  constructor(
    public router: Router,
    public http: HttpClient,
    public _subirArchivoService: SubirArchivoService,
    public _usuarioService: UsuarioService
    ) { }

    cargarMedicos(desde: number = 0) {
      let url = `${URL_SERVICIOS}/medico?desde=${desde}`;

      return this.http.get(url);
    }

    buscarMedico(termino: string, desde: number = 0) {
      let url = `${URL_SERVICIOS}/busqueda/coleccion/medicos/${termino}?desde=${desde}`;

      return this.http.get(url);
    }

    borrarMedico(id: string) {
      let url = `${URL_SERVICIOS}/medico/${id}?token=${this._usuarioService.token}`;

      return this.http.delete(url)
                .map(resp => {
                  swal('Médico borrado', '', 'success');
                  return true;
                });
    }

    guardarMedico(medico: Medico) {
      if (medico._id) {
        // Actualizando
        let url = `${URL_SERVICIOS}/medico/${medico._id}?token=${this._usuarioService.token}`;

        return this.http.put(url, medico)
                .map((resp: any) => {
                  swal('Médico actualizado', medico.nombre, 'success');
                  return resp.medico;
                });
      } else {
        // Creando
        let url = `${URL_SERVICIOS}/medico?token=${this._usuarioService.token}`;

        return this.http.post(url, medico)
                .map((resp: any) => {
                  swal('Médico creado', medico.nombre, 'success');
                  return resp.medico;
                });
      }
    }

    cargarMedico(id: string) {
      let url = `${URL_SERVICIOS}/medico/${id}`;

      return this.http.get(url)
                  .map((resp: any) => resp.medico);
    }
}
