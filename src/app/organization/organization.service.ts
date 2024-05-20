import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrganization } from '../models/organization.models';
import { IResponse } from '../models/response.models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  public resourceUrl = environment.SERVER_API_URL + 'api/organizations';

  constructor(private http: HttpClient) {}

  find(): Observable<HttpResponse<IResponse>> {
    return this.http.get<IResponse>(`${this.resourceUrl}`, { observe: 'response' });
  }

  update(organization: IOrganization): Observable<HttpResponse<IResponse>> {
    return this.http.put<IResponse>(this.resourceUrl, organization, { observe: 'response' });
  }
}
