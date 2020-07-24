import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {UserModel} from "../models/user.model";
import {Observable} from "rxjs";
import {UserService} from "./user.service";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserDataResolverService implements Resolve<Array<UserModel>>{

  constructor(private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<UserModel>> | Promise<Array<UserModel>> | Array<UserModel> {
    return this.userService.getAllUsers().pipe(take(1));
  }
}
