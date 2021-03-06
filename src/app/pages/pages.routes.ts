import { RouterModule, Routes } from '@angular/router';

import { AdminGuard, VerificaTokenGuard } from '../services/service.index';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AcountSettingsComponent } from './acount-settings/acount-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

const pagesRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [VerificaTokenGuard],
        data: {titulo: 'Dashboard'}
    },
    { path: 'progress', component: ProgressComponent, data: {titulo: 'Progreso'}},
    { path: 'graficas', component: Graficas1Component, data: {titulo: 'Gráficas'}},
    { path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'}},
    { path: 'rxjs', component: RxjsComponent, data: {titulo: 'RxJs'}},
    { path: 'settings', component: AcountSettingsComponent, data: {titulo: 'Ajustes del Tema'}},
    { path: 'profile', component: ProfileComponent, data: {titulo: 'Perfil del usuario'}},
    { path: 'busqueda/:termino', component: BusquedaComponent, data: {titulo: 'Buscador'}},

    // Mantenimientos
    {
        path: 'usuarios',
        component: UsuariosComponent,
        data: {titulo: 'Mantenimiento de usuarios'},
        canActivate: [AdminGuard]
    },

    { path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Mantenimiento de hospitales'}},
    { path: 'medicos', component: MedicosComponent, data: {titulo: 'Mantenimiento de médicos'}},
    { path: 'medico/nuevo', component: MedicoComponent, data: {titulo: 'Alta de médico'}},
    { path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Actualizar médico'}},
    { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
