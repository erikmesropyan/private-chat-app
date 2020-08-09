import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from '../../shared/models/user.model';
import {environment} from '../../../environments/environment';
import {UserSocketService} from '../services/userSocket.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ChatService} from '../services/chat.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  _user: UserModel;
  _selectedUserId: string;
  private $destroy = new Subject<boolean>();

  @Input()
  set user(value: UserModel) {
    this._user = value;
  }

  @Input()
  set selectedUserId(value: string) {
    this._selectedUserId = value;
    if (this._selectedUserId === this._user._id) {
      this._user.newMessagesCount = 0;
      // send request to server to update user
    }
  }

  constructor(private userSocketService: UserSocketService,
              private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.onNewMessages();
  }

  buildImageSrc(path: string) {
    return environment.urlShort + 'images/' + path;
  }

  onNewMessages() {
    this.userSocketService.newMessage().pipe(takeUntil(this.$destroy)).subscribe(message => {
      if (this._user._id === message.senderId) {
        if (this._selectedUserId !== message.senderId) {
          this._user.newMessagesCount++;
        } else {
          this.chatService.readMessagesWith(this._user._id);
      }
    }
    });
  }

  ngOnDestroy(): void {
    this.userSocketService.removeAllListeners();
    this.userSocketService.disconnect();
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
