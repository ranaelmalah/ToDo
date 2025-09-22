import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {initializeApp} from "firebase/app";
import {getFirestore,collection,addDoc}from "firebase/firestore";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, SignupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  title = 'ToDo';
}
