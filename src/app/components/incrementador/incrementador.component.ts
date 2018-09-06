import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress') txtProgress: ElementRef;

  @Input('leyend') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  onChange( newValue: number ) {

    if (newValue > 100) {
      this.progreso = 100;
    } else if (newValue < 0 || newValue == null) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }

    this.txtProgress.nativeElement.value = this.progreso;

    this.cambioValor.emit( this.progreso );
  }

  cambiarProgreso( valor: number ) {

    let nextValue: number = this.progreso + valor;

    if (nextValue > 100) { nextValue = 100; }
    if (nextValue < 0) { nextValue = 0; }

    if (nextValue <= 100 && nextValue >= 0) {
      this.progreso = nextValue;
      this.cambioValor.emit( this.progreso );
      this.txtProgress.nativeElement.focus();
    }
  }

}
