import { Component, OnInit, Inject } from '@angular/core';

import { SettingsService } from '../../services/service.index';

@Component({
  selector: 'app-acount-settings',
  templateUrl: './acount-settings.component.html',
  styles: []
})
export class AcountSettingsComponent implements OnInit {

  constructor( public _settings: SettingsService ) { }

  ngOnInit() {
    this.cargarCheck();
  }

  cambiarTema(tema: string, link: any) {
    this.aplicarCheck(link);
    this._settings.aplicarTema(tema);
  }

  aplicarCheck(link: any) {
    let selectores: any = document.getElementsByClassName('selector');
    for ( let ref of selectores ) {
      ref.classList.remove('working');
    }
    link.classList.add('working');
  }

  cargarCheck() {
    let selectores: any = document.getElementsByClassName('selector');

    let tema = this._settings.ajustes.tema;
    for ( let ref of selectores ) {
      if ( ref.getAttribute('data-theme') === tema ) {
        ref.classList.add('working');
        break;
      }
    }
  }

}
