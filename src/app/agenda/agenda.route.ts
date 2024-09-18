import { Routes } from '@angular/router';
import { AuthGuard } from '../security/auth-guard';
import { CreateAgendaComponent } from './create-agenda.component';
import { UpdateAgendaComponent } from './update-agenda.component';

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
];