import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

@Injectable()
export class UsuarioService {
  usuario: Usuario;
  token: string;

  constructor(
    public router: Router,
    public http: HttpClient
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
}
