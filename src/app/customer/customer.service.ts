import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomer } from '../models/customer.models';
import { createRequestOption } from '../shared/request-util';
import { IResponse } from '../models/response.models';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class CustomerService {
  public resourceUrl = environment.SERVER_API_URL + 'api/customers';

  constructor(private http: HttpClient) {}

  findAllByFilter(filter: any): Observable<HttpResponse<IResponse>> {
    filter['sort'] = filter['sort'] ? filter['sort'] : ['ASC', 'businessName'];
    const options = createRequestOption(filter);
    return this.http.get<IResponse>(`${this.resourceUrl}/findAllByFilter`, { params: options, observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.get<IResponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  create(customer: ICustomer): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(this.resourceUrl, customer, { observe: 'response' });
  }

  update(customer: ICustomer): Observable<HttpResponse<IResponse>> {
    return this.http.put<IResponse>(this.resourceUrl, customer, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<IResponse>> {
    return this.http.delete<IResponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
