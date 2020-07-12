import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserModel} from './user.model';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {ResponseModel, Statuses} from './response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public static readonly TOKEN_KEY = 'access_token'
  public static readonly USER_KEY = 'user'

  private currentUserSubject: BehaviorSubject<UserModel> = null;
  constructor(private http: HttpClient) {
    const user = sessionStorage.getItem(UserService.USER_KEY);
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  public login (username: String): Observable<UserModel> {
    return this.http.post<ResponseModel>(environment.url + 'user/login', {username})
      .pipe(map(value => {
        if (value.status === Statuses.success) {
          localStorage.setItem(UserService.TOKEN_KEY, value.token);
          sessionStorage.setItem(UserService.USER_KEY, JSON.stringify(value.data.user));
          this.currentUser = value.data.user;
          return value.data.user
        }
        throw new Error(value.message)
      }))
  }

  set currentUser(currentUser: UserModel) {
    if (!this.currentUserSubject){
      this.currentUserSubject = new BehaviorSubject<UserModel>(currentUser);
    } else {
      this.currentUserSubject.next(currentUser)
    }
  }

  get currentUser(): UserModel {
    if (this.currentUserSubject) {
      return this.currentUserSubject.getValue();
    } else {
      return null
    }
  }

  public getAllUsers(): Observable<Array<UserModel>> {
    return this.http.get<ResponseModel>(environment.url + 'users')
      .pipe(map(value => {
        if (value.status === Statuses.success) {
          return value.data.users
        }
        throw new Error(value.message)
      }))
  }
}
