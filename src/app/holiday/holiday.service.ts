import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISaveHoliday } from '../models/holiday.models';
import { createRequestOption } from '../shared/request-util';
import { IResponse } from '../models/response.models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class HolidayService {
  public holidayUrl = environment.SERVER_API_URL + 'api/holidays';

  constructor(private http: HttpClient) {}

  findAllByFilter(filter: any): Observable<HttpResponse<IResponse>> {
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'date'];
    const options = createRequestOption(filter);
    return this.http.get<IResponse>(`${this.holidayUrl}/findAllByFilter`, { params: options, observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.get<IResponse>(`${this.holidayUrl}/${id}`, { observe: 'response' });
  }

  create(holiday: ISaveHoliday): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(this.holidayUrl, holiday, { observe: 'response' });
  }

  update(holiday: ISaveHoliday): Observable<HttpResponse<IResponse>> {
    return this.http.put<IResponse>(this.holidayUrl, holiday, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.delete<IResponse>(`${this.holidayUrl}/${id}`, { observe: 'response' });
  }
}
