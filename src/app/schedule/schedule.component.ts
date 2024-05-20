import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarMonthViewBeforeRenderEvent, CalendarView } from 'angular-calendar';
import { MonthViewDay } from 'calendar-utils';
import { AgendaService } from '../agenda/agenda.service';
import { DeleteAgendaModalComponent } from '../agenda/delete-agenda-modal.component';
import { DesactivateAgendaModalComponent } from '../agenda/desactivate-agenda-modal.component';
import { AbsentAppointmentModalComponent } from '../appointment-tracking/absent-appointment-modal.component';
import { AttendAppointmentModalComponent } from '../appointment-tracking/attend-appointment-modal.component';
import { BookAppointmentComponent } from '../appointment-tracking/book-appointment-modal.component';
import { CancelAppointmentModalComponent } from '../appointment-tracking/cancel-appointment-modal.component';
import { FinalizeAppointmentModalComponent } from '../appointment-tracking/finalize-appointment-modal.component';
import { AuthService } from '../auth/auth.service';
import { IAgenda } from '../models/agenda.models';
import { AppointmentStatusEnum } from '../models/appointment.model';
import { checkPermission } from '../security/check-permissions';
import { formatDateFromDate } from '../shared/date-format';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.scss']
})
export class ScheduleComponent implements OnInit {
  private ngbModalRef: NgbModalRef | undefined;

  permissions: string[] = [];
  canViewAgendas: boolean = false;
  events: CalendarEvent[] = [];
  view: CalendarView = CalendarView.Month;
  today: string = this.datePipe.transform(new Date(), 'dd/MM/yyyy') + '';
  loading!: boolean;
  agendaSelected?: IAgenda;


  
  appointmentStatusEnum: any = AppointmentStatusEnum;
  appointmentStatusTranslate = {
    FREE: "Libre",
    BOOKED: "Reservado",
    ABSENT: "Ausente",
    CANCELLED: "Cancelado",
    IN_ATTENTION: "En Atención",
    FINALIZED: "Finalizado",
  }

  constructor(
    public agendaService: AgendaService,
    private datePipe: DatePipe,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.permissions = this.authService.getPermissions();
    this.canViewAgendas = checkPermission(this.permissions, ['agendas.read']);
    if (this.canViewAgendas) {
      this.onCalendarChange();      
    }
  }

  dayClicked(): void {
    if (this.canViewAgendas) {
      this.router.navigate(['/appointment-tracking']);
    }
  }

  handleEvent(event: CalendarEvent): void {
    if (this.agendaSelected === event['agenda']) {
      this.agendaSelected = undefined;
    } else {
      this.agendaSelected = event['agenda'];      
    }
  }

  closeOpenMonthViewDay(): void {
    if (this.canViewAgendas) {
      this.onCalendarChange();      
    }
  }

  onCalendarChange(): void {
    this.loading = true;
    this.agendaService.findAllByFilter({ ignorePaginated: true, page: 0, ...this.createFromForm() }).subscribe(
      (res: HttpResponse<IResponse>) => {
        this.events = res.body?.data.content.map((x: IAgenda) => ({
          id: x.id,
          start: new Date(x.startDate),
          end: new Date(x.endDate),
          title: this.getEventTitle(x),
          agenda: x,
          lastAppointmentStatus: x.lastAppointment ? x.lastAppointment.lastAppointmentStatus.status : null
        }));
        this.loading = false;
      }
    );
  }

  private createFromForm(): any {
    const from = new Date(this.agendaService.viewDate.getFullYear(), this.agendaService.viewDate.getMonth(), 1);
    const to = new Date(this.agendaService.viewDate.getFullYear(), this.agendaService.viewDate.getMonth() + 1, 0);
    return {
      from: formatDateFromDate(from),
      to: formatDateFromDate(to),
      active: true
    };
  }

  private getEventTitle(agenda: IAgenda): string {
    let title = this.datePipe.transform(agenda.startDate, 'dd/MM/yyyy HH:mm') + '\n' + agenda.resource.description;
    if (agenda.lastAppointment && this.appointmentStatusEnum[agenda.lastAppointment.lastAppointmentStatus.status] !== AppointmentStatusEnum.CANCELLED) {
      title = title + '\n' + agenda.lastAppointment.customerBusinessName + ' (' + this.appointmentStatusTranslate[agenda.lastAppointment.lastAppointmentStatus.status] + ')';
    }
    return title;
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    renderEvent.header.forEach((header: any) => {
      header.cssClass = 'titlecase'
    });
    renderEvent.body.forEach((day: any) => {
      if (day.date < today) {
        day.cssClass = 'bg-secondary';
      }
    });
  }

  quantityAppointmentsReserved(events: CalendarEvent[]): number {
    return !events.length ? 0 : events.filter(x => !x['available']).length;
  }

  isYesterdayEvent(event: CalendarEvent, day: MonthViewDay): boolean {
    return event.end?.getHours() === 0 && day.day !== event.start.getDay();
  }

  getColor(event: CalendarEvent): string {
    let result = 'btn-outline-primary'; // Free or Cancelled
    if (event['lastAppointmentStatus']) {
      switch (this.appointmentStatusEnum[event['lastAppointmentStatus']]) {
        case AppointmentStatusEnum.BOOKED:
          result = 'btn-warning';
          break;
        case AppointmentStatusEnum.ABSENT:
          result = 'btn-dark';
          break;
        case AppointmentStatusEnum.IN_ATTENTION:
          result = 'btn-info';
          break;
        case AppointmentStatusEnum.FINALIZED:
          result = 'btn-success';
          break;
      }
    }
    return result;
  }

