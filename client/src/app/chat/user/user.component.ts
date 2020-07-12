import {Component, Input, OnInit} from '@angular/core';
import {UserModel} from '../../shared/user.model';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  _user: UserModel;

  @Input()
  set user(value: UserModel) {
    this._user = value;
  }

  constructor() { }

  ngOnInit(): void {
  }

  buildImageSrc(path: string) {
    return environment.urlShort + 'images/' + path;
  }
}
