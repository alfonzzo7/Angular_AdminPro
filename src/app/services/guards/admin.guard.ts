import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService
    ) {}

  canActivate() {
    if (this._usuarioService.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else {
      console.warn('Bloqueado por el Admin Guard');
      this._usuarioService.logout();
      swal('¡No tiene permisos!', '', 'error');
      return false;
    }
  }

}
