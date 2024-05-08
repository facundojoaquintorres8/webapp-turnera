import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';
import { IAppointmentChangeStatus, IAppointmentSave } from '../models/appointment.model';
import { IResponse } from '../models/response.models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  public resourceUrl = SERVER_API_URL + 'api/appointments';

  constructor(private http: HttpClient) {}

  book(appointment: IAppointmentSave): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(this.resourceUrl, appointment, { observe: 'response' });
  }

  absent(appointmentChangeStatus: IAppointmentChangeStatus): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(`${this.resourceUrl}/absent`, appointmentChangeStatus, { observe: 'response' });
  }
  
  cancel(appointmentChangeStatus: IAppointmentChangeStatus): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(`${this.resourceUrl}/cancel`, appointmentChangeStatus, { observe: 'response' });
  }
  
  attend(appointmentChangeStatus: IAppointmentChangeStatus): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(`${this.resourceUrl}/attend`, appointmentChangeStatus, { observe: 'response' });
  }
  
  finalize(appointmentChangeStatus: IAppointmentChangeStatus): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(`${this.resourceUrl}/finalize`, appointmentChangeStatus, { observe: 'response' });
  }
}
