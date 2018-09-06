import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { GraficoDonaComponent } from './grafico-dona/grafico-dona.component';


@NgModule({
    declarations: [
        IncrementadorComponent,
        GraficoDonaComponent
    ],
    exports: [
        IncrementadorComponent,
        GraficoDonaComponent,
        ChartsModule
    ],
    imports: [
        ChartsModule,
        FormsModule
    ]
})
export class ComponentsModule { }
