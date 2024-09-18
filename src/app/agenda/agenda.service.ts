import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateAgenda, IUpdateAgenda } from '../models/agenda.models';
import { createRequestOption } from '../shared/request-util';
import * as momentTimeZone from 'moment-timezone';
import { IResponse } from '../models/response.models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AgendaService {
  public resourceUrl = environment.SERVER_API_URL + 'api/agendas';
  public viewDate: Date = new Date();

  constructor(private http: HttpClient) {}

  
  getAgendasForAMonth(filter: any): Observable<HttpResponse<IResponse>> { // TODO: ver si lo uso en calendario
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'startDate'];
    filter['zoneId'] = momentTimeZone.tz.guess();
    const options = createRequestOption(filter);
    return this.http.get<IResponse>(`${this.resourceUrl}/getAgendasForAMonth`, { params: options, observe: 'response' });
  }

  findAllByFilter(filter: any): Observable<HttpResponse<IResponse>> {
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'startDate'];
    filter['zoneId'] = momentTimeZone.tz.guess();
    const options = createRequestOption(filter);
    return this.http.get<IResponse>(`${this.resourceUrl}/findAllByFilter`, { params: options, observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.get<IResponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  create(agenda: ICreateAgenda): Observable<HttpResponse<boolean>> {
    return this.http.post<boolean>(this.resourceUrl, agenda, { observe: 'response' });
  }

  update(agenda: IUpdateAgenda): Observable<HttpResponse<IResponse>> {
    return this.http.put<IResponse>(this.resourceUrl, agenda, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.delete<IResponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  desactivate(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.put<IResponse>(`${this.resourceUrl}/${id}/desactivate`, {} ,{ observe: 'response' });
  }

  activate(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.put<IResponse>(`${this.resourceUrl}/${id}/activate`, {} ,{ observe: 'response' });
  }
}
