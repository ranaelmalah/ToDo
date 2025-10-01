import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITask } from '../models/task';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../services/task.service';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { serverTimestamp } from 'firebase/firestore';
import { Subject, takeUntil } from 'rxjs';
import { auth } from '../../firebase.config';
@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent implements OnInit, OnDestroy {
  constructor(
    private toastr: ToastrService,
    private taskService: TaskService
  ) {}
  modalIsOpened = false;
  isEditMode = false;
  currentUserId: string | null = null;
  private destroy$ = new Subject<void>();
  tasks: ITask[] = [];
  selectedStatus: string = 'All';
  loggeduser = auth.currentUser;
  formatDate(timestamp: any): string {
    if (!timestamp || !timestamp.toDate) return 'N/A';
    return timestamp.toDate().toLocaleString();
  }
  ngOnInit(): void {
    this.taskService
      .getTasksRealtime()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
        },
        error: (error) => {
          this.toastr.error('Error loading tasks', 'Error');
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  taskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', Validators.required),
    status: new FormControl('To do', Validators.required),
  });
  get filteredTasks(): ITask[] {
    if (this.selectedStatus === 'All') {
      return this.tasks;
    }
    return this.tasks.filter(
      (task) => task.status.toLowerCase() === this.selectedStatus.toLowerCase()
    );
  }
  openAddModal(): void {
    this.isEditMode = false;
    this.currentUserId = null;
    this.modalIsOpened = true;
    const user = auth.currentUser;
    if (!user) {
      this.modalIsOpened = false;
      this.toastr.error('Please login to add your tasks');
      throw new Error('User not logged in');
    }
  }
  openEditModal(task: ITask): void {
    this.isEditMode = true;
    this.currentUserId = task.id ?? null;
    this.taskForm.patchValue(task);
    this.modalIsOpened = true;
  }
  closeModal() {
    this.modalIsOpened = false;
  }
  async submitForm(): Promise<void> {
    if (this.taskForm.valid) {
      const formData = this.taskForm.value;
      try {
        if (this.isEditMode && this.currentUserId) {
          await this.taskService.updateTask(this.currentUserId, {
            ...formData,
            updatedAt: serverTimestamp(),
          });
         
          this.toastr.success('Task updated successfully');
        } else {
          await this.taskService.addTask({
            ...formData,
            createdAt: serverTimestamp(),
          });
         this.taskForm.reset();
          this.toastr.success('Task added successfully');
        }
        this.closeModal();
      } catch (error) {
        this.toastr.error('Failed to save task', 'Error');
      }
    }
  }
  async removeTask(id: string): Promise<void> {
    try {
      await this.taskService.deleteTask(id);
      this.toastr.success('Task removed successfully');
    } catch (error) {
      this.toastr.error('Failed to remove task');
    }
  }
}
