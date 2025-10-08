import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AddTaskComponent } from "../add-task/add-task.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AddTaskComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent  {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
     
  ) {}
  logOut(): void {
    this.authService.logout().then(() => {
      this.toastr.success('User loged out ', 'success');
      this.router.navigate(['/login']);
    });
  }

}
