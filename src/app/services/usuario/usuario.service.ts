import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any;

  constructor(
    public router: Router,
    public http: HttpClient,
    public _subirArchivoService: SubirArchivoService
    ) {
    this.cargarStorare();
  }

  renuevaToken() {
    let url = `${URL_SERVICIOS}/login/renuevaToken?token=${this.token}`;

    return this.http.get(url)
                  .map((resp: any) => {
                    this.token = resp.token;
                    localStorage.setItem('token', this.token);
                    console.log('Renueva Token');
                    return true;
                  })
                  .catch(err => {
                    swal('¡Error!', 'No ha sido posible renovar token', 'error');
                    this.logout();
                    return Observable.throw(err);
                  });
  }

  cargarStorare() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarUsuario(id: string, token: string, usuario: Usuario, menu: any) {
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  usuarioLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
                .map((resp: any) => {
                  swal('¡Usuario creado!', usuario.email, 'success');
                  return resp.usuario;
                })
                .catch(err => {
                  this.mostrarErrores(err);
                  return Observable.throw(err);
                });
  }

  actualizarUsuario(usuario: Usuario) {
    let url = `${URL_SERVICIOS}/usuario/${usuario._id}?token=${this.token}`;

    return this.http.put(url, usuario)
                .map((resp: any) => {
                  if (usuario._id === this.usuario._id) {
                    this.guardarUsuario(resp.id, this.token, resp.usuario, this.menu);
                  }
                  swal('¡Usuario actualizado!', usuario.email, 'success');
                  return resp.usuario;
                })
                .catch(err => {
                  this.mostrarErrores(err);
                  return Observable.throw(err);
                });
  }

  actualizarImgUsuario(archivo: File, id: string) {
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
                  .then( (resp: any) => {
                    this.usuario.img = resp.usuario.img;
                    swal('¡Imagen actualizada!', this.usuario.email, 'success');
                    this.guardarUsuario(id, this.token, this.usuario, this.menu);
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

    return this.http.post(url, usuario)
                .map((resp: any) => {
                  this.guardarUsuario(resp.id, resp.token, resp.usuario, resp.menu);
                  return true;
                })
                .catch(err => {
                  swal('¡Error!', err.error.mensaje, 'error');
                  return Observable.throw(err);
                });
  }

  loginGoogle(token) {
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, {token: token}).map((resp: any) => {
      // console.log(resp);
      this.guardarUsuario(resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    });
  }

  logout() {
    this.token = '';
    this.usuario = null;
    this.menu = [];

    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
    // swal('¡Logout realizado con exito!', '', 'success');
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

  mostrarErrores(err) {
    let msgErrores = '';

    Object.keys(err.error.errors.errors).forEach(key => {
      msgErrores += '- ' + err.error.errors.errors[key].message + '\n';
    });

    swal(err.error.mensaje, msgErrores, 'error');
  }
}
