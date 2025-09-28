import { inject, Injectable } from '@angular/core';
import { collection, addDoc, serverTimestamp, query, orderBy, getDoc, getDocs, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { ITask } from '../models/task';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { updateDoc } from 'firebase/firestore/lite';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  
  constructor( private toastr: ToastrService) {}
 
  private taskCollection =collection(db,'tasks');
  addTask(task:ITask):Promise<any>{
    const user =auth.currentUser;
      if (!user) {
      this.toastr.error('User not logged in');
      throw new Error('User not logged in');
    }
   return addDoc(this.taskCollection,{ ...task,
      createdAt: serverTimestamp()}).then(()=>{
        this.toastr.success('Task added successfully',"success");
      }).catch((err) => {
        this.toastr.error('Failed to add task');
        throw err;
      });

  }


getTasksRealtime(callback: (tasks: any[]) => void) {
  return onSnapshot(this.taskCollection, (snapshot) => {
    const tasks = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }))as ITask[];;
    callback(tasks);
  });
}
updateTask(id :string,data:any){
return updateDoc(doc(db,"tasks",id),data)
}
deleteTask(id:string){
  return deleteDoc(doc(db,"tasks",id));
}
}
