import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AddTaskComponent } from "../add-task/add-task.component";
import { ITask } from '../models/task';
import { TaskService } from '../services/task.service';

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
     private taskService: TaskService
  ) {}
  
  logOut(): void {
    this.authService.logout().then(() => {
      this.toastr.success('User loged out ', 'success');
      this.router.navigate(['/login']);
    });
  }

}
