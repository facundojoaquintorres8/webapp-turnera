import { Routes } from '@angular/router';
import { AuthGuard } from '../security/auth-guard';
import { CreateAgendaComponent } from './create-agenda.component';
import { UpdateAgendaComponent } from './update-agenda.component';
import { DetailAgendaComponent } from './detail-agenda.component';

export const agendaRoutes: Routes = [
  {
    path: 'new',
    component: CreateAgendaComponent,
    data: {
      title: 'Crear Disponibilidad',
      permissions: ['agendas.write']
    },
    canActivate: [AuthGuard]
  },
  {
    path: ':id/edit',
    component: UpdateAgendaComponent,
    data: {
      title: 'Actualizar Disponibilidad',
      permissions: ['agendas.write']
    },
    canActivate: [AuthGuard]
  },
  {
    path: ':id/view',
    component: DetailAgendaComponent,
    data: {
      title: 'Detalle de Disponibilidad',
      permissions: ['agendas.read']
    },
    canActivate: [AuthGuard]
  }
];