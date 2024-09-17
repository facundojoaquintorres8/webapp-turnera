import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HolidayService } from './holiday.service';
import { IHoliday, ISaveHoliday } from '../models/holiday.models';
import { formatDateFromNgbDateStruct, formatNgbDateStructFromDate } from '../shared/date-util';
import moment from 'moment';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-update-holiday',
  templateUrl: './update-holiday.component.html'
})
export class UpdateHolidayComponent implements OnInit {
  isSaving = false;

  myForm = this.fb.group({
    id: [0],
    date: [formatNgbDateStructFromDate(new Date()), [Validators.required]],
    description: ['', [Validators.required]],
    useInAgenda: [false],
    active: [false],
  });

  constructor(
    private holidayService: HolidayService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.holidayService.find(parseInt(id)).subscribe(
        (res: HttpResponse<IResponse>) => this.updateForm(res.body?.data)
      );
    }
  }

  updateForm(holiday: IHoliday): void {
    this.myForm.patchValue({
      id: holiday.id,
      date: formatNgbDateStructFromDate(moment(holiday.date, 'YYYY-MM-DD').toDate()),
      description: holiday.description,
      useInAgenda: holiday.useInAgenda,
      active: holiday.active,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const holiday = this.createFromForm();
    if (holiday.id) {
      this.subscribeToSaveResponse(this.holidayService.update(holiday));
    } else {
      this.subscribeToSaveResponse(this.holidayService.create(holiday));
    }
  }

  private createFromForm(): ISaveHoliday {
    return {
      id: this.myForm.get(['id'])!.value,
      active: this.myForm.get(['active'])!.value,
      date: formatDateFromNgbDateStruct(this.myForm.get(['date'])!.value)!,
      description: this.myForm.get(['description'])!.value,
      useInAgenda: this.myForm.get(['useInAgenda'])!.value,
    };
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResponse>>): void {
    result.subscribe(
      () => this.previousState(),
      () => this.isSaving = false
    );
  }
}
