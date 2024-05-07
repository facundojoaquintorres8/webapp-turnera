import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';
import { IUser } from '../models/user.models';
import { createRequestOption } from '../shared/request-util';

@Injectable({ providedIn: 'root' })
export class UserService {
  public resourceUrl = SERVER_API_URL + 'api/users';

  constructor(private http: HttpClient) {}

  findAllByFilter(filter: any): Observable<HttpResponse<IUser[]>> {
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'firstName'];
    const options = createRequestOption(filter);
    return this.http.get<IUser[]>(`${this.resourceUrl}/findAllByFilter`, { params: options, observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<IUser>> {
    return this.http.get<IUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  create(user: IUser): Observable<HttpResponse<IUser>> {
    return this.http.post<IUser>(this.resourceUrl, user, { observe: 'response' });
  }

  update(user: IUser): Observable<HttpResponse<IUser>> {
    return this.http.put<IUser>(this.resourceUrl, user, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
