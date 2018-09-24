import { RouterModule, Routes } from '@angular/router';

import { LoginGuardGuard } from '../services/service.index';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AcountSettingsComponent } from './acount-settings/acount-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuardGuard ],
        children: [
            { path: 'dashboard', component: DashboardComponent, data: {titulo: 'Dashboard'}},
            { path: 'progress', component: ProgressComponent, data: {titulo: 'Progreso'}},
            { path: 'graficas', component: Graficas1Component, data: {titulo: 'Gráficas'}},
            { path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'}},
            { path: 'rxjs', component: RxjsComponent, data: {titulo: 'RxJs'}},
            { path: 'settings', component: AcountSettingsComponent, data: {titulo: 'Ajustes del Tema'}},
            { path: 'profile', component: ProfileComponent, data: {titulo: 'Perfil del usuario'}},

            // Mantenimientos
            { path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Mantenimiento de usuarios'}},
            { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
