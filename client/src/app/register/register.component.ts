import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../shared/services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  file: File = null;
  imgSrc: any;
  submitted = false;
  errorMsg: string = null;
  registerForm: FormGroup;

  constructor(private domSanitizer: DomSanitizer,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required)
    });
  }

  public onChange(event: Event): void {
    this.file = (event.target as HTMLInputElement).files[0];
    this.validateFile();
  }

  private validateFile() {
    if (this.file && this.file.type.startsWith('image/')) {
      this.imgSrc = URL.createObjectURL(this.file);
      this.imgSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.imgSrc);
    } else {
      this.file = null;
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMsg = null;

    if (this.registerForm.invalid) {
      return;
    }

    const data = new FormData();
    data.append('username', this.registerForm.controls.username.value);
    if (this.file) {
      data.append('picture', this.file);
    }
    this.userService.register(data).subscribe(() => {
      this.router.navigateByUrl('/chat')
        .catch(error => {
          console.log(error);
        });
    }, error => {
      this.errorMsg = error.error.message;
    });

  }
}
