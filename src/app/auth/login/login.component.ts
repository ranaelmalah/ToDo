import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink, Router } from '@angular/router';
import { AuthComponent } from '../auth.component';
import { ToastrService } from 'ngx-toastr';
import { AuthCredentials } from '../../models/auth-credentials';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  submitLogin({ email, password }: AuthCredentials): Promise<void> {
    return this.authService
      .login(email, password)
      .then(() => {
        this.toastr.success('login successfuly', 'success');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          this.toastr.error('No user found with this email', 'error');
        } else if (error.code === 'auth/wrong-password') {
          this.toastr.error('Incorrect password', 'error');
        } else {
          this.toastr.error('Wrong Email or Password', 'error');
        }
      });
  }
}
