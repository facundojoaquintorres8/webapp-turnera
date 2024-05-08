import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';
import { IProfile } from '../models/profile.models';
import { createRequestOption } from '../shared/request-util';
import { IResponse } from '../models/response.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  public resourceUrl = SERVER_API_URL + 'api/profiles';

  constructor(private http: HttpClient) {}

  findAllByFilter(filter: any): Observable<HttpResponse<IResponse>> {
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'description'];
    const options = createRequestOption(filter);
    return this.http.get<IResponse>(`${this.resourceUrl}/findAllByFilter`, { params: options, observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.get<IResponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  create(profile: IProfile): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(this.resourceUrl, profile, { observe: 'response' });
  }

  update(profile: IProfile): Observable<HttpResponse<IResponse>> {
    return this.http.put<IResponse>(this.resourceUrl, profile, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.delete<IResponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAllPermissions(): Observable<HttpResponse<IResponse>> {
    return this.http.get<IResponse>(`${SERVER_API_URL}api/permissions`, { observe: 'response' });
  }
}
