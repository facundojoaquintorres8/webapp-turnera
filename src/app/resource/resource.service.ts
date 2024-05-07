import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';
import { IResource } from '../models/resource.models';
import { createRequestOption } from '../shared/request-util';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  public resourceUrl = SERVER_API_URL + 'api/resources';

  constructor(private http: HttpClient) {}

  findAllByFilter(filter: any): Observable<HttpResponse<IResource[]>> {
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'description'];
    const options = createRequestOption(filter);
    return this.http.get<IResource[]>(`${this.resourceUrl}/findAllByFilter`, { params: options, observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<IResource>> {
    return this.http.get<IResource>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  create(resource: IResource): Observable<HttpResponse<any>> {
    return this.http.post<IResource>(this.resourceUrl, resource, { observe: 'response' });
  }

  update(resource: IResource): Observable<HttpResponse<IResource>> {
    return this.http.put<IResource>(this.resourceUrl, resource, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
