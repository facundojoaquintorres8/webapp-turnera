import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';
import { IPermission, IProfile } from '../models/profile.models';
import { createRequestOption } from '../shared/request-util';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  public resourceUrl = SERVER_API_URL + 'api/profiles';

  constructor(private http: HttpClient) {}

  findAllByFilter(filter: any): Observable<HttpResponse<IProfile[]>> {
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'description'];
    const options = createRequestOption(filter);
    return this.http.get<IProfile[]>(`${this.resourceUrl}/findAllByFilter`, { params: options, observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<IProfile>> {
    return this.http.get<IProfile>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  create(profile: IProfile): Observable<HttpResponse<any>> {
    return this.http.post<IProfile>(this.resourceUrl, profile, { observe: 'response' });
  }

  update(profile: IProfile): Observable<HttpResponse<IProfile>> {
    return this.http.put<IProfile>(this.resourceUrl, profile, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAllPermissions(): Observable<HttpResponse<IPermission[]>> {
    return this.http.get<IPermission[]>(`${SERVER_API_URL}api/permissions`, { observe: 'response' });
  }
}
