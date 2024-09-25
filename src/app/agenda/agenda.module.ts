import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { agendaRoutes } from './agenda.route';
import { CreateAgendaComponent } from './create-agenda.component';
import { UpdateAgendaComponent } from './update-agenda.component';
import { DeleteAgendaModalComponent } from './delete-agenda-modal.component';
import { DesactivateAgendaModalComponent } from './desactivate-agenda-modal.component';
import { ActivateAgendaModalComponent } from './activate-agenda-modal.component';
import { DetailAgendaComponent } from './detail-agenda.component';

@NgModule({
    declarations: [CreateAgendaComponent, UpdateAgendaComponent, DetailAgendaComponent, DeleteAgendaModalComponent, DesactivateAgendaModalComponent, ActivateAgendaModalComponent],
    imports: [SharedModule, RouterModule.forChild(agendaRoutes)]
})
export class AgendaModule { }
