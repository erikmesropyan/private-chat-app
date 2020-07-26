import {Component, Input, OnInit} from '@angular/core';
import {MessageModel} from '../../shared/models/message.model';
import {UserModel} from '../../shared/models/user.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  private _currentUser: UserModel;
  private _otherUser: UserModel;
  private _message: MessageModel;

  @Input()
  set currentUser(value: UserModel) {
    this._currentUser = value;
  }

  get currentUser() {
    return this._currentUser;
  }

  get otherUser(): UserModel {
    return this._otherUser;
  }

  @Input()
  set otherUser(value: UserModel) {
    this._otherUser = value;
  }
  @Input()
  set message(value: MessageModel) {
    this._message = value;
  }

  get message() {
    return this._message;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
