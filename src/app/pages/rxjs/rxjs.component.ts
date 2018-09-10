import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { retry, map, filter } from 'rxjs/operators';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {
    this.subscription = this.regresaObservable()
    // .pipe(
    //   retry(2)
    // )
    .subscribe(
      numero => console.log( 'Subs ', numero ),
      error => console.error('Error en el observable', error),
      () => console.log('El observable termino')
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable( (observer: Subscriber<any>) => {
      let contador = 0;
      let intervalo = setInterval( () => {
        contador ++;

        let salida = {
          valor: contador
        };

        observer.next(salida);

        // if (contador === 3) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }

        // if (contador === 2) {
        //   // clearInterval(intervalo);
        //   observer.error('Auxilio');
        // }
      }, 1000);
    }).pipe(
      map( resp => {
        return resp.valor;
      }),
      filter( (valor, index) => {
        if ( (valor % 2) === 1) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

}
