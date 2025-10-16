import { Timestamp } from "firebase/firestore";

export interface ITask {
  id?: string;
  title: string;
  description: string;
  status: 'To do' | 'In progress' | 'Completed';
  createdAt:Date;
  updatedAt?: Date;
  userId?: string;
}
