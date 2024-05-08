import { Routes } from '@angular/router';
import { AuthGuard } from '../security/auth-guard';
import { DetailOrganizationComponent } from './detail-organization.component';
import { UpdateOrganizationComponent } from './update-organization.component';

export const organizationRoutes: Routes = [
  {
    path: '',
    component: DetailOrganizationComponent,
    data: {
      title: 'Mi Organización',
      permissions: ['organizations.read']
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'edit',
    component: UpdateOrganizationComponent,
    data: {
      title: 'Editar mi Organización',
      permissions: ['organizations.write']
    },
    canActivate: [AuthGuard]
  },
];