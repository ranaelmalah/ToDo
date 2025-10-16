import {  Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { ITask } from '../models/task';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { updateDoc } from 'firebase/firestore';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskCollection = collection(db, 'tasks');
  constructor(private toastr: ToastrService) {}
  /**
   *@description Adds a new task to the Firestore 'tasks' collection.
   * Ensure that the user logged in before adding the task
   * Automatically attaches the current user's ID.
   * Sets the creation timestamp using `serverTimestamp()`.
   * @param task :The task data (excluding `id` and `createdAt`)
   * @returns A promise that resolves with the newly created document ID.
   * @throws {Error} If the user is not logged in or Firestore fails to add the task.
   */
  async addTask(task: Omit<ITask, 'id' | 'createdAt'>): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      this.toastr.error('User not logged in');
      throw new Error('User not logged in');
    }
    try {
      const docRef = await addDoc(this.taskCollection, {
        ...task,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      this.toastr.error('Failed to add task');
      throw err;
    }
  }
  /**
   *@description Retrieves tasks from Firestore in real-time.
   * Subscribes to the 'tasks' collection and listens for updates.
   * Emits an array of `ITask` objects whenever a change occurs.
   * Shows an error notification if fetching fails.
   * @returns An observable that emits the current list of values
   */
  getTasksRealtime(): Observable<ITask[]> {
    return new Observable<ITask[]>((observer) => {
      const user = auth.currentUser;
      if (!user) {
        observer.next([]);
        return;
      }
      const taskQuery = query(
        this.taskCollection,
        where('userId', '==', user.uid)
      );
      return onSnapshot(
        taskQuery,
        (snapshot) => {
          const tasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ITask[];
          observer.next(tasks);
        },
        (error) => {
          observer.error(error);
          this.toastr.error('Failed to fetch tasks');
        }
      );
    });
  }
  /**
   *@description Updates an existing task in Firestore.
   * Automatically updates the `updatedAt` field with the current server time.
   * @param id : the uniqe ID of the task to update
   * @param data : data feild to update in the task
   * @returns A promise that resolves when the update completes.
   * @throws {Error} If the update fails.
   */
  async updateTask(id: string, data: Partial<ITask>): Promise<void> {
    try {
      const user=auth.currentUser;
      if(!user){
        throw new Error('User not logged in');
      }
      await updateDoc(doc(db, 'tasks', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      this.toastr.error('Failed to update task');
      throw error;
    }
  }
  /**
   *@description Deletes a task from Firestore by its ID.
   * Removes the document from the 'tasks' collection.
   * Displays a notification if an error occurs.
   * @param id : The unique ID of the task to delete.
   * @returns A promise that resolves when the task is deleted.
   * @throws {Error} If deletion fails.
   */
  async deleteTask(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      this.toastr.error('Failed to Remove task');
      throw error;
    }
  }
}
