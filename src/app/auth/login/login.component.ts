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
  /**
 * Handles the user login process using provided email and password credentials.
 *
 * - Calls the authentication service to log in the user.
 * - On successful login:
 *   - Displays a success notification using Toastr.
 *   - Navigates the user to the `/home` route.
 * - On login failure:
 *   - Displays specific error messages based on the Firebase auth error code:
 *     - `auth/user-not-found` → No user found with this email.
 *     - `auth/wrong-password` → Incorrect password.
 *     - Any other error → Generic "Wrong Email or Password" message.
 *
 * @param {AuthCredentials} param0 - An object containing `email` and `password`.
 * @returns {Promise<void>} A promise that resolves after the login attempt.
 */
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
