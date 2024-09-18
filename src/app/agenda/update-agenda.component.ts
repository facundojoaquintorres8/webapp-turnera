import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AgendaService } from './agenda.service';
import { IAgenda, IUpdateAgenda} from '../models/agenda.models';
import { IResource } from '../models/resource.models';
import { ResourceService } from '../resource/resource.service';
import { compareEqualDates, compareEqualOrGreaterTimes, formatDateFromNgbDateStruct, formatNgbDateStructFromDate, formatNgbTimeStructFromDate, formatTimeFromNgbTimeStruct } from '../shared/date-util';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as momentTimeZone from 'moment-timezone';
import { IResponse } from '../models/response.models';
import { IResourceType } from '../models/resourceType.models';
import { ActivatedRoute } from '@angular/router';
import { AppointmentStatusEnum } from '../models/appointment.model';

@Component({
  selector: 'app-update-agenda',
  templateUrl: './update-agenda.component.html',
  styleUrls: ['./agenda.scss']
})
export class UpdateAgendaComponent implements OnInit {
  isSaving = false;
  showDateValidation: boolean = false;

  resources!: IResource[];
  resourcesTypes!: IResourceType[] | null;

  public minDate = (): NgbDateStruct => { return this.myForm.get(['startDate'])!.value };
  public maxDate = (): NgbDateStruct => { return this.myForm.get(['endDate'])!.value };

  appointmentStatusEnum: any = AppointmentStatusEnum;

  myForm = new UntypedFormGroup({
    id: new UntypedFormControl(null, [Validators.required]),
    resource: new UntypedFormControl(null, [Validators.required]),
    resourceType: new UntypedFormControl(null, [Validators.required]),
    startDate: new UntypedFormControl(null, [Validators.required]),
    startHour: new UntypedFormControl(null, [Validators.required]),
    endDate: new UntypedFormControl(null, [Validators.required]),
    endHour: new UntypedFormControl(null, [Validators.required]),
    zoneId: new UntypedFormControl(null, [Validators.required]),
    active: new UntypedFormControl(null, [Validators.required]),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private agendaService: AgendaService,
    private resourceService: ResourceService,
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id")!;
    this.agendaService.find(parseInt(id)).subscribe(
      (res: HttpResponse<IResponse>) => this.updateForm(res.body?.data)
    );

    this.resourceService.findAllByFilter({ active: true }).subscribe(
      (res: HttpResponse<IResponse>) => this.resources = res.body?.data.content
    )

    this.myForm.get('zoneId')?.setValue(momentTimeZone.tz.guess());
  }

  previousState(): void {
    window.history.back();
  }

  updateForm(agenda: IAgenda): void {
    this.myForm.patchValue({
      id: agenda.id,
      resource: agenda.resource,
      resourceType: agenda.resourceType,
      startDate: formatNgbDateStructFromDate(new Date(agenda.startDate)),
      startHour: formatNgbTimeStructFromDate(new Date(agenda.startDate)),
      endDate: formatNgbDateStructFromDate(new Date(agenda.endDate)),
      endHour: formatNgbTimeStructFromDate(new Date(agenda.endDate)),
      active: agenda.active
    });

    if (agenda.lastAppointment && this.appointmentStatusEnum[agenda.lastAppointment.lastAppointmentStatus.status] !== AppointmentStatusEnum.CANCELLED) {
      this.myForm.get('active')!.disable();
    }
  }

  onResourceChange(): void {
    const selectedResource: IResource = this.myForm.get(['resource'])!.value;
    if(selectedResource) {
      this.myForm.get('resourceType')!.enable();
      this.resourcesTypes = selectedResource.resourcesTypes;
      if (this.resourcesTypes.length === 1) {
        this.myForm.get('resourceType')?.setValue(this.resourcesTypes[0]);
      } else {
        this.myForm.get('resourceType')?.setValue(null);
      }
    } else {
      this.myForm.get('resourceType')?.setValue(null);
      this.myForm.get('resourceType')!.disable();
    }
  }

  validateDates(): void {
    this.showDateValidation = false;
    if (compareEqualDates(this.myForm.get(['startDate'])!.value, this.myForm.get(['endDate'])!.value)) {
      if (compareEqualOrGreaterTimes(this.myForm.get(['startHour'])!.value, this.myForm.get(['endHour'])!.value)) {
        this.showDateValidation = true;
      }
    }
  }

  save(): void {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.agendaService.update(this.createFromForm()));
  }

  private createFromForm(): IUpdateAgenda {
    return {
      id: this.myForm.get(['id'])!.value,
      resource: this.myForm.get(['resource'])!.value,
      resourceType: this.myForm.get(['resourceType'])!.value,
      startDate: formatDateFromNgbDateStruct(this.myForm.get(['startDate'])!.value)!,
      startHour: formatTimeFromNgbTimeStruct(this.myForm.get(['startHour'])!.value)!,
      endDate: formatDateFromNgbDateStruct(this.myForm.get(['endDate'])!.value)!,
      endHour: formatTimeFromNgbTimeStruct(this.myForm.get(['endHour'])!.value)!,
      zoneId: this.myForm.get(['zoneId'])!.value,
      active: this.myForm.get(['active'])!.value,
    };
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResponse>>): void {
    result.subscribe(
      () => this.previousState(),
      () => this.isSaving = false
    );
  }
}
