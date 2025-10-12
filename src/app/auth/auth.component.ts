import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  @Output() formSubmit = new EventEmitter<{
    email: string;
    password: string;
  }>();
  constructor(private authService: AuthService) {}
  authForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  
  submit() {
    if (this.authForm.valid) {
      this.formSubmit.emit(this.authForm.value);
    }
  }
}
