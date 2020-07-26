import {Injectable} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Observable} from "rxjs";
import {MessageModel} from "../../shared/models/message.model";

@Injectable()
export class ChatService {

  constructor(private socket: Socket) {
  }

  public connectToRoomWith(otherUserId: string): void {
    this.socket.emit('joinRoom', otherUserId);
  }

  public getHistoryWith(): Observable<Array<MessageModel>> {
    return this.socket.fromEvent('history');
  }

  public disconnect(): void {
    this.socket.removeAllListeners();
    this.socket.disconnect();
  }

  public sendMessage(message: MessageModel) {
    this.socket.emit('send message', message);
  }

  public receiveMessage(): Observable<MessageModel> {
    return this.socket.fromEvent('getMessage');
  }
}
