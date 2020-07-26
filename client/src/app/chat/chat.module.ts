import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SocketIoModule} from 'ngx-socket-io';
import {ReactiveFormsModule} from '@angular/forms';

import {ChatComponent} from './chat.component';
import {UserComponent} from './user/user.component';
import {MessagesComponent} from './messages/messages.component';
import {ChatRoutingModule} from './chat-routing.module';
import {ChatService} from './services/chat.service';
import {CONFIG} from './utils/socket.config';
import { MessageComponent } from './message/message.component';
import {DatePipe} from './utils/date.pipe';

@NgModule({
  declarations: [
    DatePipe,
    ChatComponent,
    UserComponent,
    MessagesComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(CONFIG),
    ChatRoutingModule
  ],
  providers: [ChatService]
})
export class ChatModule { }
