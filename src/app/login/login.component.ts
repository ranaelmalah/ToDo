import { Component } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,FormControl,FormGroup, Validators}from '@angular/forms' 
import{AuthService}from '../services/auth.service';
import { RouterLink,Router } from "@angular/router";
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  emailErrorMessage:string='';
  passwordErrorMessage:string='';

  constructor(private authservices:AuthService, private router:Router){}


  loginForm:FormGroup=new FormGroup({
    email: new FormControl("",[Validators.email,Validators.required]) ,
    password:new FormControl("" ,[Validators.required,Validators.minLength(6)])
  })

  SubmitionLoginForm(){
  const {email,password}=this.loginForm.value;

  this.authservices.login(email , password).then(userCredential =>{
    this.emailErrorMessage=''
    this.passwordErrorMessage=''
    console.log("sucess")
    this.router.navigate(['/home']);

  }).catch(error=>{
      if(error.code==="auth/invalid-email"){
      this.emailErrorMessage="Invalid email format"
    }
    else if(error.code==="auth/invalid-credential"){
      this.passwordErrorMessage="Wrong Email Or Password"
    }
    else if (error.code==="auth/weak-password"){
      this.passwordErrorMessage="Password must be at least 6 characters"
    }
    console.error("faild",error)


  })

}
}
