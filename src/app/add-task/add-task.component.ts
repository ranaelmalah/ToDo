import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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
import { auth } from '../../firebase.config';
import { Timestamp } from 'firebase/firestore';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent implements OnInit {
  modalIsOpened = false;
  isEditMode = false;
  currentUserId: string | null = null;
  private destroyRef = inject(DestroyRef);
  tasks: ITask[] = [];
  selectedStatus = 'All';
  loggeduser = auth.currentUser;
  taskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', Validators.required),
    status: new FormControl('To do', Validators.required),
  });
  /**
   *@description  Returns a filtered list of tasks based on the currently selected status
   * If the selected status is 'All', all tasks are returned.
   * Otherwise, only the tasks whose status matches the selected status are included
   * @returns An array of tasks filtered by the selected status
   */
  get filteredTasks(): ITask[] {
    if (this.selectedStatus === 'All') {
      return this.tasks;
    }
    return this.tasks.filter(
      (task) => task.status.toLowerCase() === this.selectedStatus.toLowerCase()
    );
  }
  constructor(
    private toastr: ToastrService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }
  /**
   *@description Subscribes to the real-time task stream from Firestore.
   * Updates the local task list whenever changes occur.
   * Displays an error message if loading fails.
   * @returns{void}void
   */
  private loadTasks(): void {
    this.taskService
      .getTasksRealtime()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks.map((task) => ({
            ...task,
            createdAt:
              task.createdAt instanceof Date
                ? task.createdAt
                : (task.createdAt as Timestamp)?.toDate() ?? new Date(),
            updatedAt:
              task.updatedAt instanceof Date
                ? task.updatedAt
                : (task.updatedAt as unknown as Timestamp)?.toDate() ?? null,
          }));
        },
        error: (error) => {
          this.toastr.error('Error loading tasks', 'Error');
        },
      });
  }
  /**
   *@description converts a firebase timestamp or JS to readable string time
   * @param timestamp
   * @returns a formated date and time string
   */
  formatDate(time: Date): string {
    if (!time) return 'N/A';
    return time.toLocaleString();
  }
  /**
   *@description open the modal for adding a new task
   * Sets the component to add mode, clears any existing task data,
   * and ensures the user is logged in before opening the modal.
   * @throws{Error}if user not logged in
   * @returns{void}void
   */
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
  /**
   *@description open the modal for editing existing task
   * Sets the component to edit mode, fills the task form
   * with the selected task's data, and opens the modal for editing.
   * @param task - the task to be edited
   * @returns{void}void
   */
  openEditModal(task: ITask): void {
    this.isEditMode = true;
    this.currentUserId = task.id ?? null;
    this.taskForm.patchValue(task);
    this.modalIsOpened = true;
  }
  /**
   *@description Closes the modal window.
   * Sets `modalIsOpened` to false to hide the modal.
   * @returns{void}void
   */
  closeModal(): void {
    this.modalIsOpened = false;
  }
  /**
   *@description Handles adding or updating a task when the user submits the form.
   *
   * - If the form is valid:
   *   - When in edit mode, it updates the existing task and sets an updated timestamp.
   *   - When not in edit mode, it adds a new task with a created timestamp.
   * - Shows success or error messages using Toastr.
   * - Closes the modal after the operation.
   * @returns {Promise<void>} A promise that resolves when the submitForm  is complete
   */
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
  /**
   * @description Removes a task from the database using its unique ID.
   * - Calls the task service to delete the specified task.
   * - Displays a success notification if the deletion is successful.
   * - Shows an error notification if the operation fails.
   *
   * @param {string} id - The unique identifier of the task to be deleted.
   * @returns {Promise<void>} A promise that resolves once the deletion process completes.
   */
  async removeTask(id: string): Promise<void> {
    try {
      await this.taskService.deleteTask(id);
      this.toastr.success('Task removed successfully');
    } catch (error) {
      this.toastr.error('Failed to remove task');
    }
  }
}
