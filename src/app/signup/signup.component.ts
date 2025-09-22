import { Component } from '@angular/core';
import {ReactiveFormsModule,FormBuilder, FormGroup,FormControl, Validators}from '@angular/forms'
import {AuthService} from '../services/auth.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(private AuthService:AuthService){}
  signUpForm:FormGroup=new FormGroup({
    email:new FormControl("",[Validators.required,Validators.email]),
    password:new FormControl("",[Validators.required ,Validators.minLength(6)])

  })
SubmitionSignUpForm(){
  const {email,password}=this.signUpForm.value;
  this.AuthService.signUp(email,password).then(userCredential =>{
    console.log("sign sucess")
  }).catch(error=>{
    console.error("error",error)
  })
}
}
