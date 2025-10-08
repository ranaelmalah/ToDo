import { Injectable } from '@angular/core';
import { auth } from '../../firebase.config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  logout() {
    return signOut(auth);
  }
}
