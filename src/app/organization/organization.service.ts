import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';
import { IOrganization } from '../models/organization.models';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  public resourceUrl = SERVER_API_URL + 'api/organizations';

  constructor(private http: HttpClient) {}

  find(): Observable<HttpResponse<IOrganization>> {
    return this.http.get<IOrganization>(`${this.resourceUrl}`, { observe: 'response' });
  }

  update(organization: IOrganization): Observable<HttpResponse<IOrganization>> {
    return this.http.put<IOrganization>(this.resourceUrl, organization, { observe: 'response' });
  }
}
