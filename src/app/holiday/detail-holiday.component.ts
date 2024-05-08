import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IHoliday } from '../models/holiday.models';
import { HolidayService } from './holiday.service';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-detail-holiday',
  templateUrl: './detail-holiday.component.html'
})
export class DetailHolidayComponent implements OnInit {
  holiday!: IHoliday;

  constructor(
    private holidayService: HolidayService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.holidayService.find(parseInt(id)).subscribe(
        (res: HttpResponse<IResponse>) =>  this.holiday = res.body?.data
      );
    }
  }

  previousState(): void {
    window.history.back();
  }
}
