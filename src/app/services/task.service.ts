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
      const user =auth.currentUser;
      if(!user){ 
        observer.next([])
        return;
      }
      const taskQuery=query(this.taskCollection, where('userId', '==', user.uid))
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
  async deleteTask(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      this.toastr.error('Failed to Remove task');
      throw error;
    }
  }
}
