import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ITask } from '../models/task';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../services/task.service';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {db} from '../../firebase.config';
import { serverTimestamp } from 'firebase/firestore';
@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent implements OnInit {
  constructor(private toastr: ToastrService,private taskService: TaskService) {}
 
tasks:ITask[]=[];
private Unsubscribe:(()=>void)|undefined
  ngOnInit(): void {
  this.Unsubscribe=this.taskService.getTasksRealtime((tasks)=>{
    this.tasks=tasks
  })
}
ngOnDestroy(): void {
  if(this.Unsubscribe){
    this.Unsubscribe()
  }
}
  taskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', Validators.required),
    status: new FormControl('To do', Validators.required),
  });

  async addTask() {
    if (this.taskForm.valid) {
      try {
        const newTask:ITask = {
          title: this.taskForm.value.title,
          description: this.taskForm.value.description,
          status: this.taskForm.value.status,
    //  createdAt: serverTimestamp(),
        };

      this.taskService.addTask(newTask).then(()=>{
        this.taskForm.reset({ status: 'To do' })
      })
        
      } catch (error) {
        this.toastr.error('Error adding task:', 'error');
      }
    }
  }
  update(id:string){
    this.taskService.updateTask()
  }
  removeTask(id:string){
    this.taskService.deleteTask()
  }
}
