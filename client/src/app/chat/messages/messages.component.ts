import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserModel} from "../../shared/models/user.model";
import {ChatService} from "../services/chat.service";
import {FormControl, FormGroup} from "@angular/forms";
import {MessageModel} from "../../shared/models/message.model";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  private file: File = null;
  private _currentUser: UserModel;
  private _otherUser: UserModel;
  private _messageHistory: Array<MessageModel>;
  private $destroy = new Subject<boolean>();

  messageForm: FormGroup;

  @ViewChild('scrollableDiv', {
    static: false
  }) private messageContainer: ElementRef;

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


  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      message: new FormControl('')
    });
    this.initHistory();
    this.handleNewMessages();
  }

  private initHistory(): void {
    this.chatService.getHistoryWith()
      .pipe(takeUntil(this.$destroy))
      .subscribe(value => {
        this.messageHistory = value || [];
      })
  }

  private handleNewMessages(): void {
    this.chatService.receiveMessage()
      .pipe(takeUntil(this.$destroy))
      .subscribe(value => {
        this.messageHistory.push(value);
        this.scrollToBottom();
      })
  }


  public onSubmit() {
    this.chatService.sendMessage(
      {
        message: this.messageForm.controls.message.value,
        receiverId: this.currentUser._id,
        senderId: this.otherUser._id
      }
    );
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

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.messageContainer.nativeElement.scroll({
          top: this.messageContainer.nativeElement.scrollHeight,
          left: 0,
          behavior: 'smooth'
        })
      }, 1)
    } catch (err) {
    }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
