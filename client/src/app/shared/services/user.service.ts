import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserModel} from '../models/user.model';
import {environment} from '../../../environments/environment';
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import {ResponseModel, Statuses} from '../models/response.model';
import {MessageModel} from "../models/message.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public static readonly TOKEN_KEY = 'access_token'
  public static readonly USER_KEY = 'user'

  private currentUserSubject: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(null);
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient) {
  }

  public login(username: String): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(environment.url + 'users/login', {username})
      .pipe(tap(value => {
        if (value.status === Statuses.success) {
          localStorage.setItem(UserService.TOKEN_KEY, value.token);
          sessionStorage.setItem(UserService.USER_KEY, JSON.stringify(value.data.user));
          this.setToken(value.token);
          this.setCurrentUser(value.data.user);
        } else {
          throw new Error(value.message);
        }
      }))
  }

  setCurrentUser(currentUser: UserModel) {
    if (!this.currentUserSubject) {
      this.currentUserSubject = new BehaviorSubject<UserModel>(currentUser);
    } else {
      this.currentUserSubject.next(currentUser)
    }
  }

  setToken(token: string) {
    if (!this.tokenSubject) {
      this.tokenSubject = new BehaviorSubject<string>(token);
    } else {
      this.tokenSubject.next(token)
    }
  }

  getCurrentUser(): Observable<UserModel> {
    return this.currentUserSubject;
  }

  getToken(): Observable<string> {
    return this.tokenSubject;
  }

  public getAllUsers(): Observable<Array<UserModel>> {
    return this.getToken()
      .pipe(
        take(1),
        exhaustMap(this.handleTokenCreation('users')),
        map(this.handleMap('users')));

  }

  public getConversationHistoryWith(userId: string): Observable<Array<MessageModel>> {
    return this.getToken()
      .pipe(
        take(1),
        exhaustMap(this.handleTokenCreation('users/history/' + userId)),
        map(this.handleMap('history')));
  }

  private handleMap(returnFieldName: string) {
    return value => {
      if (value.status === Statuses.success) {
        return value.data[returnFieldName]
      }
      throw new Error(value.message)
    }
  }

  private handleTokenCreation(url: string) {
    return token => {
      return this.http.get<ResponseModel>(environment.url + url, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    }
  }
}
