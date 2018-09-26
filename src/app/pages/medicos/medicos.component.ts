import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/service.index';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  total: number = 0;
  cargando: boolean = true;
  termino: string = '';

  constructor(
    public _medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;

    this._medicoService.cargarMedicos(this.desde)
              .subscribe((resp: any) => {
                this.total = resp.total;
                this.medicos = resp.medicos;
                this.cargando = false;

                if (this.medicos.length === 0) {
                  this.desde = 0;
                  this.cargarMedicos();
                }
    });
  }

  buscarMedico(termino: string) {
    this.termino = termino;

    if (termino.length <= 0) {
      this.desde = 0;
      this.cargarMedicos();
      return;
    }

    this.cargando = true;

    this._medicoService.buscarMedico(termino, this.desde)
              .subscribe((resp: any) => {
                this.total = resp.total;
                this.medicos = resp.medicos;
                this.cargando = false;
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
      this.cargarMedicos();
    } else {
      this.buscarMedico(this.termino);
    }
  }

  borrarMedico(medico: Medico) {
    swal({
      title: '¿Esta seguro?',
      text: `Esta a punto de borrar al médico: ${medico.nombre}`,
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
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        this._medicoService.borrarMedico(medico._id)
                  .subscribe(resp => {
                    if (this.termino.length <= 0) {
                      this.cargarMedicos();
                    } else {
                      this.buscarMedico(this.termino);
                    }
                  });
      }
    });
  }

}
