import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';
import { IOrganization } from '../models/organization.models';
import { IResponse } from '../models/response.models';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  public resourceUrl = SERVER_API_URL + 'api/organizations';

  constructor(private http: HttpClient) {}

  find(): Observable<HttpResponse<IResponse>> {
    return this.http.get<IResponse>(`${this.resourceUrl}`, { observe: 'response' });
  }

  update(organization: IOrganization): Observable<HttpResponse<IResponse>> {
    return this.http.put<IResponse>(this.resourceUrl, organization, { observe: 'response' });
  }
}
