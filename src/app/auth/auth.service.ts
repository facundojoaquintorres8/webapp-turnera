import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILogin, ISessionUser } from '../models/login.models';
import { IUser } from '../models/user.models';
import { IResponse } from '../models/response.models';
import { environment } from 'src/environments/environment';
import { EncryptStorage } from 'encrypt-storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public resourceUrl = environment.SERVER_API_URL + 'api/authenticate';
  private encryptStorage: EncryptStorage = new EncryptStorage(environment.ENCRYPT_STORAGE_KEY);

  constructor(private http: HttpClient) {}

  login(login: ILogin): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(this.resourceUrl, login, { observe: 'response' });
  }

  public logout(): void {
    this.encryptStorage.removeItem('user');
    this.encryptStorage.removeItem('jwt');
  }

  public onLoginSuccess(login: ISessionUser): void {
    this.setSessionUser(login.user);
    this.setToken(login.token);
  }

  public isAuthenicate(): boolean {
    return this.getSessionUser() !== null && this.getToken() !== null;
  }

  private setSessionUser(user: IUser): void {
    this.encryptStorage.setItem('user', JSON.stringify(user));
  }

  public getSessionUser(): IUser | null {
    return this.encryptStorage.getItem('user')!;
  }

  private setToken(jwt: string): void {
    this.encryptStorage.setItem('jwt', jwt);
  }

  public getToken(): string | null {
    return this.encryptStorage.getItem('jwt')!;
  }

  public getPermissions(): string[] {
    let sessionUserPermissions: string[] = [];
    const groupPermissionsByProfile = this.getSessionUser()?.profiles.map(x => x.permissions.map(y => y.code));
    groupPermissionsByProfile?.forEach(p => {
        sessionUserPermissions = [...sessionUserPermissions, ...p];
    });
    return sessionUserPermissions;
  }

}
