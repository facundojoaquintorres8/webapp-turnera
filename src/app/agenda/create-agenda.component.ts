import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AgendaService } from './agenda.service';
import { ISaveAgenda, RepeatTypeEnum } from '../models/agenda.models';
import { IResource } from '../models/resource.models';
import { ResourceService } from '../resource/resource.service';
import { formatDateFromNgbDateStruct, formatTimeFromNgbTimeStruct } from '../shared/date-format';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-create-agenda',
  templateUrl: './create-agenda.component.html',
  styleUrls: ['./agenda.scss']
})
export class CreateAgendaComponent implements OnInit {
  isSaving = false;

  resources!: IResource[];
  repeatTypes: any = RepeatTypeEnum;
  showDaysOfWeek!: boolean;
  dayOfTheMonthText!: string;

  private now: Date = new Date();
  private today: NgbDateStruct = { year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate() }

  public minDateToFinalize = (): NgbDateStruct => { return this.myForm.get(['startDate'])!.value };

  myForm = this.fb.group({
    id: [],
    resource: [null, [Validators.required]],
    startDate: [this.today, [Validators.required]],
    startHour: [{ hour: 8, minute: 0, second: 0 }, [Validators.required]],
    endHour: [{ hour: 18, minute: 0, second: 0 }, [Validators.required]],
    zoneId: [null],
    segmented: [null],
    duration: [null],
    repeat: [null],
    repeatType: [null],
    finalize: [null],
    sunday: [false],
    monday: [false],
    tuesday: [false],
    wednesday: [false],
    thursday: [false],
    friday: [false],
    saturday: [false],
    omitHolidays: [true]
  });

  constructor(
    private agendaService: AgendaService,
    private resourceService: ResourceService,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.resourceService.findAllByFilter({ active: true }).subscribe(
      (res: HttpResponse<IResponse>) => this.resources = res.body?.data.content!
    )

    this.myForm.get('zoneId')?.setValue(momentTimeZone.tz.guess());
  }

  previousState(): void {
    window.history.back();
  }

  hasAnyDaySelected(): boolean {
    return (this.showDaysOfWeek && (this.myForm.get(['sunday'])!.value || this.myForm.get(['monday'])!.value ||
      this.myForm.get(['tuesday'])!.value || this.myForm.get(['wednesday'])!.value ||
      this.myForm.get(['thursday'])!.value || this.myForm.get(['friday'])!.value ||
      this.myForm.get(['saturday'])!.value)) || !this.showDaysOfWeek;
  }

  onStartDateChange(): void {
    if (this.myForm.get(['startDate'])!.value && this.myForm.get(['finalize'])!.value
      && (moment(this.myForm.get(['startDate'])!.value).diff(moment(this.myForm.get(['finalize'])!.value)) > 0
        || Number.isNaN(moment(this.myForm.get(['startDate'])!.value).diff(moment(this.myForm.get(['finalize'])!.value))))) {
      this.myForm.get('finalize')?.setValue(null);
    }
    this.setDayOfTheMonth();
  }

  onSegmentedChange(): void {
    this.myForm.controls['duration'].reset();
    if (this.myForm.get('segmented')!.value) {
      this.myForm.controls['duration'].setValidators([Validators.required, Validators.min(5)]);
    } else {
      this.myForm.controls['duration'].clearValidators();
    }
  }

  onRepeatChange(): void {
    if (this.myForm.get('repeat')!.value) {
      if (!this.myForm.get('repeatType')!.value) {
        this.myForm.get('repeatType')?.setValue('DAILY');
      }
      this.myForm.controls['repeatType'].setValidators([Validators.required]);
      this.myForm.controls['finalize'].setValidators([Validators.required]);
      this.showDaysOfWeek = RepeatTypeEnum[this.myForm.get('repeatType')!.value] === RepeatTypeEnum.WEEKLY;
    } else {
      this.myForm.controls['repeatType'].clearValidators();
      this.myForm.controls['finalize'].clearValidators();
    }
  }

  onRepeatTypeChange(): void {
    this.showDaysOfWeek = RepeatTypeEnum[this.myForm.get('repeatType')!.value] === RepeatTypeEnum.WEEKLY;
    this.setDayOfTheMonth();
  }

  originalOrder = (): number => {
    return 0;
  }

  save(): void {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.agendaService.create(this.createFromForm()));
  }

  private setDayOfTheMonth(): void {
    this.dayOfTheMonthText = '';
    if (RepeatTypeEnum[this.myForm.get('repeatType')!.value] === RepeatTypeEnum.MONTHLY && this.myForm.get(['startDate'])!.value) {
      const startDate = moment(formatDateFromNgbDateStruct(this.myForm.get(['startDate'])!.value));
      const dayOfTheMonth: number = parseInt(startDate.format('DD'), 10);
      if (startDate.daysInMonth() === dayOfTheMonth) {
        this.dayOfTheMonthText = 'Mensualmente cada último día del mes';
      } else {
        this.dayOfTheMonthText = `Mensualmente cada ${dayOfTheMonth}`;
      }
    }
  }

  private createFromForm(): ISaveAgenda {
    return {
      id: this.myForm.get(['id'])!.value,
      resource: this.myForm.get(['resource'])!.value,
      startDate: formatDateFromNgbDateStruct(this.myForm.get(['startDate'])!.value)!,
      startHour: formatTimeFromNgbTimeStruct(this.myForm.get(['startHour'])!.value)!,
      endHour: formatTimeFromNgbTimeStruct(this.myForm.get(['endHour'])!.value)!,
      zoneId: this.myForm.get(['zoneId'])!.value,
      segmented: this.myForm.get(['segmented'])!.value,
      duration: this.myForm.get(['duration'])!.value,
      repeat: this.myForm.get(['repeat'])!.value,
      repeatType: this.myForm.get(['repeatType'])!.value,
      finalize: formatDateFromNgbDateStruct(this.myForm.get(['finalize'])!.value)!,
      sunday: this.myForm.get(['sunday'])!.value,
      monday: this.myForm.get(['monday'])!.value,
      tuesday: this.myForm.get(['tuesday'])!.value,
      wednesday: this.myForm.get(['wednesday'])!.value,
      thursday: this.myForm.get(['thursday'])!.value,
      friday: this.myForm.get(['friday'])!.value,
      saturday: this.myForm.get(['saturday'])!.value,
      omitHolidays: this.myForm.get(['omitHolidays'])!.value
    };
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<boolean>>): void {
    result.subscribe(
      () => this.previousState(),
      () => this.isSaving = false
    );
  }
}
