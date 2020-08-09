import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {UserModel} from '../shared/models/user.model';
import {from, Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MessageModel} from '../shared/models/message.model';
import {catchError, map, take} from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  public $users: Observable<Array<UserModel>> = from([]);
  public currentUser: UserModel;
  public messageHistory: Array<MessageModel>;
  public chatWithUser: UserModel;

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initUsers();
    this.initCurrentUser();
  }

  private initUsers() {
    this.$users = this.route.data
      .pipe(map(data => {
      const value = data.users;
      if (value.length > 0) {
        this.chatWithUser = value[0];
      }
      return value;
    }), catchError(err => {
      console.log(err);
      return err;
    }));
  }

  public startChatWith(user: UserModel): void {
    this.chatWithUser = user;
    // this.getMessageHistoryWith(this.chatWithUser._id);
  }

  private initCurrentUser() {
   this.userService.getCurrentUser()
     .pipe(take(1))
     .subscribe(value => {
     this.currentUser = value;
   });
  }

  ngOnDestroy(): void {
  }
}
