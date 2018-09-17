import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class LoginGuardGuard implements CanActivate {

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
    ) {}

  canActivate() {
    if (this._usuarioService.usuarioLogueado()) {
      console.log('Paso por el Login Guard');
    } else {
      console.warn('Bloqueado por el Login Guard');
      this.router.navigate(['/login']);
    }
    return true;
  }
}
