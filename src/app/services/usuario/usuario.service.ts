import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable()
export class UsuarioService {
  usuario: Usuario;
  token: string;

  constructor(
    public router: Router,
    public http: HttpClient,
    public _subirArchivoService: SubirArchivoService
    ) {
    this.cargarStorare();
  }

  cargarStorare() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarUsuario(id: string, token: string, usuario: Usuario) {
    this.usuario = usuario;
    this.token = token;

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  usuarioLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).map((resp: any) => {
      swal('¡Usuario creado!', usuario.email, 'success');
      return resp.usuario;
    });
  }

  actualizarUsuario(usuario: Usuario) {
    let url = `${URL_SERVICIOS}/usuario/${usuario._id}?token=${this.token}`;

    return this.http.put(url, usuario).map((resp: any) => {
      if (usuario._id === this.usuario._id) {
        this.guardarUsuario(resp.id, this.token, resp.usuario);
      }
      swal('¡Usuario actualizado!', usuario.email, 'success');
      return resp.usuario;
    });
  }

  actualizarImgUsuario(archivo: File, id: string) {
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
                  .then( (resp: any) => {
                    this.usuario.img = resp.usuario.img;
                    swal('¡Imagen actualizada!', this.usuario.email, 'success');
                    this.guardarUsuario(id, this.token, this.usuario);
                  })
                  .catch( err => {
                    console.error(err);
                  });
  }

  login(usuario: Usuario, recuerdame: boolean = false) {
    if (recuerdame) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';

    return this.http.post(url, usuario).map((resp: any) => {
      this.guardarUsuario(resp.id, resp.token, resp.usuario);
      return true;
    });
  }

  loginGoogle(token) {
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, {token: token}).map((resp: any) => {
      // console.log(resp);
      this.guardarUsuario(resp.id, resp.token, resp.usuario);
      return true;
    });
  }

  logout() {
    this.token = '';
    this.usuario = null;

    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
    swal('¡Logout realizado con exito!', '', 'success');
  }

  cargarUsuarios(desde: number = 0) {
    let url = `${URL_SERVICIOS}/usuario?desde=${desde}`;

    return this.http.get(url);
  }

  buscarUsuarios(termino: string, desde: number = 0) {
    let url = `${URL_SERVICIOS}/busqueda/coleccion/usuarios/${termino}?desde=${desde}`;

    return this.http.get(url);
  }

  borrarUsuario(id: string) {
    let url = `${URL_SERVICIOS}/usuario/${id}?token=${this.token}`;

    return this.http.delete(url)
              .map(resp => {
                swal('Usuario borrado', '', 'success');
                return true;
              });
  }
}
