import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {UserModel} from '../shared/models/user.model';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MessageModel} from "../shared/models/message.model";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  public users: Array<UserModel> = [];
  private subscriptions: Array<Subscription> = [];
  public currentUser: UserModel;
  public messageHistory: Array<MessageModel>
  public chatWithUser: UserModel;

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initUsers();
    this.initCurrentUser();
  }

  private initUsers() {
    this.subscriptions.push(this.route.data.subscribe(data => {
      this.users = data.users;
      if (this.users.length > 0) {
        this.chatWithUser = this.users[0];
        this.getMessageHistoryWith(this.chatWithUser._id);
      }
    }, error => {
      console.log(error);
    }))
  }

  public startChatWith(user: UserModel): void {
    this.chatWithUser = user;
    this.getMessageHistoryWith(this.chatWithUser._id);
  }

  private initCurrentUser() {
   this.subscriptions.push(this.userService.getCurrentUser().subscribe(value => {
     this.currentUser = value;
   }))
  }

  private getMessageHistoryWith(userId: string) {
    this.subscriptions.push(this.userService.getConversationHistoryWith(userId).subscribe(data => {
      this.messageHistory = data || [];
    }))
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      })
    }
  }
}
