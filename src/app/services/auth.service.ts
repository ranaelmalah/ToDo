import { Injectable } from '@angular/core';
import { auth } from '../../firebase.config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Creates a new user account with the provided email and password
    using Firebase Authentication
    @param {string} email - The email address for the new user account
    @param {string} password - The password for the new user account
    @returns {Promise<UserCredential>} 
  */
  signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  /**
  Authenticates an existing user with the provided email and password
  using Firebase Authentication
 
  @param {string} email - The email address of the user
  @param {string} password - The password of the user
  @returns {Promise<UserCredential>} A promise that resolves with the user credential upon successful authentication
 */
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }
  /**
 * Signs out the currently authenticated user from Firebase Authentication.
 * 
 * @returns {Promise<void>} A promise that resolves when the sign-out operation is complete
 */
  logout(): Promise<void> {
    return signOut(auth);
  }
}
