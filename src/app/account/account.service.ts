import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IActivateAccount, IPasswordChange, IPasswordReset, IPasswordResetRequest, IRegister } from '../models/account.models';
import { IResponse } from '../models/response.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public resourceUrl = environment.SERVER_API_URL + 'api/account';

  constructor(private http: HttpClient) {}

  register(register: IRegister): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(`${this.resourceUrl}/register`, register, { observe: 'response' });
  }

  activate(activate: IActivateAccount): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(`${this.resourceUrl}/activate`, activate, { observe: 'response' });
  }

  passwordResetRequest(passwordResetRequest: IPasswordResetRequest): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(`${this.resourceUrl}/password-reset/request`, passwordResetRequest, { observe: 'response' });
  }

  passwordReset(passwordReset: IPasswordReset): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(`${this.resourceUrl}/password-reset`, passwordReset, { observe: 'response' });
  }

  passwordChange(passwordChange: IPasswordChange): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(`${this.resourceUrl}/password-change`, passwordChange, { observe: 'response' });
  }
}
