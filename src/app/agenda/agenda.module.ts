import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { agendaRoutes } from './agenda.route';
import { CreateAgendaComponent } from './create-agenda.component';
import { DeleteAgendaModalComponent } from './delete-agenda-modal.component';
import { DesactivateAgendaModalComponent } from './desactivate-agenda-modal.component';

@NgModule({
    declarations: [CreateAgendaComponent, DeleteAgendaModalComponent, DesactivateAgendaModalComponent],
    imports: [SharedModule, RouterModule.forChild(agendaRoutes)]
})
export class AgendaModule { }
