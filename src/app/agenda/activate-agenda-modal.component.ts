import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAgenda } from '../models/agenda.models';
import { AgendaService } from './agenda.service';

@Component({
  templateUrl: './activate-agenda-modal.component.html'
})
export class ActivateAgendaModalComponent {
  agenda!: IAgenda;

  constructor(private agendaService: AgendaService, private activeModal: NgbActiveModal) { }

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmActivate(id: number): void {
    this.agendaService.activate(id).subscribe(
      () => this.activeModal.close()
    );
  }
}