  getFirstLetterFromStatus(event: CalendarEvent): string {
    let result = 'L';
    if (event['lastAppointmentStatus']) {
      switch (this.appointmentStatusEnum[event['lastAppointmentStatus']]) {
        case AppointmentStatusEnum.BOOKED:
          result = 'R';
          break;
        case AppointmentStatusEnum.ABSENT:
          result = 'A';
          break;
        case AppointmentStatusEnum.IN_ATTENTION:
          result = 'E';
          break;
        case AppointmentStatusEnum.FINALIZED:
          result = 'F';
          break;
      }
    }
    return result;
  }

  getTotalBadge(day: MonthViewDay): number {
    return day.events.filter(x => x.start.getDay() === day.day).length;
  }

  // Agenda-Appointments
  canBook(): boolean {
    return this.agendaSelected !== undefined && (!this.agendaSelected.lastAppointment || this.appointmentStatusEnum[this.agendaSelected.lastAppointment.lastAppointmentStatus.status] === AppointmentStatusEnum.CANCELLED)
      && new Date(this.agendaSelected.startDate) > new Date() && checkPermission(this.permissions, ['appointments.book']);
  }

  canAbsent(): boolean {
    return this.agendaSelected !== undefined && this.agendaSelected.lastAppointment && this.appointmentStatusEnum[this.agendaSelected.lastAppointment.lastAppointmentStatus.status] === AppointmentStatusEnum.BOOKED
      && checkPermission(this.permissions, ['appointments.absent']);
  }

  canCancel(): boolean {
    return this.agendaSelected !== undefined && this.agendaSelected.lastAppointment && this.appointmentStatusEnum[this.agendaSelected.lastAppointment.lastAppointmentStatus.status] === AppointmentStatusEnum.BOOKED
      && checkPermission(this.permissions, ['appointments.cancel']);
  }

  canAttend(): boolean {
    return this.agendaSelected !== undefined && this.agendaSelected.lastAppointment && this.appointmentStatusEnum[this.agendaSelected.lastAppointment.lastAppointmentStatus.status] === AppointmentStatusEnum.BOOKED
      && checkPermission(this.permissions, ['appointments.attend']);
  }

  canFinalize(): boolean {
    return this.agendaSelected !== undefined && this.agendaSelected.lastAppointment && this.appointmentStatusEnum[this.agendaSelected.lastAppointment.lastAppointmentStatus.status] === AppointmentStatusEnum.IN_ATTENTION
      && checkPermission(this.permissions, ['appointments.finalize']);
  }

  canDelete(): boolean {
    return this.agendaSelected !== undefined && !this.agendaSelected.lastAppointment && checkPermission(this.permissions, ['agendas.delete']);
  }

  canDesactivate(): boolean {
    return this.agendaSelected !== undefined && (!this.agendaSelected.lastAppointment || this.appointmentStatusEnum[this.agendaSelected.lastAppointment.lastAppointmentStatus.status] === AppointmentStatusEnum.CANCELLED)
      && checkPermission(this.permissions, ['agendas.write']);
  }

  book(): void {
    this.ngbModalRef = this.modalService.open(BookAppointmentComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.agenda = this.agendaSelected!;
    this.ngbModalRef.result.then(
      () => {
        this.ngbModalRef = undefined;
        this.onCalendarChange();
        this.agendaSelected = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
        this.agendaSelected = undefined;
      }
    );
  }

  absent(): void {
    this.ngbModalRef = this.modalService.open(AbsentAppointmentModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.appointment = this.agendaSelected!.lastAppointment;
    this.ngbModalRef.result.then(
      () => {
        this.ngbModalRef = undefined;
        this.onCalendarChange();
        this.agendaSelected = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
        this.agendaSelected = undefined;
      }
    );
  }

  cancel(): void {
    this.ngbModalRef = this.modalService.open(CancelAppointmentModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.appointment = this.agendaSelected!.lastAppointment;
    this.ngbModalRef.result.then(
      () => {
        this.ngbModalRef = undefined;
        this.onCalendarChange();
        this.agendaSelected = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
        this.agendaSelected = undefined;
      }
    );
  }

  attend(): void {
    this.ngbModalRef = this.modalService.open(AttendAppointmentModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.appointment = this.agendaSelected!.lastAppointment;
    this.ngbModalRef.result.then(
      () => {
        this.ngbModalRef = undefined;
        this.onCalendarChange();
        this.agendaSelected = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
        this.agendaSelected = undefined;
      }
    );
  }

  finalize(): void {
    this.ngbModalRef = this.modalService.open(FinalizeAppointmentModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.appointment = this.agendaSelected!.lastAppointment;
    this.ngbModalRef.result.then(
      () => {
        this.ngbModalRef = undefined;
        this.onCalendarChange();
        this.agendaSelected = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
        this.agendaSelected = undefined;
      }
    );
  }

  delete(): void {
    this.ngbModalRef = this.modalService.open(DeleteAgendaModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.agenda = this.agendaSelected!;
    this.ngbModalRef.result.then(
      () => {
        this.ngbModalRef = undefined;
        this.onCalendarChange();
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }

  desactivate(): void {
    this.ngbModalRef = this.modalService.open(DesactivateAgendaModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.agenda = this.agendaSelected!;
    this.ngbModalRef.result.then(
      () => {
        this.ngbModalRef = undefined;
        this.onCalendarChange();
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }
}
