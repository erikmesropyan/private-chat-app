import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {ChatComponent} from './chat.component';
import {UserComponent} from './user/user.component';
import {MessagesComponent} from './messages/messages.component';
import {ChatRoutingModule} from './chat-routing.module';
import {ChatService} from './services/chat.service';
import { MessageComponent } from './message/message.component';
import {DatePipe} from './utils/date.pipe';
import {UserSocketService} from './services/userSocket.service';

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
    ChatRoutingModule
  ],
  providers: [ChatService, UserSocketService]
})
export class ChatModule { }
