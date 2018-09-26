import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService, ModalUploadService } from '../../services/service.index';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;
  total: number = 0;
  cargando: boolean = true;
  termino: string = '';

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
    ) {}

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion.subscribe(resp => {
      if (this.termino.length <= 0) {
        this.cargarUsuarios();
      } else {
        this.buscarUsuario(this.termino);
      }
    });
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostarModal('usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;

    this._usuarioService.cargarUsuarios(this.desde)
              .subscribe((resp: any) => {
                this.total = resp.total;
                this.usuarios = resp.usuarios;
                this.cargando = false;

                if (this.usuarios.length === 0) {
                  this.desde = 0;
                  this.cargarUsuarios();
                }
    });
  }

  paginar(siguiente: number) {
    let desde = this.desde + siguiente;

    if (desde >= this.total) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde = desde;
    if (this.termino.length <= 0) {
      this.cargarUsuarios();
    } else {
      this.buscarUsuario(this.termino);
    }
  }

  buscarUsuario(termino: string) {
    this.termino = termino;

    if (termino.length <= 0) {
      this.desde = 0;
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios(termino, this.desde)
              .subscribe((resp: any) => {
                this.total = resp.total;
                this.usuarios = resp.usuarios;
                this.cargando = false;
    });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this._usuarioService.usuario._id) {
      swal('Atención', 'No se puede borrar a si mismo', 'error');
      return;
    }

    swal({
      title: '¿Esta seguro?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Cancelar',
          value: false,
          visible: true,
          className: '',
          closeModal: true,
        },
        confirm: {
          text: 'Continuar',
          value: true,
          visible: true,
          className: '',
          closeModal: true
        }
      },
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this._usuarioService.borrarUsuario(usuario._id)
                  .subscribe(resp => {
                    if (this.termino.length <= 0) {
                      this.cargarUsuarios();
                    } else {
                      this.buscarUsuario(this.termino);
                    }
                  });
      }
    });
  }

  actualizarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario).subscribe();
  }
}
