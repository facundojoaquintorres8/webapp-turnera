import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';
import { IHoliday, ISaveHoliday } from '../models/holiday.models';
import { createRequestOption } from '../shared/request-util';

@Injectable({ providedIn: 'root' })
export class HolidayService {
  public holidayUrl = SERVER_API_URL + 'api/holidays';

  constructor(private http: HttpClient) {}

  findAllByFilter(filter: any): Observable<HttpResponse<IHoliday[]>> {
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'date'];
    const options = createRequestOption(filter);
    return this.http.get<IHoliday[]>(`${this.holidayUrl}/findAllByFilter`, { params: options, observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<IHoliday>> {
    return this.http.get<IHoliday>(`${this.holidayUrl}/${id}`, { observe: 'response' });
  }

  create(holiday: ISaveHoliday): Observable<HttpResponse<any>> {
    return this.http.post<IHoliday>(this.holidayUrl, holiday, { observe: 'response' });
  }

  update(holiday: ISaveHoliday): Observable<HttpResponse<IHoliday>> {
    return this.http.put<IHoliday>(this.holidayUrl, holiday, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.holidayUrl}/${id}`, { observe: 'response' });
  }
}
