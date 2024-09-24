import { Component, Input } from '@angular/core';
import { AppointmentStatusEnum, IAppointment } from 'src/app/models/appointment.model';

@Component({
  selector: 'app-appointment-status',
  templateUrl: './appointment-status.component.html',
  styleUrls: ['./appointment-status.component.scss']
})
export class AppointmentStatusComponent {

  @Input() appointment!: IAppointment;
  appointmentStatusEnum: any = AppointmentStatusEnum;

  constructor() { }

  appointmentStatusColor(appointment: IAppointment): string {
    let result = 'bg-white border border-primary'; // Free
    if (appointment) {
      switch (this.appointmentStatusEnum[appointment.lastAppointmentStatus.status]) {
        case AppointmentStatusEnum.BOOKED:
          result = 'bg-primary text-white';
          break;
        case AppointmentStatusEnum.ABSENT:
          result = 'bg-dark text-white';
          break;
        case AppointmentStatusEnum.CANCELLED:
          result = 'bg-danger text-white';
          break;
        case AppointmentStatusEnum.IN_ATTENTION:
          result = 'bg-info text-white';
          break;
        case AppointmentStatusEnum.FINALIZED:
          result = 'bg-success text-white';
          break;
      }
    }
    return result;
  }


}
