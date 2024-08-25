import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAppointment, IAppointmentChangeStatus } from '../models/appointment.model';
import { AppointmentService } from './appointment.service';

@Component({
  templateUrl: './attend-appointment-modal.component.html'
})
export class AttendAppointmentModalComponent {
  isSaving = false;
  appointment!: IAppointment;

  myForm = this.fb.group({
    observations: [null],
  });

  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private activeModal: NgbActiveModal
  ) { }

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirm(): void {
    this.isSaving = true;
    this.appointmentService.attend(this.createFromForm()).subscribe(
      () => this.activeModal.close(),
      () => this.isSaving = false
    );
  }

  private createFromForm(): IAppointmentChangeStatus {
    return {
      id: this.appointment.id,
      observations: this.myForm.get(['observations'])!.value,
    };
  }
}

