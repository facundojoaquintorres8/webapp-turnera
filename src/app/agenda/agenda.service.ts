import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';
import { ISaveAgenda } from '../models/agenda.models';
import { createRequestOption } from '../shared/request-util';
import * as momentTimeZone from 'moment-timezone';
import { IResponse } from '../models/response.models';

@Injectable({ providedIn: 'root' })
export class AgendaService {
  public resourceUrl = SERVER_API_URL + 'api/agendas';
  public viewDate: Date = new Date();

  constructor(private http: HttpClient) {}

  findAllByFilter(filter: any): Observable<HttpResponse<IResponse>> {
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'startDate'];
    filter['zoneId'] = momentTimeZone.tz.guess();
    const options = createRequestOption(filter);
    return this.http.get<IResponse>(`${this.resourceUrl}/findAllByFilter`, { params: options, observe: 'response' });
  }

  create(agenda: ISaveAgenda): Observable<HttpResponse<boolean>> {
    return this.http.post<boolean>(this.resourceUrl, agenda, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.delete<IResponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  desactivate(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.put<IResponse>(`${this.resourceUrl}/${id}/desactivate`, {} ,{ observe: 'response' });
  }
}
