import { User } from 'firebase/auth';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AddTaskComponent } from '../add-task/add-task.component';
import { auth } from '../../firebase.config';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AddTaskComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}
}
