import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';
import { IResourceType } from '../models/resourceType.models';
import { createRequestOption } from '../shared/request-util';

@Injectable({ providedIn: 'root' })
export class ResourceTypeService {
  public resourceUrl = SERVER_API_URL + 'api/resources-types';

  constructor(private http: HttpClient) {}

  findAllByFilter(filter: any): Observable<HttpResponse<IResourceType[]>> {
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'description'];
    const options = createRequestOption(filter);
    return this.http.get<IResourceType[]>(`${this.resourceUrl}/findAllByFilter`, { params: options, observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<IResourceType>> {
    return this.http.get<IResourceType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  create(resourceType: IResourceType): Observable<HttpResponse<IResourceType>> {
    return this.http.post<IResourceType>(this.resourceUrl, resourceType, { observe: 'response' });
  }

  update(resourceType: IResourceType): Observable<HttpResponse<IResourceType>> {
    return this.http.put<IResourceType>(this.resourceUrl, resourceType, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
