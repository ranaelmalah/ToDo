import { Component } from '@angular/core';
import {ReactiveFormsModule,FormBuilder, FormGroup,FormControl, Validators}from '@angular/forms'
import {AuthService} from '../services/auth.service';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  emailErrorMessage:string='';
  passwordErrorMessage:string='';

  constructor(private AuthService:AuthService ,private router:Router){}
  signUpForm:FormGroup=new FormGroup({
    email:new FormControl("",[Validators.required,Validators.email]),
    password:new FormControl("",[Validators.required ,Validators.minLength(6)])

  })
SubmitionSignUpForm(){
  const {email,password}=this.signUpForm.value;
  this.AuthService.signUp(email,password).then(userCredential =>{
    this.emailErrorMessage='';
   this.passwordErrorMessage='';
this.router.navigate(['/home'])

    console.log("sign sucess")
  }).catch(error=>{
    if(error.code==="auth/invalid-email"){
      this.emailErrorMessage="Invalid email format"
    }else if(error.code==="auth/email-already-in-use"){
      this.emailErrorMessage="This email is already registered"
    } else if (error.code==="auth/weak-password"){
      this.passwordErrorMessage="Password must be at least 6 characters"
    }

    console.error("error",error)
  })
  
}
}
