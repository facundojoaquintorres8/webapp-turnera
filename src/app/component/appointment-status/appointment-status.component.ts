import { Component, Input } from '@angular/core';
import { AppointmentStatusEnum, IAppointmentStatus } from 'src/app/models/appointment.model';

@Component({
  selector: 'app-appointment-status',
  templateUrl: './appointment-status.component.html',
  styleUrls: ['./appointment-status.component.scss']
})
export class AppointmentStatusComponent {

  @Input() status!: IAppointmentStatus;
  appointmentStatusEnum: any = AppointmentStatusEnum;

  constructor() { }

  appointmentStatusColor(status: IAppointmentStatus): string {
    let result = 'bg-white border border-primary'; // Free
    if (status) {
      switch (this.appointmentStatusEnum[status.status]) {
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
