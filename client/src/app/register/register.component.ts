import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  file: File = null;
  imgSrc: any;
  submitted = false;
  registerForm: FormGroup;

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required)
    })
  }

  public onChange(event: Event): void {
    this.file = (<HTMLInputElement>event.target).files[0];
    this.validateFile();
  }

  private validateFile() {
    if (this.file.type.startsWith('image/')) {
      this.imgSrc = URL.createObjectURL(this.file);
      this.imgSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.imgSrc);
    } else {
      this.file = null;
    }
  }

  onSubmit() {
    this.submitted = true;
  }
}
