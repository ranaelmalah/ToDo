// import { Timestamp } from "rxjs";

export interface ITask {
    id?: string;
    title:string,
    description:string,
    status: 'To do' | 'In progress' | 'Completed';
    // createdAt?: Timestamp;
}