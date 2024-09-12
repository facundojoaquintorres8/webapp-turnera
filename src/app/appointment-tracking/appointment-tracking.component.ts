import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AgendaService } from '../agenda/agenda.service';
import { DeleteAgendaModalComponent } from '../agenda/delete-agenda-modal.component';
import { DesactivateAgendaModalComponent } from '../agenda/desactivate-agenda-modal.component';
import { AuthService } from '../auth/auth.service';
import { ObservationModalComponent } from '../component/observation-modal/observation-modal.component';
import { TableComponent } from '../component/table/table.component';
import { IHeader, InputTypeEnum } from '../component/table/table.models';
import { CustomerService } from '../customer/customer.service';
import { IAgenda } from '../models/agenda.models';
import { AppointmentStatusEnum, AppointmentStatusToListItem, IAppointment } from '../models/appointment.model';
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
import { IInput } from '../component/filter/filter.models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-appointment-tracking',
  templateUrl: './appointment-tracking.component.html',
  styleUrls: ['./appointment-tracking.component.scss']
})
export class AppointmentTrackingComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  private ngbModalRef: NgbModalRef | undefined;

  permissions: string[] = [];
  agendas: IAgenda[] = [];
  resourcesTypes: IListItem[] = [];
  resources: IListItem[] = [];
  customers: IListItem[] = [];
  appointmentStatusList: IListItem[] = AppointmentStatusToListItem;
  appointmentStatusEnum: any = AppointmentStatusEnum;

  today: Date = this.agendaService.viewDate;
  lastDayMonth: Date = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);


  headers!: IHeader[];
  sort: string[] = ['ASC', 'startDate'];

  filterInputs!: IInput[];

  myFormFilter = this.fb.group({
    resourceId: [null],
    resourceTypeId: [null],
    customerId: [null],
    from: [formatNgbDateStructFromDate(this.today), [Validators.required]],
    to: [formatNgbDateStructFromDate(this.lastDayMonth), [Validators.required]],
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
    this.filterInputs = [
      { label: 'Recurso', type: InputTypeEnum.AUTOCOMPLETE, name: 'resourceId', width: 4, onSearch: (search) => this.getResources(search) },
      { label: 'Tipo Recurso', type: InputTypeEnum.AUTOCOMPLETE, name: 'resourceTypeId', width: 4, onSearch: (search) => this.getResourcesTypes(search) },
      { label: 'Desde', type: InputTypeEnum.DATE, name: 'from', width: 2, required: true, maxDate: this.myFormFilter.get(['to'])!.value },
      { label: 'Hasta', type: InputTypeEnum.DATE, name: 'to', width: 2, required: true, minDate: this.myFormFilter.get(['from'])!.value },
      { label: 'Cliente', type: InputTypeEnum.AUTOCOMPLETE, name: 'customerId', width: 6, onSearch: (search) => this.getCustomers(search) },
      { label: 'Último Estado', type: InputTypeEnum.LIST, name: 'status', width: 2, itemList: this.appointmentStatusList }
    ];

    this.headers = [
      { label: 'Recurso', inputType: InputTypeEnum.TEXT, inputName: 'resourceDescription', sort: true },
      { label: 'Inicio', inputType: InputTypeEnum.DATE, inputName: 'startDate', sort: true },
      { label: 'Fin', inputType: InputTypeEnum.DATE, inputName: 'endDate', sort: true },
      { label: 'Cliente', inputType: InputTypeEnum.TEXT, inputName: 'customerBusinessName', sort: false },
      { label: 'Último Estado', inputType: InputTypeEnum.LIST, inputName: 'status', sort: false, itemList: this.appointmentStatusList }
    ];

    this.permissions = this.authService.getPermissions();
  }

  getResources(search: { term: string }): void {
    if (search.term && search.term.length > 2) {
      this.resourceService.findAllByFilter({ active: true, description: search.term })
        .pipe(
          map((res: HttpResponse<IResponse>) => res.body?.data.content
            .map((r: IResource) => ({ id: r.id, value: r.description })))
        )
        .subscribe(
          (res: any) => {
            this.resources = res || [];
            this.filterInputs.find(f => f.name === 'resourceId')!.itemList = this.resources;
          }
        )
    }
  }

  getResourcesTypes(search: { term: string }): void {
    if (search.term && search.term.length > 2) {
      this.resourceTypeService.findAllByFilter({ active: true, description: search.term })
        .pipe(
          map((res: HttpResponse<IResponse>) => res.body?.data.content
            .map((rt: IResourceType) => ({ id: rt.id, value: rt.description })))
        )
        .subscribe(
          (res: any) => {
            this.resourcesTypes = res || [];
            this.filterInputs.find(f => f.name === 'resourceTypeId')!.itemList = this.resourcesTypes;
          }
        )
    }
  }

  getCustomers(search: { term: string }): void {
    if (search.term && search.term.length > 2) {
      this.customerService.findAllByFilter({ active: true, allProperties: search.term })
        .pipe(
          map((res: HttpResponse<IResponse>) => res.body?.data.content
            .map((c: ICustomer) => ({ id: c.id, value: `${c.businessName} (${c.email}) (${c.phone1})` })))
        )
        .subscribe(
          (res: any) => {
            this.customers = res || [];
            this.filterInputs.find(f => f.name === 'customerId')!.itemList = this.customers;
          }
        )
    }
  }

  query = (req?: any) => this.agendaService.findAllByFilter({ ...req, ...this.createFromForm()});

  getAgendas(): void {
    this.updateLimitsToDates();
    this.tableComponent.executeQuery({ page: 1 });
  }
  
  clear(): void {
    // TODO: revisar que llama 5 veces, no debería llamar ninguna
    this.myFormFilter.reset(); //2
    this.myFormFilter.get('from')?.setValue(formatNgbDateStructFromDate(this.today)); //1
    this.myFormFilter.get('to')?.setValue(formatNgbDateStructFromDate(this.lastDayMonth)); //1
    
    this.updateLimitsToDates();

    this.tableComponent.executeQuery({ page: 1 }); //1
  }

  private updateLimitsToDates(): void {
    this.filterInputs.find(f => f.name === 'from')!.maxDate = this.myFormFilter.get(['to'])!.value;
    this.filterInputs.find(f => f.name === 'to')!.minDate = this.myFormFilter.get(['from'])!.value;
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

  appointmentStatusColor(lastAppointment: IAppointment): string {
    let result = 'bg-white border border-primary'; // Free
    if (lastAppointment) {
      switch (this.appointmentStatusEnum[lastAppointment.lastAppointmentStatus.status]) {
        case AppointmentStatusEnum.BOOKED:
          result = 'bg-warning';
          break;
        case AppointmentStatusEnum.ABSENT:
          result = 'bg-dark';
          break;
        case AppointmentStatusEnum.CANCELLED:
          result = 'bg-danger';
          break;
        case AppointmentStatusEnum.IN_ATTENTION:
          result = 'bg-info';
          break;
        case AppointmentStatusEnum.FINALIZED:
          result = 'bg-success';
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
