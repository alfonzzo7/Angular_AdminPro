import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService, ModalUploadService } from '../../services/service.index';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  total: number = 0;
  cargando: boolean = true;
  termino: string = '';

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion.subscribe(resp => {
      if (this.termino.length <= 0) {
        this.cargarHospitales();
      } else {
        this.buscarHospital(this.termino);
      }
    });
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostarModal('hospitales', id);
  }

  cargarHospitales() {
    this.cargando = true;

    this._hospitalService.cargarHospitales(this.desde)
              .subscribe((resp: any) => {
                this.total = resp.total;
                this.hospitales = resp.hospitales;
                this.cargando = false;

                if (this.hospitales.length === 0) {
                  this.desde = 0;
                  this.cargarHospitales();
                }
    });
  }

  buscarHospital(termino: string) {
    this.termino = termino;

    if (termino.length <= 0) {
      this.desde = 0;
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospital(termino, this.desde)
              .subscribe((resp: any) => {
                this.total = resp.total;
                this.hospitales = resp.hospitales;
                this.cargando = false;
    });
  }

  actualizarHospital(hospital: Hospital) {
    if (hospital.nombre.length <= 0) {
      swal('El nombre del hospital es obligatorio', '', 'error');
      return;
    }
    this._hospitalService.actualizarHospital(hospital).subscribe();
  }

  borrarHospital(hospital: Hospital) {
    swal({
      title: '¿Esta seguro?',
      text: `Esta a punto de borrar el hospital: ${hospital.nombre}`,
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
        this._hospitalService.borrarHospital(hospital._id)
                  .subscribe(resp => {
                    if (this.termino.length <= 0) {
                      this.cargarHospitales();
                    } else {
                      this.buscarHospital(this.termino);
                    }
                  });
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
      this.cargarHospitales();
    } else {
      this.buscarHospital(this.termino);
    }
  }

  crearHospital() {
    swal({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      icon: 'info',
      content: 'input',
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
      }
    })
    .then((value: string) => {
      if (value.length > 0) {
        this._hospitalService.crearHospital(value)
                .subscribe(resp => {
                  if (this.termino.length <= 0) {
                    this.cargarHospitales();
                  } else {
                    this.buscarHospital(this.termino);
                  }
                });
      } else {
        swal('Debe introducir el nombre del hospital', '', 'error');
      }
    });
  }
}
