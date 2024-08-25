import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AgendaService } from '../agenda/agenda.service';
import { DeleteAgendaModalComponent } from '../agenda/delete-agenda-modal.component';
import { DesactivateAgendaModalComponent } from '../agenda/desactivate-agenda-modal.component';
import { AuthService } from '../auth/auth.service';
import { ObservationModalComponent } from '../component/observation-modal/observation-modal.component';
import { TableComponent } from '../component/table/table.component';
import { IHeader, InputTypeEnum } from '../component/table/table.models';
import { CustomerService } from '../customer/customer.service';
import { IAgenda } from '../models/agenda.models';
import { AppointmentStatusEnum, IAppointment } from '../models/appointment.model';
import { ICustomer } from '../models/customer.models';
import { IListItem } from '../models/list.models';
import { IResource } from '../models/resource.models';
import { IResourceType } from '../models/resourceType.models';
import { ResourceTypeService } from '../resource-type/resource-type.service';
import { ResourceService } from '../resource/resource.service';
import { checkPermission } from '../security/check-permissions';
import { formatDateFromNgbDateStruct, formatNgbDateStructFromDate } from '../shared/date-format';
import { AbsentAppointmentModalComponent } from './absent-appointment-modal.component';
import { AttendAppointmentModalComponent } from './attend-appointment-modal.component';
import { BookAppointmentComponent } from './book-appointment-modal.component';
import { CancelAppointmentModalComponent } from './cancel-appointment-modal.component';
import { FinalizeAppointmentModalComponent } from './finalize-appointment-modal.component';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-appointment-tracking',
  templateUrl: './appointment-tracking.component.html'
})
export class AppointmentTrackingComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  private ngbModalRef: NgbModalRef | undefined;

  permissions: string[] = [];
  isSearching: boolean = false;
  agendas: IAgenda[] = [];
  resourcesTypes: IResourceType[] = [];
  resources: IResource[] = [];
  customers: ICustomer[] = [];
  appointmentStatus: IListItem[] = [];
  appointmentStatusEnum: any = AppointmentStatusEnum;
  today: Date = this.agendaService.viewDate;
  firstDayMonth: Date = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  lastDayMonth: Date = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);

  appointmentStatusObject = {
    FREE: "Libre",
    BOOKED: "Reservado",
    ABSENT: "Ausente",
    CANCELLED: "Cancelado",
    IN_ATTENTION: "En Atención",
    FINALIZED: "Finalizado",
  }

  myFormFilter = this.fb.group({
    resourceTypeId: [0],
    resourceId: [0],
    customerId: [0],
    from: [formatNgbDateStructFromDate(this.firstDayMonth), [Validators.required]],
    to: [formatNgbDateStructFromDate(this.lastDayMonth), [Validators.required]],
  });

  public maxDate = (): NgbDateStruct => { return this.myFormFilter.get(['to'])!.value };
  public minDate = (): NgbDateStruct => { return this.myFormFilter.get(['from'])!.value };

  headers!: IHeader[];
  sort: string[] = ['ASC', 'startDate'];
  myForm = this.fb.group({
    resourceDescription: [null],
    startDate: [null],
    endDate: [null],
    customerBusinessName: [null],
    status: [null],
  });

  constructor(
    private agendaService: AgendaService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private resourceTypeService: ResourceTypeService,
    private resourceService: ResourceService,
    private customerService: CustomerService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.headers = [
      { label: 'Recurso', inputType: InputTypeEnum.TEXT, inputName: 'resourceDescription', sort: true },
      { label: 'Inicio', inputType: InputTypeEnum.DATE, inputName: 'startDate', sort: true },
      { label: 'Fin', inputType: InputTypeEnum.DATE, inputName: 'endDate', sort: true },
      { label: 'Cliente', inputType: InputTypeEnum.TEXT, inputName: 'customerBusinessName', sort: false },
      { label: 'Último Estado', inputType: InputTypeEnum.LIST, inputName: 'status', sort: false, itemList: this.appointmentStatus }
    ];

    this.permissions = this.authService.getPermissions();

    this.resourceTypeService.findAllByFilter({}).subscribe(
      (res: HttpResponse<IResponse>) => this.resourcesTypes = res.body?.data.content || []
    );

    this.resourceService.findAllByFilter({}).subscribe(
      (res: HttpResponse<IResponse>) => this.resources = res.body?.data.content || []
    );

    this.customerService.findAllByFilter({}).subscribe(
      (res: HttpResponse<IResponse>) => this.customers = res.body?.data.content || []
    );

    // TODO: arreglar lista porque no le gusta al angular nuevo
    // Object.keys(this.appointmentStatusObject).map(key =>
    //   this.appointmentStatus.push({ id: key, value: this.appointmentStatusObject[key] })
    // );
  }

  clear(): void {
    this.myFormFilter.reset();
    this.myFormFilter.get('from')?.setValue(formatNgbDateStructFromDate(this.firstDayMonth));
    this.myFormFilter.get('to')?.setValue(formatNgbDateStructFromDate(this.lastDayMonth));
    this.tableComponent.executeQuery({ page: 1 });
  }

  query = (req?: any) => this.agendaService.findAllByFilter({ ...req, ...this.createFromForm()});

  getAgendas(): void {
    this.tableComponent.executeQuery({ page: 1 });
  }

  private createFromForm(): any {
    return {
      resourceTypeId: this.myFormFilter.get(['resourceTypeId'])!.value,
      resourceId: this.myFormFilter.get(['resourceId'])!.value,
      customerId: this.myFormFilter.get(['customerId'])!.value,
      from: formatDateFromNgbDateStruct(this.myFormFilter.get(['from'])!.value),
      to: formatDateFromNgbDateStruct(this.myFormFilter.get(['to'])!.value),
      active: true,
    };
  }

  onResourceTypeChange(): void {
    if (this.myFormFilter.get('resourceTypeId')?.value === null) { 
      this.resourceService.findAllByFilter({}).subscribe(
        (res: HttpResponse<IResponse>) => this.resources = res.body?.data.content || []
      );  
    } else {
      this.resourceService.findAllByFilter({ resourceTypeId: this.myFormFilter.get('resourceTypeId')?.value }).subscribe(
        (res: HttpResponse<IResponse>) => this.resources = res.body?.data.content || []
      );  
    }
  }

  onResourceChange(): void {
    if (this.myFormFilter.get('resourceId')?.value !== null) {
      const resource = this.resources.find(x => x.id == this.myFormFilter.get('resourceId')!.value);
      this.myFormFilter.get('resourceTypeId')?.setValue(resource!.resourceType.id);
      this.myFormFilter.get('resourceTypeId')?.disable();
    } else {
      this.myFormFilter.get('resourceTypeId')?.enable();
    }
  }

  appointmentStatusColor(lastAppointment: IAppointment): string {
    let result = 'badge badge-white border border-primary'; // Free
    if (lastAppointment) {
      switch (this.appointmentStatusEnum[lastAppointment.lastAppointmentStatus.status]) {
        case AppointmentStatusEnum.BOOKED:
          result = 'badge badge-warning';
          break;
        case AppointmentStatusEnum.ABSENT:
          result = 'badge badge-dark';
          break;
        case AppointmentStatusEnum.CANCELLED:
          result = 'badge badge-danger';
          break;
        case AppointmentStatusEnum.IN_ATTENTION:
          result = 'badge badge-info';
          break;
        case AppointmentStatusEnum.FINALIZED:
          result = 'badge badge-success';
          break;
      }
    }
    return result;
  }

  canBook(agenda: IAgenda): boolean {
    return (!agenda.lastAppointment || this.appointmentStatusEnum[agenda.lastAppointment.lastAppointmentStatus.status] === AppointmentStatusEnum.CANCELLED)
        && checkPermission(this.permissions, ['appointments.book']);
  }

  canAbsent(agenda: IAgenda): boolean {
    return agenda.lastAppointment && this.appointmentStatusEnum[agenda.lastAppointment.lastAppointmentStatus.status] === AppointmentStatusEnum.BOOKED
      && checkPermission(this.permissions, ['appointments.absent']);
  }

  canCancel(agenda: IAgenda): boolean {
    return agenda.lastAppointment && this.appointmentStatusEnum[agenda.lastAppointment.lastAppointmentStatus.status] === AppointmentStatusEnum.BOOKED
      && checkPermission(this.permissions, ['appointments.cancel']);
  }

  canAttend(agenda: IAgenda): boolean {
    return agenda.lastAppointment && this.appointmentStatusEnum[agenda.lastAppointment.lastAppointmentStatus.status] === AppointmentStatusEnum.BOOKED
      && checkPermission(this.permissions, ['appointments.attend']);
  }

  canFinalize(agenda: IAgenda): boolean {
    return agenda.lastAppointment && this.appointmentStatusEnum[agenda.lastAppointment.lastAppointmentStatus.status] === AppointmentStatusEnum.IN_ATTENTION
      && checkPermission(this.permissions, ['appointments.finalize']);
  }

  canDelete(agenda: IAgenda): boolean {
    return !agenda.lastAppointment && checkPermission(this.permissions, ['agendas.delete']);
  }

  canDesactivate(agenda: IAgenda): boolean {
    return !agenda.lastAppointment || this.appointmentStatusEnum[agenda.lastAppointment.lastAppointmentStatus.status] === AppointmentStatusEnum.CANCELLED
      && checkPermission(this.permissions, ['agendas.write']);
  }

  book(agenda: IAgenda): void {
    this.ngbModalRef = this.modalService.open(BookAppointmentComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.agenda = agenda;
    this.ngbModalRef.result.then(
      () => {
        this.tableComponent.executeQuery({ page: 1 });
        this.ngbModalRef = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }

  absent(lastAppointment: IAppointment): void {
    this.ngbModalRef = this.modalService.open(AbsentAppointmentModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.appointment = lastAppointment;
    this.ngbModalRef.result.then(
      () => {
        this.tableComponent.executeQuery({ page: 1 });
        this.ngbModalRef = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }

  cancel(lastAppointment: IAppointment): void {
    this.ngbModalRef = this.modalService.open(CancelAppointmentModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.appointment = lastAppointment;
    this.ngbModalRef.result.then(
      () => {
        this.tableComponent.executeQuery({ page: 1 });
        this.ngbModalRef = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }

  attend(lastAppointment: IAppointment): void {
    this.ngbModalRef = this.modalService.open(AttendAppointmentModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.appointment = lastAppointment;
    this.ngbModalRef.result.then(
      () => {
        this.tableComponent.executeQuery({ page: 1 });
        this.ngbModalRef = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }

  finalize(lastAppointment: IAppointment): void {
    this.ngbModalRef = this.modalService.open(FinalizeAppointmentModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.appointment = lastAppointment;
    this.ngbModalRef.result.then(
      () => {
        this.tableComponent.executeQuery({ page: 1 });
        this.ngbModalRef = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }

  delete(agenda: IAgenda): void {
    this.ngbModalRef = this.modalService.open(DeleteAgendaModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.agenda = agenda;
    this.ngbModalRef.result.then(
      () => {
        this.tableComponent.executeQuery({ page: 1 });
        this.ngbModalRef = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }

  desactivate(agenda: IAgenda): void {
    this.ngbModalRef = this.modalService.open(DesactivateAgendaModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.agenda = agenda;
    this.ngbModalRef.result.then(
      () => {
        this.tableComponent.executeQuery({ page: 1 });
        this.ngbModalRef = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }

  seeObservations(observations: string): void {
    this.ngbModalRef = this.modalService.open(ObservationModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.observations = observations;
    this.ngbModalRef.result.then(
      () => {
        this.ngbModalRef = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }
}
