import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AuthComponent } from '../auth.component';
import { ToastrService } from 'ngx-toastr';
import { AuthCredentials } from '../../models/auth-credentials';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, AuthComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(
    private AuthService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  submitSignUp({ email, password }: AuthCredentials): Promise<void> {
    return this.AuthService.signUp(email, password)
      .then(() => {
        this.toastr.success('login sucessful', 'success');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          this.toastr.error('This email is already in exist', 'error');
        } else {
          this.toastr.error('sign up faild', 'error');
        }
      });
  }
}
