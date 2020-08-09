import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {MessageModel} from '../../shared/models/message.model';
import {CONFIG} from '../utils/socket.config';

@Injectable()
export class ChatService extends Socket {

  constructor() {
    super(CONFIG);
  }

  public connectToRoomWith(otherUserId: string): void {
    this.emit('joinRoom', otherUserId);
  }

  public getHistoryWith(): Observable<Array<MessageModel>> {
    return this.fromEvent('history');
  }

  // public disconnect(): void {
  //   this.removeAllListeners();
  //   this.disconnect();
  // }

  public sendMessage(message: MessageModel) {
    this.emit('send message', message);
  }

  public receiveMessage(): Observable<MessageModel> {
    return this.fromEvent('getMessage');
  }

  readMessagesWith(otherUserId: string) {
    this.emit('readAllMessagesWith', otherUserId);
  }
}
