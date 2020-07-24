import {Component, OnInit} from '@angular/core';
import {UserService} from "./shared/services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    const user = sessionStorage.getItem(UserService.USER_KEY);
    if (user) {
      this.userService.setCurrentUser(JSON.parse(user));
    }
    const token = localStorage.getItem(UserService.TOKEN_KEY)
    if (token) {
      this.userService.setToken(token);
    }
  }
}
