import { Component, OnInit } from '@angular/core';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userEmail: string | null = null;

constructor(private toastr: ToastrService, private router: Router ,private authService:AuthService){}
  ngOnInit(): void {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.userEmail = user.email;
      } else {
        this.isLoggedIn = false;
        this.userEmail = null;
      }
    });
  }
    logOut(): void {
    this.authService.logout().then(() => {
      this.toastr.success('User logged out ', 'success');
      this.router.navigate(['/login']);
    });
  }
}