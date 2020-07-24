import {Injectable} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {UserService} from "./user.service";
import {exhaustMap, take} from "rxjs/operators";
import {Observable} from "rxjs";
import {MessageModel} from "../models/message.model";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket,
              private userService: UserService) {
  }

  public connectToRoomWith(otherUserId: string): void {
    this.userService.getToken().pipe(take(1)).subscribe(token => {
      this.socket.emit('joinRoom', otherUserId, token);
    })
    // this.processToken((token) => );
  }

  public sendMessage(message: string) {
    this.socket.emit('send message', message);
  }

  public receiveMessage(): Observable<string> {
    return this.socket.fromEvent('getMessage');
  }


  private processToken(fn: Function): Observable<any> {
    return this.userService.getToken().pipe(take(1), exhaustMap(value => fn(value)))
  }
}
