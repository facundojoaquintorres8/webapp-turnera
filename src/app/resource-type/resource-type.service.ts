import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResourceType } from '../models/resourceType.models';
import { createRequestOption } from '../shared/request-util';
import { IResponse } from '../models/response.models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ResourceTypeService {
  public resourceUrl = environment.SERVER_API_URL + 'api/resources-types';

  constructor(private http: HttpClient) {}

  findAllByFilter(filter: any): Observable<HttpResponse<IResponse>> {
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'description'];
    const options = createRequestOption(filter);
    return this.http.get<IResponse>(`${this.resourceUrl}/findAllByFilter`, { params: options, observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.get<IResponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  create(resourceType: IResourceType): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(this.resourceUrl, resourceType, { observe: 'response' });
  }

  update(resourceType: IResourceType): Observable<HttpResponse<IResponse>> {
    return this.http.put<IResponse>(this.resourceUrl, resourceType, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.delete<IResponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
