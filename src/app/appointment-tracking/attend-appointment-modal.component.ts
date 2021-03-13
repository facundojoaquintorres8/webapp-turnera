import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAppointment } from '../models/appointment.model';
import { AppointmentService } from './appointment.service';

@Component({
  templateUrl: './attend-appointment-modal.component.html'
})
export class AttendAppointmentModalComponent {
  appointment!: IAppointment;

  constructor(private appointmentService: AppointmentService, private activeModal: NgbActiveModal) { }

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirm(id: number): void {
    this.appointmentService.attend(id).subscribe(
      () => this.activeModal.close()
    );
  }
}

