import {Component, Input, OnInit} from '@angular/core';
import {UserModel} from "../../shared/models/user.model";
import {ChatService} from "../../shared/services/chat.service";
import {FormControl, FormGroup} from "@angular/forms";
import {MessageModel} from "../../shared/models/message.model";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  file: File = null;
  private _currentUser: UserModel;
  private _otherUser: UserModel;
  private _messageHistory: Array<MessageModel> = [];
  messageForm: FormGroup;


  @Input()
  set currentUser(value: UserModel) {
    this._currentUser = value;
  }

  get currentUser() {
    return this._currentUser;
  }

  get otherUser(): UserModel {
    return this._otherUser;
  }

  @Input()
  set otherUser(value: UserModel) {
    this._otherUser = value;
    this.chatService.connectToRoomWith(value._id);
  }

  get messageHistory(): Array<MessageModel> {
    return this._messageHistory;
  }

  @Input()
  set messageHistory(value: Array<MessageModel>) {
    this._messageHistory = value;
  }


  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.messageForm =  new FormGroup({
      message: new FormControl('')
    })

    this.chatService.receiveMessage().subscribe(value => {
      console.log(value);
      this.messageHistory.push({
        senderId: this.currentUser._id,
        receiverId: this.otherUser._id,
        message: value
        }
      );
    })
  }

  public onSubmit() {
    this.chatService.sendMessage(this.messageForm.controls.message.value);
  }

  public onChange(event: Event): void {
    this.file = (<HTMLInputElement>event.target).files[0];
    this.validateFile();
  }

  private validateFile() {
    // if (this.file.type.startsWith('image/')) {
    //   this.imgSrc = URL.createObjectURL(this.file);
    //   this.imgSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.imgSrc);
    // } else {
    //   this.file = null;
    // }
  }
}
