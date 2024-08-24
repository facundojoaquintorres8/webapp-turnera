import { NgModule } from '@angular/core';
import { AppointmentTrackingComponent } from './appointment-tracking.component';
import { RouterModule } from '@angular/router';
import { appointmentTrackingRoutes } from './appointment-tracking.route';
import { SharedModule } from '../shared/shared.module';
import { BookAppointmentComponent } from './book-appointment-modal.component';
import { AbsentAppointmentModalComponent } from './absent-appointment-modal.component';
import { CancelAppointmentModalComponent } from './cancel-appointment-modal.component';
import { AttendAppointmentModalComponent } from './attend-appointment-modal.component';
import { FinalizeAppointmentModalComponent } from './finalize-appointment-modal.component';

@NgModule({
    declarations: [
        AppointmentTrackingComponent,
        BookAppointmentComponent,
        AbsentAppointmentModalComponent,
        CancelAppointmentModalComponent,
        AttendAppointmentModalComponent,
        FinalizeAppointmentModalComponent,
    ],
    imports: [SharedModule, RouterModule.forChild(appointmentTrackingRoutes)]
})
export class AppointmentTrackingModule {}
