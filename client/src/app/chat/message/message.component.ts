import {Component, Input, OnInit} from '@angular/core';

import {MessageModel} from '../../shared/models/message.model';
import {UserModel} from '../../shared/models/user.model';
import {environment} from '../../../environments/environment';

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

  buildImageSrc(path: string) {
    return environment.urlShort + 'images/' + path;
  }

  downloadFile() {
    fetch(environment.urlShort + 'messages/' + this.message.fileName)
      .then(resp => resp.blob())
      .then(blob => {
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, name);
        } else {
          const elem = window.document.createElement('a');
          elem.href = window.URL.createObjectURL(blob);
          elem.download = name;
          document.body.appendChild(elem);
          elem.click();
          document.body.removeChild(elem);
        }
      })
      .catch(() => alert('file not found!'));
  }
}
