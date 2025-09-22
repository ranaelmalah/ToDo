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

  
  constructor(private authservices:AuthService, private router:Router){}


  loginForm:FormGroup=new FormGroup({
    email: new FormControl("",[Validators.email,Validators.required]) ,
    password:new FormControl("" ,[Validators.required])
  })

  SubmitionLoginForm(){
  const {email,password}=this.loginForm.value;

  this.authservices.login(email , password).then(userCredential =>{
    console.log("sucess")
  }).catch(error=>{
    console.error("faild",error)
  })
  if(this.loginForm.valid){
    this.router.navigate(['/home']);
    
  }
}
}
