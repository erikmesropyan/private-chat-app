import { Component, OnInit } from '@angular/core';
import {UserService} from '../shared/user.service';
import {UserModel} from '../shared/user.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public users: Array<UserModel> = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.initUsers()
  }

  private initUsers() {
    this.userService.getAllUsers().subscribe(value => {
      this.users = value;
    }, error => {
      console.log(error);
    })
  }
}
