import { inject, Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDoc,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
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
  constructor(private toastr: ToastrService) {}

  private taskCollection = collection(db, 'tasks');
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
  getTasksRealtime(): Observable<ITask[]> {
    return new Observable<ITask[]>((observer) => {
      return onSnapshot(
        this.taskCollection,
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
  async updateTask(id: string, data: Partial<ITask>): Promise<void> {
    try {
      await updateDoc(doc(db, 'tasks', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      this.toastr.error('Failed to update task');
      throw error;
    }
  }
  async deleteTask(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      this.toastr.error('Failed to Remove task');
      throw error;
    }
  }
}
