import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.models';
import { createRequestOption } from '../shared/request-util';
import { IResponse } from '../models/response.models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  public resourceUrl = environment.SERVER_API_URL + 'api/users';

  constructor(private http: HttpClient) {}

  findAllByFilter(filter: any): Observable<HttpResponse<IResponse>> {
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'firstName'];
    const options = createRequestOption(filter);
    return this.http.get<IResponse>(`${this.resourceUrl}/findAllByFilter`, { params: options, observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.get<IResponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  create(user: IUser): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(this.resourceUrl, user, { observe: 'response' });
  }

  update(user: IUser): Observable<HttpResponse<IResponse>> {
    return this.http.put<IResponse>(this.resourceUrl, user, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.delete<IResponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
